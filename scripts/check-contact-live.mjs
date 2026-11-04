import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const env = Object.fromEntries((await readFile('.env.local', 'utf8')).split(/\r?\n/).filter(line => line && !line.startsWith('#')).map(line => { const split = line.indexOf('='); return [line.slice(0, split), line.slice(split + 1)] }))
const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_PUBLISHABLE_KEY
const requestId = randomUUID()
const payload = { requestId, kind: 'project', name: 'Test du portfolio', email: 'Souleymaneseck996@gmail.com', company: 'Vérification technique — pas un client', phone: '', subject: '[TEST] Vérification du formulaire du portfolio', projectType: 'Application web', budget: 'Sans objet — test', deadline: 'Sans objet — test', message: 'Ceci est un test technique autorisé du formulaire de Pape Souleymane Seck. Il permet de vérifier l’enregistrement de la demande, le modèle d’e-mail et la réception. Il ne s’agit pas d’une demande client.', website: '' }
async function send(body) {
  const response = await fetch(`${url}/functions/v1/portfolio-inquiry`, { method: 'POST', headers: { Origin: 'http://127.0.0.1:5174', apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(25000) })
  return { status: response.status, body: await response.json() }
}
const first = await send(payload)
if (!first.body.success) { console.error(JSON.stringify(first)); process.exit(1) }
const duplicate = await send(payload)
const deniedRead = await fetch(`${url}/rest/v1/portfolio_inquiries?id=eq.${requestId}&select=id,payload`, { headers: { apikey: key }, signal: AbortSignal.timeout(10000) })
const invalid = await send({ ...payload, requestId: randomUUID(), email: 'incorrect', message: 'court' })
const report = { requestId, reference: first.body.reference, status: first.status, emailStatus: first.body.emailStatus, duplicateSameReference: duplicate.body.reference === first.body.reference, anonymousReadStatus: deniedRead.status, invalidRequestStatus: invalid.status, checkedAt: new Date().toISOString() }
await writeFile('docs/contact-live-test.json', JSON.stringify(report, null, 2) + '\n')
console.info(JSON.stringify(report, null, 2))
if (!report.duplicateSameReference || ![401, 403].includes(report.anonymousReadStatus) || report.invalidRequestStatus !== 400) process.exitCode = 1
