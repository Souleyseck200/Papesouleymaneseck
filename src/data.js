export const cases = [
  {
    id: 'alertsec',
    number: '01',
    title: 'AlertSec',
    category: 'Sécurité citoyenne · temps réel',
    image: '/images/dakar.png',
    imageAlt: 'Vue éditoriale de Dakar, illustration du contexte urbain du projet',
    lead: 'Transformer un signalement géolocalisé en intervention suivie par plusieurs acteurs.',
    role: 'Conception et développement full-stack',
    status: 'Prototype de plateforme multi-interface',
    stack: ['React Native / Expo', 'Node.js', 'TypeScript', 'Prisma', 'Socket.IO', 'Electron'],
    challenge: 'Le besoin ne se limite pas à envoyer une notification. Une alerte doit circuler entre un citoyen, des agents et un poste de commandement, en gardant une trace de sa prise en charge.',
    solution: 'J’ai structuré les parcours par rôle autour d’un même modèle d’alerte et de mission. L’API gère les données durables; les événements Socket.IO diffusent les changements aux interfaces concernées.',
    decision: 'Séparer les changements persistés des événements temps réel pour que chaque acteur retrouve l’état d’une mission après une reconnexion.',
    flows: [
      'Le citoyen crée un signalement avec sa localisation et les éléments disponibles.',
      'Le serveur enregistre l’alerte et oriente les événements vers les agents concernés.',
      'Un agent peut prendre en charge la mission; son état devient visible au commandement.',
      'Les changements de statut alimentent les vues mobiles et le poste central.'
    ],
    data: ['Utilisateur / rôle', 'Alerte', 'Zone', 'Mission', 'Événement de statut', 'Média associé'],
    boundary: 'Le code étudié décrit un prototype d’orchestration. Les délais d’intervention et les intégrations avec des services publics ne sont pas des résultats opérationnels validés.',
    diagram: `flowchart LR
      C["Citoyen · Expo"] -->|signalement| API["API Node / Prisma"]
      API --> DB[("Alertes & missions")]
      API --> RT["Socket.IO"]
      RT --> A["Agent · Expo"]
      RT --> PC["Commandement · Electron"]
      A -->|prise en charge| API
      PC -->|suivi| API`,
  },
  {
    id: 'edukora',
    number: '02',
    title: 'Edukora',
    category: 'Éducation · plateforme métier',
    image: '/images/school.png',
    imageAlt: 'Couloir scolaire, illustration éditoriale du domaine éducatif',
    lead: 'Réunir les parcours d’une école dans une plateforme pensée pour plusieurs profils.',
    role: 'Architecture produit et développement full-stack chez Axis',
    status: 'Plateforme en développement',
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase'],
    challenge: 'La direction, les enseignants, les élèves et les familles n’ont pas les mêmes besoins, mais travaillent sur des données communes : classes, présence, évaluations et paiements.',
    solution: 'J’ai organisé la plateforme en modules métier et en espaces de travail distincts. Un parcours transversal permet de suivre les informations d’un élève depuis son inscription jusqu’aux vues pédagogiques et administratives.',
    decision: 'Construire le produit autour des entités et des rôles de l’école, plutôt que multiplier des écrans indépendants qui dupliquent les données.',
    flows: [
      'L’école structure ses classes, ses utilisateurs et ses informations de référence.',
      'Les opérations quotidiennes alimentent les modules de présence et de suivi.',
      'Chaque espace présente les informations utiles à son profil.',
      'Les données partagées soutiennent les vues administratives et pédagogiques.'
    ],
    data: ['Établissement', 'Utilisateur / profil', 'Élève', 'Classe', 'Présence', 'Paiement'],
    boundary: 'L’architecture observée montre l’étendue du domaine. Certaines garanties de session et de séparation des établissements restent à consolider avant de présenter la plateforme comme sécurisée en production.',
    diagram: `flowchart LR
      P["Profils école"] --> UI["Espaces Next.js"]
      UI --> R["Modules métier"]
      R --> PG[("PostgreSQL")]
      R --> S["Services Supabase"]
      PG --> E["Élèves & classes"]
      PG --> A["Présence & suivi"]
      PG --> F["Gestion & paiements"]`,
  },
  {
    id: 'viva',
    number: '03',
    title: 'Viva Partners',
    category: 'Immobilier · opérations financières',
    image: '/images/real-estate.png',
    imageAlt: 'Architecture résidentielle sur la côte, illustration du secteur immobilier',
    lead: 'Faire évoluer une vitrine immobilière vers un outil de gestion des biens, des acteurs et des flux financiers.',
    role: 'Développement full-stack et accompagnement du cadrage',
    status: 'Projet client évolutif',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Zustand'],
    challenge: 'Le besoin initial portait sur des formulaires et une interface interne. Il s’est étendu aux mandats, locations, paiements, documents et règles de répartition comptable.',
    solution: 'J’ai relié les événements immobiliers aux opérations financières et aux documents qui en dépendent. Le type de mandat détermine les règles applicables, dont les taux et le document à générer.',
    decision: 'Conserver le lien entre un paiement et ses écritures permet de retrouver l’origine d’un montant et d’expliquer une annulation.',
    flows: [
      'Un bien et ses acteurs sont enregistrés dans le système.',
      'Le mandat associé fixe les règles de gestion et de répartition.',
      'Un loyer ou un autre paiement déclenche le calcul prévu par ces règles.',
      'Les écritures et documents associés restent consultables dans l’historique.'
    ],
    data: ['Bien', 'Bailleur', 'Locataire', 'Mandat', 'Bail', 'Paiement', 'Écriture', 'Document'],
    boundary: 'Le périmètre a grandi par étapes. Chaque fonction présentée dans le portfolio doit être rattachée à son statut réel : livrée, en cours ou documentée dans le code.',
    diagram: `flowchart LR
      B["Bien"] --> L["Bail / mandat"]
      L --> E["Échéance"]
      E --> P["Paiement"]
      P --> C["Règles de répartition"]
      C --> W[("Écritures comptables")]
      C --> D["Document généré"]`,
  },
  {
    id: 'jokko',
    number: '04',
    title: 'JOKKO',
    category: 'Messagerie · réseau local',
    image: null,
    lead: 'Une messagerie mobile conçue pour rester cohérente lorsque la connexion se coupe.',
    role: 'Conception du protocole, du serveur et du client mobile',
    status: 'Application et protocole en développement',
    stack: ['Expo', 'Fastify', 'TypeScript', 'WebSocket', 'SQLite', 'Zod'],
    challenge: 'Sur mobile, un message peut être envoyé deux fois après une coupure ou manquer dans l’interface après une reconnexion.',
    solution: 'Le serveur attribue un ordre aux messages, renvoie un accusé de réception et utilise un identifiant client pour reconnaître les essais répétés. À la reconnexion, il rejoue les événements manquants selon les conversations autorisées.',
    decision: 'Partager les contrats TypeScript et les schémas de validation entre mobile et serveur réduit les divergences de protocole.',
    flows: [
      'Le client crée un identifiant pour le message et l’envoie par WebSocket.',
      'Le serveur vérifie l’appartenance à la conversation puis persiste le message.',
      'Un accusé confirme l’écriture; les autres membres reçoivent l’événement.',
      'Après une coupure, la séquence serveur permet de reprendre les messages manquants.'
    ],
    data: ['Utilisateur', 'Conversation', 'Membre', 'Message', 'Pièce jointe', 'Accusé', 'Appel'],
    boundary: 'Le dépôt contient aussi la signalisation WebRTC et les pièces jointes. Les garanties d’accès aux médias et les rôles d’inscription doivent être finalisés avant de promettre un déploiement public.',
    diagram: `sequenceDiagram
      participant M as Mobile
      participant S as Fastify / WebSocket
      participant DB as SQLite
      M->>S: message.send (client_msg_id)
      S->>DB: vérifier membre + insérer si absent
      DB-->>S: message + seq
      S-->>M: message.ack
      Note over M,S: Coupure puis reconnexion
      M->>S: hello (lastSeq)
      S->>DB: lire les messages autorisés
      S-->>M: replay des messages manquants`,
  },
  {
    id: 'axis',
    number: '05',
    title: 'Axis',
    category: 'IA appliquée · cadrage de projet',
    image: null,
    lead: 'Aider à transformer une idée de client en un dossier de projet exploitable.',
    role: 'Développement full-stack et intégration IA',
    status: 'Outil interne et plateforme en évolution',
    stack: ['React', 'Vite', 'Express', 'Supabase', 'Gemini'],
    challenge: 'Un client décrit souvent son projet sans préciser les profils, les écrans, les données ou les règles importantes pour le développement.',
    solution: 'Le parcours guide la découverte du besoin puis utilise un service d’IA pour structurer la matière recueillie. Le résultat aide à préparer le périmètre, les écrans et les diagrammes que je relis ensuite.',
    decision: 'Placer l’IA dans un processus de cadrage guidé lui donne un contexte plus utile qu’une simple zone de chat libre.',
    flows: [
      'Le client présente son idée et répond aux questions de cadrage.',
      'L’API organise les informations et appelle le service IA.',
      'L’outil produit une synthèse et des pistes de structure du projet.',
      'Je révise le dossier avant de l’utiliser comme base de conception.'
    ],
    data: ['Brief', 'Réponse', 'Projet', 'Synthèse', 'Livrable de cadrage'],
    boundary: 'Les livrables de l’IA sont des aides à la conception. Leur exactitude et leur faisabilité nécessitent une revue humaine.',
    diagram: `flowchart LR
      B["Brief client"] --> Q["Questions guidées"]
      Q --> API["API Express"]
      API --> AI["Service IA"]
      AI --> S["Synthèse structurée"]
      S --> D["Diagrammes & dossier"]
      D --> H["Revue humaine"]`,
  },
  {
    id: 'maritime',
    number: '06',
    title: 'Maritime',
    category: 'Données géospatiales · vision par ordinateur',
    image: '/images/maritime.png',
    imageAlt: 'Navire sur l’océan, illustration éditoriale du domaine maritime',
    lead: 'De l’image satellite à une observation de navire géolocalisée.',
    role: 'Conception d’un pipeline Python et de ses modules d’analyse',
    status: 'Prototype de traitement géospatial',
    stack: ['Python', 'FastAPI', 'Rasterio', 'NumPy', 'YOLO', 'Supabase'],
    challenge: 'Les scènes satellite sont volumineuses et une détection en pixels doit être reliée à une position géographique exploitable.',
    solution: 'Le pipeline recherche et télécharge des scènes, les parcourt par tuiles, prépare l’image et applique une détection. Les coordonnées image sont projetées vers la carte pour préparer leur rapprochement avec d’autres sources.',
    decision: 'Le traitement par tuiles avec recouvrement permet de travailler sur de grandes images et de limiter les objets coupés aux frontières.',
    flows: [
      'Recherche et téléchargement de scènes couvrant une zone choisie.',
      'Découpage raster en fenêtres avec recouvrement.',
      'Inférence et conversion des centres détectés en coordonnées.',
      'Préparation de la fusion avec les données AIS et les autres observations.'
    ],
    data: ['Scène satellite', 'Tuile', 'Détection', 'Position', 'Trajectoire', 'Évaluation de risque'],
    boundary: 'Le raccordement des détections à la persistance et la validation scientifique restent incomplets. Le projet illustre un pipeline, pas une détection opérationnelle de pêche illégale.',
    diagram: `flowchart LR
      S["Scène Sentinel"] --> T["Tuiles Rasterio"]
      T --> P["Prétraitement"]
      P --> Y["Détection YOLO"]
      Y --> G["Pixel → position"]
      G --> F["Fusion multi-source"]
      F --> R["Évaluation de risque"]`,
  },
]

export const additional = [
  { name: 'Edukora Affiliation', domain: 'Leads, commissions et transactions SQL', tags: 'React · PostgreSQL · Supabase' },
  { name: 'Maison Web', domain: 'Stocks, règles et mouvements traçables', tags: 'React · PostgreSQL · Supabase' },
  { name: 'HouseConnect', domain: 'Interface de maison connectée et simulateur', tags: 'React · Zustand · TypeScript' },
  { name: 'ASTRONET', domain: 'Ingestion scientifique et pont Python / C++', tags: 'FastAPI · FITS · pybind11' },
  { name: 'Timekeeper', domain: 'Prototype de pointage QR et passkey', tags: 'React · Express · WebAuthn' },
  { name: 'Agro', domain: 'Gestion web d’un cheptel', tags: 'Laravel · Eloquent' },
  { name: 'EduPro Backend', domain: 'Première modélisation d’une API scolaire', tags: 'Laravel · SQL' },
  { name: 'Dashboard Backend', domain: 'Module API de gestion de tâches', tags: 'Laravel · REST' },
  { name: 'ProMessenger', domain: 'Socle de messagerie directe', tags: 'Laravel · Firebase' },
  { name: 'Mova', domain: 'Paiement conditionné à la livraison · en cours', tags: 'Swift · Firebase' },
  { name: 'Siggil', domain: 'Commerce en ligne · projet client', tags: 'Full-stack' },
  { name: 'NPS', domain: 'Plateforme événementielle avec interface admin', tags: 'Full-stack' },
]
