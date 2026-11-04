import { contactEmail, projectRequestLines } from './project-request.js'

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const header = value => String(value).replace(/[\r\n\x00-\x1f]+/g, ' ').trim()
const cell = (label, value) => `<td class="stack detail" style="vertical-align:top;padding:0 20px 20px 0"><p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#7a8798">${escape(label)}</p><p style="margin:0;font-size:14px;line-height:1.6;font-weight:500;color:#182539;overflow-wrap:anywhere">${escape(value || 'À discuter')}</p></td>`

export function composeProjectMail(request, reference, from) {
  const recruitment = request.kind === 'recruitment'
  const title = recruitment ? 'Une proposition de recrutement.' : 'Un nouveau projet à découvrir.'
  const category = recruitment ? 'Recrutement' : 'Demande de projet'
  const timestamp = request.created_at || new Date().toISOString()
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(timestamp))
  const replyLink = `mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(`Re : ${header(request.subject)}`)}`
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(category)} · Souleymane Seck</title>
<style>body,table,td,a{font-family:Roboto,Arial,Helvetica,sans-serif}table{border-collapse:collapse}a{color:inherit} @media only screen and (max-width:600px){.outer{padding:12px!important}.pad{padding-left:24px!important;padding-right:24px!important}.stack{display:block!important;width:100%!important}.hero-title{font-size:30px!important}.detail{padding-bottom:18px!important}.summary{padding:20px!important}.reply{display:block!important;text-align:center!important}}</style></head>
<body style="margin:0;padding:0;background:#eef1f5;color:#182539;-webkit-text-size-adjust:100%">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escape(category)} de ${escape(request.name)} : ${escape(request.subject)}</div>
<table role="presentation" style="width:100%;background:#eef1f5"><tr><td class="outer" align="center" style="padding:32px 16px">
<!--[if mso]><table role="presentation" width="640"><tr><td><![endif]-->
<table role="presentation" style="width:100%;max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden">
<tr><td class="pad" style="padding:30px 36px 0;background:#0c172b;border-radius:24px 24px 0 0"><p style="margin:0;color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-.5px">Souleymane Seck<span style="color:#f96716">.</span></p></td></tr>
<tr><td class="pad" style="padding:34px 36px 36px;background:#0c172b"><p style="margin:0 0 14px;color:#ff9a56;font-size:12px">${escape(category)} depuis le portfolio</p><h1 class="hero-title" style="margin:0;color:#ffffff;font-size:36px;line-height:1.08;font-weight:700;letter-spacing:-1.3px">${title}</h1><p style="margin:20px 0 0;color:#aeb9cb;font-size:12px;line-height:1.7">${escape(date)} UTC<br>Référence ${escape(reference)}</p></td></tr>
<tr><td class="pad" style="padding:32px 36px 0"><p style="margin:0 0 10px;font-size:11px;color:#7a8798">${recruitment ? 'Poste proposé' : 'Le projet'}</p><h2 style="margin:0;font-size:23px;line-height:1.3;letter-spacing:-.6px;overflow-wrap:anywhere">${escape(request.subject)}</h2></td></tr>
<tr><td class="pad" style="padding:28px 36px 4px"><table role="presentation" style="width:100%;table-layout:fixed"><tr>${cell('Contact', request.name)}${cell('Entreprise', request.company || 'Non précisée')}</tr><tr>${cell('E-mail de réponse', request.email)}${cell('Téléphone', request.phone || 'Non précisé')}</tr></table></td></tr>
<tr><td class="pad" style="padding:0 36px"><div class="summary" style="border-radius:16px;background:#f3f5f8;padding:24px"><table role="presentation" style="width:100%;table-layout:fixed"><tr>${!recruitment ? cell('Type de projet', request.projectType) : ''}${cell(recruitment ? 'Rémunération envisagée' : 'Budget envisagé', request.budget)}${cell(recruitment ? 'Prise de poste' : 'Échéance souhaitée', request.deadline)}</tr></table></div></td></tr>
<tr><td class="pad" style="padding:28px 36px 0"><h3 style="margin:0 0 14px;font-size:14px;font-weight:700">${recruitment ? 'Le poste et son contexte' : 'Le besoin, dans ses mots'}</h3><p style="margin:0;font-size:14px;line-height:1.85;color:#536174;overflow-wrap:anywhere">${escape(request.message).replace(/\r?\n/g, '<br>')}</p></td></tr>
<tr><td class="pad" style="padding:30px 36px 32px"><table role="presentation" style="width:100%"><tr><td><a class="reply" href="${escape(replyLink)}" style="display:inline-block;border-radius:30px;background:#f96716;color:#ffffff;text-decoration:none;padding:15px 24px;font-size:13px;font-weight:700">Répondre par e-mail&nbsp; ↗</a><p style="margin:14px 0 0;font-size:11px;line-height:1.7;color:#7a8798">Le bouton « Répondre » de votre messagerie contacte aussi directement ${escape(request.name)}.</p></td></tr></table></td></tr>
<tr><td class="pad" style="padding:22px 36px;border-top:1px solid #e8edf2;border-radius:0 0 24px 24px"><p style="margin:0;font-size:11px;line-height:1.7;color:#96a0af">Portfolio de Pape Souleymane Seck<br>Développement web, mobile et systèmes métier.</p></td></tr>
</table><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`
  return {
    from: { name: 'Portfolio · Pape Souleymane Seck', address: from },
    to: contactEmail,
    replyTo: { name: header(request.name), address: request.email },
    subject: `[Portfolio] ${category} — ${header(request.subject)}`,
    text: `${category}\nRéférence : ${reference}\nDate : ${timestamp}\n\n${projectRequestLines(request).map(([label, value]) => `${label}\n${value}`).join('\n\n')}`,
    html,
  }
}
