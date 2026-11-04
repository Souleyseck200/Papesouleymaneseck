import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createInquiryHandler } from '../functions/portfolio-inquiry/handler.js'
import { composeProjectMail } from '../functions/_shared/email.js'
import { createResendMail } from '../functions/portfolio-inquiry/services.js'

const origin = 'http://127.0.0.1:5174'
const valid = () => ({ requestId: randomUUID(), kind: 'project', name: 'Client de test', email: 'client@example.com', company: 'Entreprise exemple', phone: '+221 77 000 00 00', subject: 'Plateforme de gestion des locations', projectType: 'Plateforme web et mobile', budget: 'À discuter', deadline: 'Dans trois mois', message: 'Nous souhaitons une plateforme pour suivre les locations, les paiements et les contrats de nos clients.', website: '' })
function setup({ ready = true, failMail = false, limited = false } = {}) {
  const records = new Map(), emails = []
  const store = {
    async register({ id, payload, fingerprint, ipHash }) {
      assert.equal(ipHash.length, 64)
      if (limited) return { outcome: 'limited' }
      const old = records.get(id)
      if (old && old.fingerprint !== fingerprint) return { outcome: 'conflict' }
      if (!old) records.set(id, { id, payload, fingerprint, reference: 'PSS-' + id.slice(0, 12), email_status: 'pending', created_at: '2026-11-04T17:30:00Z' })
      return { outcome: old ? 'duplicate' : 'accepted', ...records.get(id) }
    },
    async claim(id, limit) { return [...records.values()].filter(row => (!id || row.id === id) && row.email_status === 'pending').slice(0, limit) },
    async finish(id, sent, error) { Object.assign(records.get(id), { email_status: sent ? 'sent' : 'pending', email_error: error }) },
    async authorizeRetry() { return false },
  }
  const mail = { ready, async send(job) { if (failMail) throw Object.assign(Error('provider unavailable'), { code: 'RESEND_503' }); emails.push(composeProjectMail({ ...job.payload, created_at: job.created_at }, job.reference, 'onboarding@resend.dev')) } }
  const handler = createInquiryHandler({ publicKey: 'test-public', allowedOrigins: [origin], ipSalt: 'test-salt', store, mail })
  const submit = async (payload, headerOverrides = {}) => {
    const response = await handler(new Request('https://test.supabase.co/functions/v1/portfolio-inquiry', { method: 'POST', headers: { Origin: origin, apikey: 'test-public', 'Content-Type': 'application/json', ...headerOverrides }, body: typeof payload === 'string' ? payload : JSON.stringify(payload) }))
    return { status: response.status, body: await response.json() }
  }
  return { submit, records, emails }
}

test('la demande est enregistrée et le mail contient tous les champs avec Reply-To', async () => {
  const { submit, records, emails } = setup(), request = valid()
  const result = await submit(request)
  assert.equal(result.status, 200)
  assert.equal(result.body.emailStatus, 'sent')
  assert.equal(records.size, 1)
  assert.equal(emails[0].to, 'Souleymaneseck996@gmail.com')
  assert.equal(emails[0].replyTo.address, request.email)
  for (const value of [request.company, request.phone, request.budget, request.deadline, request.message]) assert.ok(emails[0].text.includes(value))
})
test('sans service mail, la demande est conservée sans prétendre que le mail est envoyé', async () => {
  const { submit, records, emails } = setup({ ready: false })
  const result = await submit(valid())
  assert.equal(result.status, 202)
  assert.equal(result.body.success, true)
  assert.equal(result.body.emailStatus, 'pending')
  assert.equal(records.size, 1)
  assert.equal(emails.length, 0)
})
test('une panne du mail conserve la demande en attente', async () => {
  const { submit, records } = setup({ failMail: true })
  const result = await submit(valid())
  assert.equal(result.status, 202)
  assert.equal(result.body.emailStatus, 'pending')
  assert.equal([...records.values()][0].email_error, 'RESEND_503')
})
test('une nouvelle tentative identique ne duplique ni demande ni e-mail', async () => {
  const { submit, records, emails } = setup(), request = valid()
  const first = await submit(request), second = await submit(request)
  assert.equal(first.body.reference, second.body.reference)
  assert.equal(records.size, 1)
  assert.equal(emails.length, 1)
  assert.equal((await submit({ ...request, subject: 'Autre projet' })).status, 409)
})
test('les champs invalides et le honeypot ne sont pas enregistrés', async () => {
  const { submit, records } = setup()
  const bad = await submit({ ...valid(), email: 'incorrect', message: 'court' })
  assert.equal(bad.status, 400)
  assert.ok(bad.body.fields.email)
  assert.ok(bad.body.fields.message)
  assert.equal((await submit({ ...valid(), website: 'robot' })).status, 400)
  assert.equal(records.size, 0)
})
test('les origines et clés non prévues sont refusées', async () => {
  const { submit, records } = setup()
  assert.equal((await submit(valid(), { Origin: 'https://autre.example' })).status, 403)
  assert.equal((await submit(valid(), { apikey: 'wrong' })).status, 401)
  assert.equal(records.size, 0)
})
test('le worker de reprise demande son jeton dédié', async () => {
  const { submit } = setup()
  assert.equal((await submit({ operation: 'retry' })).status, 403)
})
test('la taille et le débit sont contrôlés', async () => {
  const { submit } = setup()
  assert.equal((await submit({ ...valid(), message: 'x'.repeat(40000) })).status, 413)
  assert.equal((await submit('{malformed')).status, 400)
  assert.equal((await setup({ limited: true }).submit(valid())).status, 429)
})
test('le template échappe le HTML, nettoie le sujet et distingue le recrutement', () => {
  const message = composeProjectMail({ ...valid(), kind: 'recruitment', name: '<Client>', subject: 'Poste\r\nDeuxième ligne', created_at: '2026-11-04T17:30:00Z' }, 'PSS-TEST', 'onboarding@resend.dev')
  assert.match(message.html, /&lt;Client&gt;/)
  assert.doesNotMatch(message.html, /<Client>/)
  assert.doesNotMatch(message.subject, /[\r\n]/)
  assert.match(message.html, /proposition de recrutement/)
  assert.match(message.html, /Répondre par e-mail/)
})

test('Resend reçoit l’adresse Gmail canonique du propriétaire et une clé d’idempotence', async () => {
  let submitted
  const mail = createResendMail('test-key', 'onboarding@resend.dev', { fetchImpl: async (url, options) => { submitted = { url, ...options, body: JSON.parse(options.body) }; return Response.json({ id: 'provider-test-id' }) } })
  const request = valid()
  await mail.send({ id: request.requestId, reference: 'PSS-TEST', payload: request, created_at: '2026-11-04T17:30:00Z' })
  assert.deepEqual(submitted.body.to, ['souleymaneseck996@gmail.com'])
  assert.equal(submitted.body.reply_to, request.email)
  assert.equal(submitted.headers['Idempotency-Key'], `portfolio-inquiry/${request.requestId}`)
})
