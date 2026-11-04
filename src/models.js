// Relations conceptuelles simplifiées à partir des schémas examinés.
export const models = {
  nps: `erDiagram
    EVENTS ||--o{ EVENT_REGISTRATIONS : recoit
    USERS o|--o{ BLOG_POSTS : auteur
    USERS o|--o{ CONTACTS : repond
    EVENTS {
      uuid id PK
      string slug UK
      boolean published
      datetime date
    }
    EVENT_REGISTRATIONS {
      uuid id PK
      uuid event_id FK
      string confirmation_code UK
      string status
      int number_of_participants
    }
    BLOG_POSTS {
      uuid id PK
      uuid author_id FK
      string slug UK
      jsonb content
      boolean published
    }`,
  siggil: `flowchart LR
    P[Produits : prix, variantes, stock] --> C[Panier en mémoire]
    C --> SNAP[Instantané des articles]
    U[Identité et livraison] --> O[(orders)]
    SNAP --> O
    O --> STATUS[Statut et suivi]
    CAT[Catégorie par libellé] --> P`,
  alertsec: `erDiagram
    ZONE o|--o{ USER : regroupe
    ZONE o|--o{ SIGNALEMENT : localise
    USER ||--o{ SIGNALEMENT : cree
    SIGNALEMENT ||--o{ AFFECTATION : donne_lieu
    USER ||--o{ AFFECTATION : recoit
    AFFECTATION ||--o{ INTERVENTION : comporte
    USER ||--o{ NOTIFICATION : recoit
    USER ||--o{ CONTACT_URGENCE : possede`,
  viva: `erDiagram
    PROPRIETAIRE ||--o{ BIEN : possede
    BIEN ||--o{ LOT : comprend
    LOCATAIRE ||--o{ BAIL : signe
    LOT ||--o{ BAIL : concerne
    BAIL ||--o{ FACTURE : produit
    FACTURE ||--o{ ALLOCATION : recoit
    TRANSACTION ||--o{ ALLOCATION : repartit`,
  edukora: `erDiagram
    ETABLISSEMENT ||--o{ ELEVE : accueille
    ETABLISSEMENT ||--o{ CLASSE : organise
    ETABLISSEMENT ||--o{ UTILISATEUR : regroupe
    ELEVE ||--o{ PRESENCE : possede`,
  jokko: `erDiagram
    USERS ||--o{ CONVERSATION_MEMBERS : participe
    CONVERSATIONS ||--o{ CONVERSATION_MEMBERS : contient
    CONVERSATIONS ||--o{ MESSAGES : contient
    USERS ||--o{ MESSAGES : envoie
    MESSAGES ||--o{ MESSAGE_RECEIPTS : possede
    MESSAGES ||--o{ MESSAGE_ATTACHMENTS : contient
    FILES ||--o{ MESSAGE_ATTACHMENTS : associe`,
  affiliation: `erDiagram
    APPORTEURS ||--o{ LEADS : apporte
    LEADS o|--o| ECOLES_CLIENTES : devient
    ECOLES_CLIENTES ||--o{ PAIEMENTS : effectue
    PAIEMENTS ||--o| COMMISSIONS : genere
    APPORTEURS ||--o{ RETRAITS : demande`,
  maison: `erDiagram
    PRODUCTS ||--o{ STOCK_MOVEMENTS : concerne
    PRODUCTS ||--o{ STOCK_RULES : suit
    PRODUCTS ||--o{ STOCK_BALANCES : possede
    USERS ||--o{ STOCK_MOVEMENTS : effectue
    USERS ||--o{ CASH_MOVEMENTS : initie
    USERS ||--o{ ADMIN_AUDIT : trace`,
  agro: `erDiagram
    USERS ||--o{ ANIMALS : possede
    USERS {
      int id PK
      string name
      string role
    }
    ANIMALS {
      int id PK
      int user_id FK
      string espece
      string etat_sante
      decimal poids
    }`,
  promessenger: `erDiagram
    USERS ||--o{ MESSAGES : envoie
    USERS ||--o{ MESSAGES : recoit
    MESSAGES {
      int id PK
      int sender_id FK
      int receiver_id FK
      string content
    }`,
  opendevin: `flowchart LR
    TASK[(app_conversation_start_task)] -->|app_conversation_id| META[(conversation_metadata)]
    TASK -->|sandbox_id| SANDBOX[(v1_remote_sandbox)]
    META -->|sandbox_id| SANDBOX
    CALLBACK[(event_callback)] -->|conversation_id| META
    RESULT[(event_callback_result)] -->|event_callback_id| CALLBACK
    RESULT -->|event_id| STORE[(Event Store · hors tables SQL)]`,
  timekeeper: `erDiagram
    USERS ||--o{ PASSKEYS : possede
    USERS ||--o{ QR_CHALLENGES : recoit
    USERS ||--o{ ATTENDANCES : enregistre`,
  edupro: `erDiagram
    STUDENTS ||--o{ NOTES : recoit
    COURSES ||--o{ NOTES : concerne
    STUDENTS ||--o{ BULLETINS : possede
    COURSES ||--o{ SCHEDULES : planifie`,
}

export const logicalModels = {
  nps: [
    ['users','Profils liés à auth.users et rôles admin, editor, viewer.'],
    ['blog_posts / projects','Contenus publiables avec slug, images et données structurées.'],
    ['events','Programme, date, lieu, intervenants, publication et capacité.'],
    ['event_registrations','Référence événement, nombre de participants, statut et code unique.'],
    ['contacts / admin_otp','Messages et réponse administrative; demandes OTP dans une migration dédiée.'],
  ],
  siggil: [
    ['products','Identifiant produit, libellé de catégorie, prix, stock, tailles, couleurs et état actif.'],
    ['orders','Référence publique, identité et livraison, articles capturés en JSON, total, méthode choisie et statut.'],
    ['categories','Catalogue des catégories utilisé par les services de gestion.'],
  ],
  alertsec: [
    ['User / Zone','Profils citoyens et agents, associés à une zone facultative.'],
    ['Signalement / Affectation','Alerte géolocalisée et association aux agents chargés du suivi.'],
    ['Intervention','Notes terrain et clôture liées à une affectation.'],
    ['Notification / ContactUrgence','Messages et contacts rattachés aux comptes.'],
  ],
  edukora: [
    ['tenants','Périmètre des établissements dans la structure multi-école.'],
    ['students / classes / attendance','Élèves, classes et suivi des présences.'],
    ['transactions','Données liées aux opérations financières.'],
    ['affiliation_portail_schools','Références issues du portail commercial et état de synchronisation.'],
  ],
  axis: [
    ['axis_site_courses / axis_site_leads','Catalogue de formations et demandes de contact.'],
    ['axis_academy_enrollments / lessons','Inscriptions et contenus pédagogiques.'],
    ['axis_academy_payments / progress','Paiements et progression des inscrits.'],
    ['axis_academy_submissions','Rendus et évaluations.'],
  ],
  jokko: [
    ['users','Identité, pseudo, mot de passe haché et présence.'],
    ['conversations / conversation_members','Conversations et association de leurs membres.'],
    ['messages','Séquence serveur, auteur, conversation et identifiant client pour les reprises.'],
    ['files / message_attachments','Fichiers et association ordonnée aux messages.'],
    ['message_receipts / calls','Accusés de livraison ou lecture et historique des appels.'],
  ],
  affiliation: [
    ['aff_apporteurs','Profils des apporteurs associés aux prospects.'],
    ['aff_ecoles_clientes','Écoles converties et rattachement au réseau d’affiliation.'],
    ['aff_paiements_ecoles','Paiements associés aux écoles et à leur offre.'],
    ['aff_commissions','Commissions associées à un paiement; unicité du paiement dans le modèle examiné.'],
  ],
  maison: [
    ['products / stock_rules','Catalogue et règles applicables aux prélèvements.'],
    ['stock_balances / stock_movements','Soldes courants et historique des mouvements.'],
    ['cash_movements','Opérations de caisse et contexte associé.'],
    ['admin_audit','Trace des opérations administratives.'],
  ],
  agro: [
    ['users','Compte et rôle de l’utilisateur.'],
    ['animals','Référence utilisateur, espèce, état de santé, date de naissance et poids.'],
  ],
  edupro: [
    ['students / courses','Étudiants et informations de cours.'],
    ['notes','Références étudiant et cours, avec une note dans la migration examinée.'],
    ['bulletins','Référence étudiant, moyenne, appréciation et commentaires.'],
    ['schedules','Référence cours, jour, horaires et salle.'],
  ],
  promessenger: [
    ['users','Compte, rôle et attributs de profil.'],
    ['messages','Expéditeur, destinataire, contenu et dates de création.'],
  ],
  opendevin: [
    ['conversation_metadata','conversation_id, user_id, dépôt, branche, titre, modèle, version, sandbox_id et métriques de tokens/coût.'],
    ['app_conversation_start_task','Tâche asynchrone de démarrage : créateur, statut, requête, conversation associée, sandbox et URL du serveur agent.'],
    ['v1_remote_sandbox','Identifiant du sandbox, utilisateur créateur et spécification du runtime distant.'],
    ['event_callback / event_callback_result','Callbacks rattachés à une conversation; résultats reliés au callback et à un event_id.'],
    ['Event Store','Actions et observations ordonnées conservées par conversation; les événements ne sont pas une table de conversation_metadata.'],
    ['Liens entre entités','Les colonnes d’identifiant assurent les rapprochements logiques décrits ici; elles ne sont pas toutes des contraintes de clé étrangère SQL.'],
  ],
}
