import { z } from 'zod'

export const projectTypes = ['Application web', 'Application mobile', 'Plateforme web et mobile', 'Refonte ou évolution', 'IA et automatisation', 'Autre besoin']
const optionalText = (max) => z.string().trim().max(max, `Limitez ce champ à ${max} caractères.`).default('')
export const projectRequestSchema = z.object({
  kind: z.enum(['project', 'recruitment']),
  name: z.string().trim().min(2, 'Indiquez votre nom complet.').max(100, 'Limitez votre nom à 100 caractères.'),
  email: z.string().trim().max(254).email('Indiquez une adresse e-mail valide.'),
  company: optionalText(160),
  phone: optionalText(50),
  subject: z.string().trim().min(4, 'Indiquez le projet ou le poste proposé.').max(160, 'Limitez le titre à 160 caractères.'),
  projectType: z.enum(projectTypes),
  budget: optionalText(120),
  deadline: optionalText(120),
  message: z.string().trim().min(30, 'Décrivez votre besoin en au moins 30 caractères.').max(6000, 'Limitez votre message à 6 000 caractères.'),
  website: optionalText(200),
})

export const emptyProjectRequest = {
  kind: 'project', name: '', email: '', company: '', phone: '', subject: '',
  projectType: projectTypes[0], budget: '', deadline: '', message: '', website: '',
}

export const contactEmail = 'Souleymaneseck996@gmail.com'

export function projectRequestLines(request) {
  return [
    ['Demande', request.kind === 'recruitment' ? 'Proposition de recrutement' : 'Demande de projet'],
    ['Nom', request.name], ['E-mail', request.email], ['Entreprise', request.company || 'Non précisée'],
    ['Téléphone', request.phone || 'Non précisé'],
    [request.kind === 'recruitment' ? 'Poste proposé' : 'Projet', request.subject],
    ...(request.kind === 'project' ? [['Type de projet', request.projectType]] : []),
    [request.kind === 'recruitment' ? 'Rémunération envisagée' : 'Budget envisagé', request.budget || 'À discuter'],
    ['Échéance / disponibilité souhaitée', request.deadline || 'À discuter'],
    ['Description du besoin', request.message],
  ]
}

export function projectMailto(request) {
  const subject = `[Portfolio] ${request.subject || 'Prise de contact'}`.replace(/[\r\n]+/g, ' ')
  const body = projectRequestLines(request).map(([label, value]) => `${label} : ${value}`).join('\n\n')
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
