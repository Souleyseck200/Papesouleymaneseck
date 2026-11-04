import { composeProjectMail } from '../_shared/email.js'

export function createStore(url, key) {
  async function rpc(name, payload) {
    const response = await fetch(`${url}/rest/v1/rpc/${name}`, { method: 'POST', headers: { apikey: key, ...(key.startsWith('ey') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(12000) })
    if (!response.ok) throw Object.assign(new Error('Portfolio database request failed'), { code: `DATABASE_${response.status}` })
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }
  return {
    register: ({ id, payload, fingerprint, ipHash }) => rpc('portfolio_intake', { p_id: id, p_payload: payload, p_fingerprint: fingerprint, p_ip_hash: ipHash }),
    claim: (id, limit) => rpc('portfolio_claim_mail', { p_id: id, p_limit: limit }),
    finish: (id, sent, error) => rpc('portfolio_finish_mail', { p_id: id, p_sent: sent, p_error: error }),
    authorizeRetry: tokenHash => rpc('portfolio_retry_authorized', { p_token_hash: tokenHash }),
  }
}

export function createResendMail(apiKey, from, { fetchImpl = fetch } = {}) {
  return {
    ready: !!(apiKey && from),
    async send(job) {
      const message = composeProjectMail({ ...job.payload, created_at: job.created_at }, job.reference, from)
      const response = await fetchImpl('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-inquiry/${job.id}` }, body: JSON.stringify({ from: `Portfolio · Pape Souleymane Seck <${from}>`, to: [message.to.toLowerCase()], reply_to: message.replyTo.address, subject: message.subject, text: message.text, html: message.html }), signal: AbortSignal.timeout(12000) })
      const receipt = await response.json().catch(() => null)
      if (!response.ok || !receipt?.id) throw Object.assign(new Error('Email provider refused the request'), { code: `RESEND_${response.status}` })
    },
  }
}
