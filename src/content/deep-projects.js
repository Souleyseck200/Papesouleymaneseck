// Récits publics issus des README, des interfaces et des flux source relus.
// Les références servent à maintenir le contenu; aucune valeur d'environnement n'est publiée.
export const deepProjects = {
  alertsec: {
    purpose: 'AlertSec relie un citoyen en difficulté, les agents disponibles et un poste de commandement. Le produit organise la chaîne qui va du signalement géolocalisé jusqu’à la prise en charge, aux échanges de terrain et au rapport de clôture.',
    front: [
      ['Application citoyenne', 'Expo Router organise la connexion, l’onboarding, l’accueil, la carte, l’historique et le profil. Le parcours SOS recueille la position, le contexte et les médias. Les composants de carte, de maintien du bouton SOS et les retours haptiques rendent l’action et son état perceptibles.'],
      ['Application agent', 'Les vues d’accueil, missions et profil partagent le contexte utilisateur. Le hook useActiveMission gère la mission active, son identifiant d’intervention, le traitement en cours, les points de parcours et la remise à zéro à la clôture.'],
      ['Console de commandement', 'Electron embarque une interface React/Vite : tableaux de bord, signalements, agents, unités, carte SITAC, archives, analyses et journaux. Leaflet, Recharts, les panneaux et les composants de communication présentent plusieurs lectures d’une même situation.'],
    ],
    back: [
      ['Identité et contrats', 'Axios ajoute le jeton conservé dans AsyncStorage aux requêtes mobiles. Express sépare les routes auth, users, signalements, contacts, notifications, interventions, stats et admin; Zod valide les demandes métier.'],
      ['Mission et cohérence', 'Le service de signalement associe une zone. La prise en charge regroupe affectation, intervention, statut et occupation de l’agent dans une transaction Prisma. Les événements réseau sont envoyés après la mutation.'],
      ['Temps réel et médias', 'Socket.IO répartit les événements dans des salles par compte, rôle, zone et mission. Les positions, statuts, messages vocaux et instructions alimentent les clients; Multer conserve les médias dans le stockage local du serveur.'],
    ],
    methods: ['Context React et hook métier pour la mission active', 'API REST pour l’état durable, Socket.IO pour les changements', 'Transactions Prisma sur les transitions de mission', 'Navigation par rôle et surfaces mobile/desktop', 'Cartographie et retours haptiques côté mobile'],
    lifecycle: 'Le signalement conserve le lien au citoyen, à la zone et aux médias. Les affectations et interventions décrivent la prise en charge et sa clôture; les notifications et journaux gardent les événements associés. Les fichiers sont référencés par URL depuis le stockage local. L’itinéraire et l’ETA présents dans ce dépôt sont démonstratifs.',
    steps: ['Le citoyen s’authentifie; le contexte mobile restaure le profil et le jeton.', 'Le parcours SOS collecte GPS, type d’entrée, contexte et médias disponibles.', 'Axios transmet un multipart authentifié; Multer écrit les fichiers et Zod valide le signalement.', 'Le service identifie la zone et crée le signalement avec son statut initial.', 'Les salles Socket.IO concernées reçoivent l’événement; des notifications sont persistées.', 'L’agent accepte : la transaction crée affectation et intervention, puis passe la mission en cours.', 'Le hook mobile conserve la mission active; les clients rejoignent sa salle et échangent positions et messages.', 'La console de commandement met à jour la carte, les listes et le suivi opérationnel.', 'La clôture enregistre le rapport, termine l’intervention et rétablit la disponibilité.', 'Le client vide la mission active, tandis que l’historique conserve la trace du signalement.'],
    architecture: `flowchart TB
      subgraph F[Interfaces et expérience]
        C[Citoyen : SOS, carte, historique, profil]
        A[Agent : missions, carte, communications]
        D[Electron React : commandement, SITAC, analyses]
        UI[Expo Router, Context, hooks métier, haptique]
        HTTP[Client Axios et jeton AsyncStorage]
        WS[Client Socket.IO et reconnexion]
        C --> UI
        A --> UI
        UI --> HTTP
        UI --> WS
        D --> HTTP
        D --> WS
      end
      subgraph B[API et orchestration]
        AUTH[JWT et contrôle de rôle]
        R[Routes et contrôleurs Express]
        VALID[Zod et validation métier]
        UP[Multer : médias]
        SIG[Signalement et association de zone]
        INT[Interventions : prise en charge et clôture]
        NOT[Notifications, contacts, statistiques, admin]
        SOCKET[Salles compte, rôle, zone et mission]
        HTTP --> AUTH --> R --> VALID
        R --> UP
        VALID --> SIG
        VALID --> INT
        VALID --> NOT
        WS <--> SOCKET
        SIG --> SOCKET
        INT --> SOCKET
      end
      subgraph P[Données persistantes]
        ORM[Prisma et transactions]
        U[(User et Zone)]
        S[(Signalement)]
        I[(Affectation et Intervention)]
        N[(Notification, ContactUrgence, LogsSysteme)]
        MEDIA[(Fichiers uploads)]
        SIG --> ORM
        INT --> ORM
        NOT --> ORM
        ORM --> U
        ORM --> S
        ORM --> I
        ORM --> N
        UP --> MEDIA
        S -. références .-> MEDIA
      end`,
    sequence: `sequenceDiagram
      participant C as Interface citoyenne
      participant API as API Express
      participant DB as Prisma / SQLite
      participant RT as Socket.IO
      participant A as Interface agent
      participant PC as Commandement
      C->>API: Signalement multipart + JWT
      API->>API: Stocker médias, valider, déterminer la zone
      API->>DB: Créer Signalement
      DB-->>API: Identifiant et statut
      API-->>C: Confirmation
      API->>RT: NOUVEAU_SIGNALEMENT
      RT-->>A: Alerte de zone
      RT-->>PC: Mise à jour de la situation
      A->>API: Prendre en charge
      API->>DB: Transaction affectation + intervention + statuts
      DB-->>API: Validation
      API->>RT: Statut de prise en charge
      RT-->>C: Mission en cours
      A->>RT: Positions et échanges de mission
      RT-->>PC: Suivi terrain
      A->>API: Clôturer avec rapport
      API->>DB: Terminer et libérer l’agent
      API-->>A: Confirmation et remise à zéro de l’état UI`,
    sources: ['README.md','mobile-app/services/api.ts','mobile-app/services/socket.ts','mobile-app/hooks/useActiveMission.ts','admin-desktop/src/renderer/src/pages','backend/prisma/schema.prisma'],
  },
  edukora: {
    purpose: 'Edukora est un système de gestion scolaire organisé autour de cinq espaces métier : direction, professeur, caisse, surveillance et administration de la plateforme. Il regroupe les opérations pédagogiques, les présences, les finances et le suivi des établissements.',
    front: [
      ['Navigation et espaces métier', 'Next.js App Router répartit les pages publiques, l’authentification et les tableaux de bord par rôle. Les shells, barres latérales et en-têtes rendent chaque espace reconnaissable tout en réutilisant les composants transversaux.'],
      ['Parcours professeur', 'Les modules classes, appel, évaluations, devoirs, cahier de textes, examens, emploi du temps et discipline s’appuient sur un contexte de classe et le hook useProfessorModule. Celui-ci gère chargement, sélection, formulaires, erreurs, actions et rechargement des données.'],
      ['Interactions de gestion', 'L’appel filtre les élèves par nom ou matricule, permet présent/absent/retard, appel groupé et validation, ouvre le scanner et exporte un CSV. Les autres espaces proposent leurs propres formulaires, tableaux, états et indicateurs.'],
    ],
    back: [
      ['Routes métier et contrats', 'Les Route Handlers Next.js reçoivent les actions du client et délèguent aux modules serveur. Les helpers d’accès et le périmètre établissement accompagnent les requêtes du domaine.'],
      ['SQL par domaine', 'Un pool pg relie les modules à PostgreSQL. L’initialisation agrège les schémas d’administration, direction, caisse, surveillance, professeur, sécurité, support et affiliation.'],
      ['Données partagées', 'Les classes, élèves, présences et transactions sont rattachés à l’établissement. Le pont d’affiliation garde l’identifiant source, le payload et l’état de synchronisation de l’école entrante.'],
    ],
    methods: ['Composants de page et tableaux réutilisables', 'Hooks métier avec état de chargement et action', 'Contexte de classe partagé entre les modules professeur', 'Route Handlers et modules SQL spécialisés', 'Multi-établissement par tenant_id', 'Exports CSV et parcours de scan'],
    lifecycle: 'Les données de référence de l’école alimentent les opérations quotidiennes. Une action de présence met à jour le module puis recharge le tableau; les exports sont construits depuis les colonnes et lignes reçues. Les écoles issues de l’affiliation conservent leur provenance et leur lien au tenant.',
    steps: ['L’utilisateur rejoint l’espace correspondant à son rôle après la connexion.', 'Le shell charge le contexte de l’établissement et, pour le professeur, la classe active.', 'Le hook demande les colonnes, lignes et actions disponibles du module sélectionné.', 'Les Route Handlers appliquent le périmètre de lecture et interrogent les modules SQL.', 'Le tableau affiche les données avec recherche, sélection et états de chargement.', 'L’utilisateur marque une présence, saisit une évaluation ou confirme une action métier.', 'Le hook transmet action, classe, ligne sélectionnée et champs du formulaire.', 'Le serveur traite la demande et renvoie son message de résultat.', 'Le hook recharge les données; le composant affiche le résultat, la nouvelle ligne et le retour utilisateur.', 'Le professeur peut valider l’appel ou exporter les données du module en CSV.'],
    architecture: `flowchart TB
      subgraph UI[Frontend Next.js et React]
        PUB[Site public, blog, aide, documentation]
        LOGIN[Connexion et redirection]
        DIR[Direction : élèves, personnel, finances, scolarité]
        PROF[Professeur : classes, appel, notes, devoirs]
        CASH[Caisse : encaissements, dépenses, impayés]
        SURV[Surveillance : QR, sorties, discipline]
        ADM[Super admin : tenants, monitoring, support]
        SHELL[Shells, tableaux, modales et notifications]
        HOOK[Contexte de classe et hooks de modules]
        CLIENT[Client HTTP : apiGet et apiPost]
        LOGIN --> DIR & PROF & CASH & SURV & ADM
        DIR & PROF & CASH & SURV & ADM --> SHELL
        SHELL --> HOOK --> CLIENT
      end
      subgraph SERVER[Serveur Next.js]
        ROUTES[Route Handlers par domaine]
        ACCESS[Helpers de rôle et établissement]
        MOD[Modules direction, professeur, caisse, surveillance]
        ADMIN[Administration, support et sécurité]
        POOL[Pool PostgreSQL pg]
        INIT[Initialisation des schémas et seeds]
        CLIENT --> ROUTES --> ACCESS
        ACCESS --> MOD & ADMIN
        MOD & ADMIN --> POOL
        INIT --> POOL
      end
      subgraph DATA[PostgreSQL / Supabase]
        TEN[(Tenants et utilisateurs)]
        SC[(Élèves, classes et présence)]
        FIN[(Transactions et opérations financières)]
        AFF[(Tables affiliation_portail)]
        POOL --> TEN & SC & FIN & AFF
        PORTAIL[Portail commercial] --> AFF --> TEN
      end`,
    sequence: `sequenceDiagram
      participant P as Page d’appel
      participant H as useProfessorModule
      participant API as Route Handler
      participant M as Module professeur
      participant DB as PostgreSQL
      P->>H: Classe sélectionnée
      H->>API: GET module attendance + classKey
      API->>M: Charger le module dans son périmètre
      M->>DB: Lire élèves et états de présence
      DB-->>M: Lignes
      M-->>P: Colonnes, lignes et actions
      P->>H: MARK_PRESENT + studentId
      H->>API: POST action + classe + ligne
      API->>M: Exécuter l’action
      M->>DB: Enregistrer l’état de présence
      API-->>H: Message de résultat
      H->>API: Recharger le module
      API-->>P: Tableau actualisé
      P->>P: Notification ou export CSV`,
    sources: ['README.md','package.json','src/app/professor/attendance/page.tsx','src/hooks/useProfessorModule.ts','src/server/db.ts','src/app/api'],
  },
  viva: {
    purpose: 'Viva Partners rassemble la présentation commerciale d’une entreprise immobilière et la gestion de ses opérations : patrimoine, lots, baux, mandats, locataires, propriétaires, documents et comptabilité. Le projet s’est étendu d’une vitrine vers une plateforme métier.',
    front: [
      ['Parcours publics et portails', 'React Router organise la vitrine, les parcours immobiliers, les portails et l’administration. Les composants de biens, formulaires et dossiers réutilisent un même vocabulaire métier.'],
      ['Gestion et comptabilité', 'Les tableaux de bord, historiques, journaux de banque et caisse, vues de revenus, fiscalité, rapports et modales de paiement permettent plusieurs lectures d’une opération. Recharts présente les agrégats et les tendances.'],
      ['État et documents', 'Zustand centralise les données et sélecteurs des domaines. Repositories, mappers et synchronisation relient la base aux vues. Les modules PDF et les relevés présentent les informations rattachées au bien, au mandat et au paiement.'],
    ],
    back: [
      ['Supabase et règles métier', 'L’authentification, les politiques SQL et les RPC encadrent les opérations persistées. Le rapprochement de loyer résout transaction, lot, bailleur, locataire et factures avant la ventilation.'],
      ['Calculs financiers', 'Le moteur de décomposition de loyer distingue hors charges et toutes charges comprises, usage, taxes et charges. Il reconstruit le principal et ajuste les arrondis pour retrouver le total d’entrée.'],
      ['Traçabilité comptable', 'Les écritures gardent leur origine; les corrections se font par contrepassation. Le modèle distingue les fonds de l’agence et ceux à reverser au propriétaire.'],
    ],
    methods: ['Stores métier et sélecteurs pour les vues financières', 'Repositories et mappers de synchronisation', 'Décomposition HC/TTC et correction des arrondis', 'Rapprochement et allocations selon les échéances', 'Mandat appliqué à la date du paiement', 'Contrepassation et historique documentaire'],
    lifecycle: 'Le bien et son mandat structurent le bail et les échéances. Une transaction rapprochée alimente les allocations, commissions et comptes; les documents conservent leur contexte métier. Une annulation laisse une contre-écriture permettant de reconstituer le chemin financier.',
    steps: ['Un gestionnaire saisit le bien, ses lots et les acteurs dans les formulaires.', 'Le bail et le mandat définissent les échéances et la règle de gestion applicable.', 'Le moteur de loyer calcule les composantes du montant et ajuste les arrondis.', 'Un paiement entre dans le parcours de rapprochement avec sa référence externe.', 'La RPC verrouille la transaction et vérifie montant et référence.', 'Le système résout lot, locataire, bailleur et factures puis répartit les allocations selon les échéances.', 'Le mandat valide à la date du paiement détermine les règles financières.', 'Les écritures distinguent recettes, dette propriétaire, commission et taxes.', 'Les stores et sélecteurs alimentent relevés, journaux, rapports et documents.', 'Si nécessaire, la contrepassation neutralise l’écriture tout en conservant son origine.'],
    architecture: `flowchart TB
      subgraph F[Expérience React / Vite]
        PUBLIC[Vitrine et parcours commerciaux]
        PORTALS[Portails propriétaire, locataire et gestion]
        OPS[Administration : biens, lots, mandats, baux]
        FIN[Comptabilité, fiscalité, rapports et journaux]
        FORMS[Formulaires, tableaux, modales et graphiques]
        STORE[Stores Zustand et sélecteurs]
        CALC[Moteur loyer : HC, TTC, taxes, arrondis]
        PUBLIC & PORTALS & OPS & FIN --> FORMS --> STORE
        FORMS --> CALC
      end
      subgraph S[Services et synchronisation]
        REPO[Repositories et mappers]
        SYNC[Cache, synchronisation et merge]
        AUTH[Supabase Auth et règles d’accès]
        RPC[RPC de rapprochement et opérations métier]
        PDF[Génération et gestion documentaire]
        STORE --> REPO --> SYNC --> AUTH
        AUTH --> RPC
        STORE --> PDF
      end
      subgraph D[PostgreSQL et Storage]
        PROPERTY[(Propriétaires, patrimoine et lots)]
        LEASE[(Locataires, mandats et baux)]
        PAY[(Factures, transactions et allocations)]
        LEDGER[(Comptes et écritures)]
        DOCS[(Documents et fichiers)]
        RPC --> PROPERTY & LEASE & PAY & LEDGER
        PDF --> DOCS
        LEDGER --> EXT[Contrepassation documentée]
      end`,
    sequence: `sequenceDiagram
      participant UI as Gestion et portail
      participant ST as Stores et services
      participant RPC as RPC de rapprochement
      participant DB as PostgreSQL
      participant DOC as Documents et relevés
      UI->>ST: Paiement et référence externe
      ST->>RPC: Valider le rapprochement
      RPC->>DB: Verrouiller la transaction
      RPC->>RPC: Vérifier montant, référence et état
      RPC->>DB: Résoudre bail, mandat, acteurs et factures
      RPC->>DB: Allouer selon les échéances
      RPC->>DB: Écritures recettes, propriétaire, commission, taxes
      DB-->>ST: État persistant actualisé
      ST-->>UI: Soldes, journaux et indicateurs
      UI->>DOC: Générer le relevé associé
      opt Annulation contrôlée
        UI->>RPC: Demande de contrepassation
        RPC->>DB: Écriture inverse liée à l’origine
      end`,
    sources: ['README.md','src/store/useAccountingStore.ts','src/utils/rentBreakdown.ts','src/hooks/useAccountingSelectors.ts','src/components/accounting','supabase/migrations'],
  },
  jokko: {
    purpose: 'JOKKO est une application de communication sur réseau local : conversations, texte, photos, fichiers, messages vocaux et appels. Le client mobile et le serveur partagent un protocole explicite pour gérer l’envoi, l’état de lecture et la reprise de connexion.',
    front: [
      ['Conversation mobile', 'Expo Router structure les vues. Composer, MessageList et les bulles spécialisées gèrent texte, voix, image et fichier; les états vide, erreur, connexion et présence ont leurs propres composants.'],
      ['État événementiel', 'Des stores Zustand distincts suivent authentification, conversations, messages, présence, saisie et appels. Le dispatcher convertit les événements du serveur en mutations ciblées, met à jour le dernier message et les compteurs non lus.'],
      ['Appels et capacités natives', 'CallManager et les vues d’appel séparent invitation, contrôles et média. Le client utilise caméra, audio, sélecteurs de fichiers, stockage sécurisé et WebRTC selon l’environnement.'],
    ],
    back: [
      ['Monorepo et contrats', 'Les paquets shared, server et mobile partagent TypeScript et Zod. Fastify expose le HTTP et un WebSocket versionné; le handshake authentifie la session avant les commandes.'],
      ['Messages et reprise', 'Le serveur contrôle l’appartenance au fil, reconnaît un client_msg_id déjà reçu, attribue seq et renvoie l’ACK. La reconnexion reprend les messages autorisés après lastSeq.'],
      ['Fichiers et signalisation', 'Les fichiers sont associés aux messages; HTTP sert le contenu, y compris par plages. Les événements offer/answer/ICE signalent les appels; le média WebRTC a sa propre voie.'],
    ],
    methods: ['Contrats et validateurs partagés', 'État optimiste puis réconciliation sur ACK', 'Déduplication et séquence serveur', 'Dispatcher par type d’événement', 'SQLite WAL, relations et contraintes', 'Signalisation WebRTC distincte du transport média'],
    lifecycle: 'Le message commence dans le store client avec un identifiant local. L’ACK remplace les identifiants et l’heure par ceux du serveur; les receipts font évoluer livraison et lecture. Les conversations, fichiers et appels conservent leurs liens relationnels. Les messages de replay sont filtrés selon les appartenances.',
    steps: ['Le client configure le serveur LAN, ouvre une session et établit le handshake WebSocket.', 'Le mobile charge ses conversations, l’historique et les états de présence.', 'Le Composer crée une demande identifiée; l’interface peut afficher le message en attente.', 'Le routeur valide l’enveloppe versionnée et le schéma de message.', 'Le handler contrôle le membre et cherche une demande déjà reçue avec le même client_msg_id.', 'SQLite insère une seule fois le message et lui donne une séquence serveur.', 'L’ACK réconcilie le message optimiste dans le store de l’expéditeur.', 'L’événement message.new met à jour le fil, le dernier message et les non-lus du destinataire.', 'Les receipts mettent à jour les bulles sans rétrograder un message déjà lu.', 'Après reconnexion, lastSeq permet de recevoir le replay des messages des conversations autorisées.'],
    architecture: `flowchart TB
      subgraph M[Application Expo / React Native]
        UI[Routes, conversations, contacts et historique]
        CHAT[Composer, MessageList, bulles texte, voix, image, fichier]
        CALL[CallManager, appel entrant et contrôles]
        STORES[Zustand : auth, conversation, message, présence, saisie, appel]
        DISP[Dispatcher des événements]
        HTTP[Client HTTP et téléversements]
        WS[WebSocket : hello, messages, receipts, présence]
        UI --> CHAT & CALL
        CHAT & CALL --> STORES
        DISP --> STORES
        STORES --> HTTP & WS
        WS --> DISP
      end
      subgraph CONTRACTS[Contrats partagés]
        TS[Types TypeScript, enveloppes v1 et Zod]
        TS -. valide .-> WS
        TS -. valide .-> ROUTER
      end
      subgraph SERVER[Serveur Fastify]
        REST[HTTP : auth, conversations, fichiers, appels]
        ROUTER[Handshake et routeur WebSocket]
        HAND[Handlers messages, receipts, saisie, présence, appels]
        SQL[Requêtes centralisées, idempotence et séquence]
        HTTP --> REST
        WS <--> ROUTER
        ROUTER --> HAND --> SQL
        REST --> SQL
      end
      subgraph DATA[Persistance locale]
        DB[(SQLite WAL : utilisateurs, membres, messages, receipts, appels)]
        FILES[(Fichiers et associations aux messages)]
        SQL --> DB
        REST --> FILES
      end
      CALL <-->|média WebRTC P2P| PEER[Autre client]
      HAND -. signalisation offer answer ICE .-> CALL`,
    sequence: `sequenceDiagram
      participant UI as Composer et store mobile
      participant WS as Routeur WebSocket
      participant H as Handler message
      participant DB as SQLite
      participant D as Dispatcher destinataire
      UI->>UI: Créer client_msg_id et état en attente
      UI->>WS: message.send enveloppé
      WS->>H: Valider et dispatcher
      H->>DB: Vérifier membre et identifiant déjà reçu
      alt Demande nouvelle
        H->>DB: Insérer et attribuer seq
      else Réessai
        DB-->>H: Message existant
      end
      H-->>UI: message.ack
      UI->>UI: Réconcilier id, seq, date et statut
      H-->>D: message.new
      D->>D: Fil, dernier message et compteur non lu
      D-->>WS: Accusé de livraison
      WS-->>UI: receipt.update
      Note over UI,WS: Après une coupure
      UI->>WS: hello avec lastSeq
      WS->>DB: Lire le replay autorisé
      WS-->>UI: Messages manquants`,
    sources: ['README.md','contracts/schema.sql','contracts/protocol.ts','mobile/src/realtime/dispatcher.ts','mobile/src/store/messageStore.ts','server/src/ws/handlers/message.ts'],
  },
  axis: {
    purpose: 'Axis rassemble le cadrage des projets clients, leur espace de travail et un volet site/académie. Le parcours de découverte aide un client à préciser son idée; les services d’IA préparent des questions et des livrables que je peux relire et exploiter pour la conception.',
    front: [
      ['Brief et espace projet', 'PublicIntakeView collecte le besoin; les vues admin regroupent tableau de bord, paramètres et espace projet. Les modales de création, le client API et le studio de modélisation relient le parcours client au travail de conception.'],
      ['Modélisation et documents', 'ProjectModelingStudio et Mermaid affichent la structure du projet. Les exports et archives regroupent les livrables; la discussion de cadrage sert de contexte à l’assistant.'],
      ['Site et académie', 'L’offre de formation, les inscriptions, leçons, quiz, rendus, paiements et progression constituent un autre domaine de la plateforme, relié aux services Supabase.'],
    ],
    back: [
      ['API Express', 'Les routes next-questions, generate-scoping, analyze-billing-modules et copilot/ask délèguent aux services Gemini et organisent les réponses attendues par les écrans.'],
      ['Intégration IA', 'Le serveur conserve l’appel au fournisseur et prépare le contexte. Les sorties structurées alimentent la synthèse, les modules de facturation et les diagrammes du projet.'],
      ['Académie et base', 'Les tables site et academy séparent catalogue, leads, inscriptions, leçons, corrections, paiements, progression, rendus et notifications sortantes.'],
    ],
    methods: ['Questionnaire de découverte guidé', 'Client API et services IA côté serveur', 'Modélisation Mermaid intégrée au produit', 'Décomposition du cadrage et de la facturation', 'SQL versionné et mutations privilégiées côté serveur', 'Révision humaine des livrables générés'],
    lifecycle: 'Le brief et les réponses enrichissent progressivement le contexte du projet. Les livrables de cadrage alimentent l’espace de travail et les exports. Dans l’académie, inscription, paiement, leçon, progression et rendu restent des objets distincts.',
    steps: ['Le client expose son projet depuis le parcours public de cadrage.', 'L’interface transmet le contexte pour obtenir les questions suivantes.', 'Le serveur appelle le service Gemini avec le besoin et les contraintes.', 'Les réponses du client enrichissent le contexte jusqu’au cadrage.', 'generate-scoping prépare les éléments de conception attendus.', 'Le studio présente les livrables et les diagrammes dans l’espace projet.', 'Le copilote répond aux questions sur le contexte et aide à relire les choix.', 'Le module de facturation analyse la décomposition fonctionnelle.', 'Les documents ou archives sont exportés; les décisions finales restent revues humainement.'],
    architecture: `flowchart TB
      subgraph F[Interfaces React / Vite]
        INTAKE[Brief public et questions]
        ADMIN[Dashboard et espace projet]
        STUDIO[Studio de modélisation et Mermaid]
        ACADEMY[Site et parcours académie]
        API[Client API]
        INTAKE & ADMIN & STUDIO --> API
      end
      subgraph B[Express et services]
        Q[Questions suivantes]
        S[Cadrage du projet]
        BILL[Analyse des modules de facturation]
        COP[Copilote]
        GEM[Service Gemini]
        PLATFORM[Services plateforme et académie]
        API --> Q & S & BILL & COP & PLATFORM
        Q & S & BILL & COP --> GEM
        GEM --> DOC[Livrables et diagrammes]
        DOC --> STUDIO
      end
      subgraph D[Supabase]
        AUTH[Auth et politiques SQL]
        SITE[(Cours publics et leads)]
        A[(Inscriptions, leçons, paiements)]
        P[(Progression, rendus, corrections)]
        OUT[(Notifications sortantes)]
        PLATFORM --> AUTH
        AUTH --> SITE & A & P & OUT
        ACADEMY --> PLATFORM
      end`,
    sequence: `sequenceDiagram
      participant C as Parcours client
      participant API as API Express
      participant AI as Service Gemini
      participant W as Espace projet
      C->>API: Contexte et réponses
      API->>AI: Préparer les questions suivantes
      AI-->>C: Questions de cadrage
      C->>API: Réponses et périmètre enrichi
      API->>AI: Générer le cadrage structuré
      AI-->>API: Livrables de conception
      API-->>W: Synthèse et éléments de modélisation
      W->>W: Afficher les diagrammes Mermaid
      W->>API: Question au copilote
      API->>AI: Répondre dans le contexte du projet
      AI-->>W: Explication à relire
      W->>W: Revue et export du dossier`,
    sources: ['src/views/public/PublicIntakeView.tsx','src/views/admin/ProjectWorkspaceView.tsx','src/components/modeling/ProjectModelingStudio.tsx','src/server/index.ts','docs/site/supabase-foundation.sql'],
  },
  maritime: {
    purpose: 'Ce projet est le moteur d’un système de surveillance maritime par imagerie satellite. Il organise l’ingestion des scènes, le traitement raster, la détection de navires et la préparation de données géographiques pour des vues d’analyse.',
    front: [
      ['Périmètre du dépôt', 'Le dépôt fourni contient le backend et les workers. FastAPI expose les données et la documentation HTTP pour un client cartographique; les écrans de production ne sont pas présents ici et ne sont donc pas reconstitués comme s’ils avaient été lus.'],
      ['Contrat de consommation', 'Les DTO Pydantic représentent détections, environnement, trajectoires, risques, événements et dossiers. Ces objets donnent au futur client un contrat plus précis qu’une simple liste de coordonnées.'],
    ],
    back: [
      ['Ingestion et prétraitement', 'La recherche satellite utilise une emprise et une période, puis un cache de produits. Les scènes sont lues par fenêtres avec recouvrement; le SAR possède un prétraitement dédié.'],
      ['Inférence et géographie', 'Le worker exécute la détection dans un executor. YOLO produit des boîtes, la transformation raster situe leur centre et les objets de détection sont agrégés dans le résultat du worker.'],
      ['Domaines API', 'Les routes ships, analytics, environment, forensics, explainability, security et simulation sont regroupées dans FastAPI. Le client Supabase propose les insertions et lectures de plusieurs DTO.'],
    ],
    methods: ['Traitement raster par tuiles avec recouvrement', 'Séparation des workers I/O et de l’inférence', 'Transformation pixel vers coordonnées', 'DTO typés pour plusieurs domaines maritimes', 'Fusion optique, SAR et AIS comme module distinct', 'API de consommation séparée du pipeline'],
    lifecycle: 'Les produits sont cherchés, téléchargés ou relus depuis le cache, puis découpés. Le worker retourne des détections et nettoie les fichiers bruts après le traitement. Le raccord automatique à la persistance n’est pas complet dans le worker examiné : le diagramme le montre comme une frontière à raccorder, sans simuler un flux déjà déployé.',
    steps: ['La zone et la période servent à rechercher les produits satellite.', 'Le worker consulte le cache et télécharge les scènes manquantes.', 'Rasterio parcourt la scène par fenêtres recouvrantes et expose les transformations.', 'Le prétraitement prépare l’image ou les bandes SAR.', 'Le worker délègue l’inférence YOLO à un executor.', 'Les boîtes détectées sont converties en positions géographiques et DTO.', 'Les détections sont agrégées puis renvoyées par le worker.', 'Le module multi-source compare les observations avec ses autres sources.', 'Le client Supabase et les routes API structurent la persistance et la consultation; le raccord du worker reste explicite.'],
    architecture: `flowchart TB
      subgraph INPUT[Sources et ingestion]
        QUERY[Zone et période]
        STAC[Recherche Sentinel / STAC]
        CACHE[(Cache de scènes)]
        SAT[Worker de téléchargement]
        QUERY --> STAC --> SAT
        SAT <--> CACHE
      end
      subgraph PROCESS[Traitement Python]
        RASTER[Rasterio : fenêtres et recouvrement]
        PRE[Normalisation et prétraitement SAR]
        EXEC[Executor du worker]
        YOLO[Inférence YOLO]
        GEO[Transformation pixel vers GPS]
        DTO[ShipDetectionCreate et agrégation]
        SAT --> RASTER --> PRE --> EXEC --> YOLO --> GEO --> DTO
      end
      subgraph DOMAIN[Analyse et domaines]
        FUS[Fusion optique, SAR, AIS]
        RISK[Risque, comportement et trajectoires]
        DB[Client Supabase et DTO Pydantic]
        DTO --> FUS --> RISK
        DTO -. raccord de persistance à compléter .-> DB
      end
      subgraph API[FastAPI : consommation]
        ROUTES[Ships, analytics, environment]
        STRAT[Forensics, explain, security, simulation]
        CLIENT[Client HTTP ou cartographique]
        DB --> ROUTES & STRAT
        ROUTES & STRAT --> CLIENT
      end`,
    sources: ['api/main.py','database/schemas.py','workers/satellite_worker.py','workers/detection_worker.py','ai/ship_detection/inference.py','services/preprocessing/tiler.py'],
  },
}
