import { projectRequestSchema } from '../_shared/project-request.js'
import { z } from 'zod'

const schema = projectRequestSchema.extend({ requestId: z.string().uuid() })
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('')

export function createInquiryHandler({ publicKey, allowedOrigins, ipSalt, store, mail }) {
  return async request => {
    const origin = request.headers.get('origin') || ''
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin', ...(allowedOrigins.includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'apikey, content-type, authorization, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } : {}) }
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers })
    if (request.method === 'OPTIONS') return new Response(null, { status: allowedOrigins.includes(origin) ? 204 : 403, headers })
    if (request.method !== 'POST') return reply(405, { success: false, message: 'Utilisez le formulaire pour envoyer votre demande.' })
    if (!publicKey || request.headers.get('apikey') !== publicKey) return reply(401, { success: false, message: 'Rouvrez le formulaire depuis le portfolio.' })
    let body
    try {
      if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { success: false, message: 'Le format de la demande n’est pas reconnu.' })
      const text = await request.text()
      if (new TextEncoder().encode(text).byteLength > 32768) return reply(413, { success: false, message: 'La demande est trop longue.' })
      body = JSON.parse(text)
    } catch { return reply(400, { success: false, message: 'La demande n’a pas pu être lue.' }) }
    try {
      if (body.operation === 'retry') {
        const token = request.headers.get('x-portfolio-retry-token') || ''
        if (!token || token.length > 200 || !await store.authorizeRetry(await hash(token))) return reply(403, { success: false })
        if (!mail.ready) return reply(200, { processed: 0, emailConfigured: false })
        const jobs = await store.claim(null, 5)
        let sent = 0
        for (const job of jobs) if (await deliver(job, store, mail)) sent++
        return reply(200, { processed: jobs.length, sent })
      }
      if (!allowedOrigins.includes(origin)) return reply(403, { success: false, message: 'Envoyez votre demande depuis le portfolio.' })
      const parsed = schema.safeParse(body)
      if (!parsed.success) return reply(400, { success: false, message: 'Vérifiez les champs indiqués.', fields: parsed.error.flatten().fieldErrors })
      const { requestId, website, ...payload } = parsed.data
      if (website) return reply(400, { success: false, message: 'L’envoi n’a pas abouti. Vous pouvez me contacter directement par e-mail.' })
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() || 'unknown'
      const record = await store.register({ id: requestId, payload, fingerprint: await hash(JSON.stringify(payload)), ipHash: await hash(`${ipSalt}|${ip}`) })
      if (record.outcome === 'limited') return reply(429, { success: false, message: 'Plusieurs demandes ont été envoyées. Réessayez dans quelques minutes ou contactez-moi par e-mail.' })
      if (record.outcome === 'conflict') return reply(409, { success: false, message: 'La demande a changé. Renvoyez le formulaire.' })
      let emailed = record.email_status === 'sent'
      if (!emailed && mail.ready) {
        const [job] = await store.claim(record.id, 1)
        if (job) emailed = await deliver(job, store, mail)
      }
      return reply(emailed ? 200 : 202, { success: true, reference: record.reference, emailStatus: emailed ? 'sent' : 'pending' })
    } catch (error) {
      console.error('portfolio_inquiry_error', error.code || 'BACKEND_ERROR')
      return reply(503, { success: false, message: 'Votre demande n’a pas pu être enregistrée. Votre contenu est conservé ; réessayez ou envoyez-le directement par e-mail.' })
    }
  }
}

async function deliver(job, store, mail) {
  try {
    await mail.send(job)
    await store.finish(job.id, true, null)
    return true
  } catch (error) {
    await store.finish(job.id, false, error.code || 'EMAIL_FAILED')
    return false
  }
}
