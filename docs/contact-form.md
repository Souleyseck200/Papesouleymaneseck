# Demandes du portfolio avec Supabase

Projet choisi par l’utilisateur : **Maison**, référence `dgdxvdercbfikmystyob`.

Le formulaire Projet / Recrutement enregistre les coordonnées, le contexte, le budget, le délai et le message dans une table privée. Une Edge Function prépare le mail pour **Souleymaneseck996@gmail.com**. Le Reply-To et le bouton de réponse utilisent l’adresse du client.

## État de l’intégration

- Formulaire et validation côté client / serveur : en place.
- Fonction `portfolio-inquiry` : déployée.
- Tables `portfolio_inquiries`, `portfolio_intake_limits`, `portfolio_worker_config` : créées avec RLS, sans lecture ni insertion directe pour les visiteurs ou les utilisateurs de Maison.
- Reprise des e-mails en attente : tâche `portfolio-mail-retry`, toutes les cinq minutes. Bail d’envoi et clé d’idempotence Resend pour éviter les doubles envois lors des reprises.
- Enregistrement réel et refus de la lecture anonyme : vérifiés. Résultat dans `docs/contact-live-test.json`.
- Les trois secrets propres au portfolio ont été enregistrés depuis le tableau de bord autorisé. La clé Resend est limitée au droit **Sending access**.
- Les deux notifications de test ont été livrées le 4 novembre 2026 : statut **Delivered** observé dans Resend pour chacune. Les références `PSS-59F05AD246DE` et `PSS-B9A5C39B14B0` sont aussi marquées `sent` dans Supabase, sans erreur. Les identifiants de livraison figurent dans `docs/contact-delivery-verification.json`.

## Configuration Resend active

Les secrets suivants sont enregistrés dans le tableau de bord Supabase de Maison, Edge Functions → Secrets :

| Nom | Valeur |
| --- | --- |
| `PORTFOLIO_RESEND_API_KEY` | Clé Resend dédiée avec le droit Sending access |
| `PORTFOLIO_MAIL_FROM` | `onboarding@resend.dev` pour les tests à destination du propriétaire du compte ; ensuite une adresse sur un domaine vérifié |
| `PORTFOLIO_ALLOWED_ORIGINS` | `http://127.0.0.1:5174,http://localhost:5174` ; ajouter l’origine HTTPS réelle du site lors de sa publication |

Le compte Resend doit être associé à l’adresse de réception pour les tests avec `resend.dev`. Les clés privées ne vont ni dans Git, ni dans le navigateur, ni dans la conversation.

Le compte CLI actuellement connecté a reçu un refus de droits sur la lecture et la modification des secrets du projet. La configuration a été réalisée depuis la session du tableau de bord autorisée par l’utilisateur. Les migrations et le déploiement ont été réalisés par le connecteur Supabase autorisé. Aucun secret préexistant de Maison n’a été remplacé.

## Templates

- Source réellement utilisée : `supabase/functions/_shared/email.js`.
- Aperçu Projet : `docs/email-preview.html`.
- Aperçu Recrutement : `docs/email-preview-recruitment.html`.
- Regénérer les aperçus : `node scripts/preview-mail.mjs`. Cette commande n’envoie pas de mail.

Le format reprend le bleu nuit, le blanc, l’orange et les arrondis du portfolio. Le HTML utilise des tableaux de présentation avec styles en ligne et des adaptations mobiles. Une version texte accompagne chaque e-mail. Roboto est demandée avec Arial / Helvetica en repli selon le logiciel de messagerie. Les saisies sont échappées avant insertion dans le HTML.

## Préservation de Maison

Les objets ajoutés portent le préfixe `portfolio_`. Les objets de l’application Maison et ses fonctions `login`, `admin-users`, `bootstrap-admin` et `upgrade-admin-email` n’ont pas été modifiés. Les empreintes des colonnes, fonctions et politiques existantes sont identiques avant et après les ajouts ; voir `docs/maison-baseline.json`.

Les trois informations de l’advisor « RLS enabled, no policy » sur les tables du portfolio sont intentionnelles : elles sont privées et accessibles uniquement au service serveur. Aucune politique d’accès anonyme n’est ajoutée pour supprimer cet indicateur. Les réglages Auth et les autres avis de Maison ne sont pas modifiés.

## Vérification

`npm run test:contact` vérifie les champs, l’enregistrement avant notification, la conservation des demandes si le mail est indisponible, les doublons, les origines, la clé publique, le worker, la taille, le débit et l’échappement du template.

`node scripts/check-contact-live.mjs` crée une demande **explicitement marquée TEST**, à destination du propriétaire uniquement, et vérifie la réponse, l’idempotence et le refus de lecture anonyme. Ne pas le relancer inutilement : une exécution crée un nouveau test dans la base et peut envoyer un e-mail lorsque Resend est activé.

Le destinataire Gmail est transmis en minuscules au fournisseur. Cela respecte la forme canonique de l’adresse du propriétaire lors du contrôle du domaine de test Resend. Les coordonnées saisies par le client restent conservées dans la demande et utilisées pour la réponse.

Documentation primaire : [Supabase — Sending emails](https://supabase.com/docs/guides/functions/examples/send-emails), [Scheduling functions](https://supabase.com/docs/guides/functions/schedule-functions), [Resend — domaine de test](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).
