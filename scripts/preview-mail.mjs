import { writeFile } from 'node:fs/promises'
import { composeProjectMail } from '../supabase/functions/_shared/email.js'

const demo = { kind: 'project', name: 'Awa Diop — exemple', email: 'client@example.com', company: 'Entreprise exemple', phone: '+221 77 000 00 00', subject: 'Une plateforme de gestion immobilière', projectType: 'Plateforme web et mobile', budget: 'À discuter ensemble', deadline: 'Dans trois mois', message: 'Nous souhaitons centraliser le suivi de nos biens et de nos locations.\n\nNos priorités : un espace pour les bailleurs, un suivi des paiements et des documents faciles à retrouver. Nous aimerions échanger sur le périmètre et les étapes du projet.', created_at: '2026-11-04T17:30:00.000Z' }
await writeFile('docs/email-preview.html', composeProjectMail(demo, 'PSS-EXEMPLE2026', 'onboarding@resend.dev').html)
await writeFile('docs/email-preview-recruitment.html', composeProjectMail({ ...demo, kind: 'recruitment', subject: 'Développeur full-stack', budget: 'Selon expérience', message: 'Nous souhaitons échanger sur un poste de développeur full-stack au sein de notre équipe produit.\n\nLe poste porte sur la conception des interfaces, des services et des modèles de données de nos applications.' }, 'PSS-EXEMPLE2026', 'onboarding@resend.dev').html)
console.info('Aperçus Projet et Recrutement générés. Aucun e-mail envoyé.')
