export const deepExtras = {
  nps: {
    purpose:'NPS est la plateforme de Nouvelles Perspectives Sénégal. Elle présente articles, projets et événements, permet l’inscription à un événement et offre une administration des contenus, contacts et inscriptions.',
    front:[['Site public','React Router relie accueil, événements et leurs détails, inscription, projets, blog, services et contact. Les composants de layout gardent une navigation commune sur mobile et ordinateur.'],['Administration et état serveur','Les vues admin gèrent événements, blog, projets, contacts et inscriptions. Les hooks TanStack Query isolent listes et détails; les mutations invalident les clés de cache et présentent des retours utilisateur.']],
    back:[['Services typés','Les services events, registrations, blog, projects, contacts, auth et stats regroupent les requêtes Supabase. Les types sont liés au schéma Database.'],['Inscription et contenu','Les événements publiés sont filtrés et triés pour le site. Une inscription reçoit un code de confirmation et une référence d’événement; l’administration peut retrouver inscriptions et événements associés.']],
    methods:['React Router et layouts séparés','TanStack Query : cache et invalidation','Services Supabase par domaine','Types de données issus du schéma','Parcours public vers administration de contenu'],
    lifecycle:'Un contenu passe par la gestion puis est lu sur le site selon son état publié. L’inscription reste associée à l’événement et à son code; les listes administratives réunissent ensuite ces informations pour le suivi.',
    steps:['L’administration crée ou actualise un événement.','Le hook de mutation appelle eventsService.','Supabase enregistre la ligne; le cache événements est invalidé.','Le site public lit les événements publiés, par date et catégorie.','Le visiteur ouvre le détail et remplit le formulaire d’inscription.','registrationsService produit un code et insère event_registrations.','La confirmation retrouve l’événement lié à l’inscription.','L’interface admin lit les inscriptions et associe les événements par identifiant.'],
    architecture:`flowchart TB
      subgraph F[Frontend React et Vite]
        PUBLIC[Site : événements, projets, blog et contact]
        REG[Inscription et confirmation]
        ADMIN[Dashboard et formulaires admin]
        Q[Hooks TanStack Query et mutations]
        PUBLIC & REG & ADMIN --> Q
      end
      subgraph S[Services]
        EVT[events et registrations]
        CMS[blog, projects et contacts]
        AUTH[auth et contrôle de parcours admin]
        REST[Client Supabase et helpers REST]
        Q --> EVT & CMS & AUTH
        EVT & CMS & AUTH --> REST
      end
      subgraph D[Supabase PostgreSQL et Storage]
        E[(events et event_registrations)]
        C[(blog_posts, projects, contacts)]
        U[(users et admin_otp)]
        IMG[(Images)]
        REST --> E & C & U & IMG
      end`,
    sources:['README.md','src/hooks/use-events.ts','src/services/events.service.ts','src/services/registrations.service.ts','supabase/migrations/20251223210000_initial_schema.sql'],
  },
  mova: {
    purpose:'Mova vise à protéger la relation acheteur-vendeur lors d’une livraison : le paiement reste en attente jusqu’à la réalisation des conditions prévues, avec examen du litige lorsque la transaction ne peut pas être confirmée.',
    front:[['Application mobile en cours','Le projet utilise Swift et Firebase selon le périmètre décrit. Les parcours concernent acheteur, vendeur, livraison et résolution des désaccords. Le dépôt source n’a pas été fourni dans les chemins disponibles.']],
    back:[['Périmètre fonctionnel','Les règles de libération et remboursement doivent être satisfaites; l’administrateur intervient dans les cas litigieux. Aucune API financière ou intégration réelle n’est attribuée sans lecture du code.']],
    methods:['Conception d’états de transaction','Modélisation des conditions de livraison','Parcours de litige et validation manuelle'],
    lifecycle:'Le concept distingue paiement en attente, livraison, confirmation et décision de litige. Ce parcours décrit le produit en cours, et non un flux bancaire vérifié.',
    steps:['L’acheteur et le vendeur conviennent d’une commande.','Le paiement est placé dans l’état d’attente prévu par le produit.','La livraison doit satisfaire les conditions de confirmation.','La confirmation autorise la libération du paiement.','En cas de désaccord, le dossier suit une résolution manuelle.'],
    sources:[],
  },
  terra: {
    purpose:'Terra Immo est un projet client de commercialisation de terrains sur la Petite Côte. Il vise à rendre les biens consultables et à organiser les demandes des acquéreurs; le développement n’a pas été terminé.',
    front:[['Parcours commercial','Les parcours décrits concernent la découverte d’un terrain, ses détails et la demande d’intérêt. Aucun dépôt Terra Immo distinct n’a été identifié dans les chemins fournis.']],
    back:[['Périmètre à documenter','La gestion des terrains et des prospects fait partie du besoin décrit. La stack, les tables et les endpoints ne sont pas présentés comme vérifiés en l’absence du dépôt correspondant.']],
    methods:['Cadrage de parcours acquéreur','Organisation de fiches de biens','Développement et accompagnement commercial'],
    lifecycle:'La fiche terrain doit soutenir la consultation et la demande. Le récit reste limité au périmètre fonctionnel confirmé du projet non terminé.',
    steps:['Présentation de l’offre de terrains.','Consultation des informations du bien.','Expression d’intérêt de l’acquéreur.','Suivi de la demande commerciale.'],
    sources:[],
  },
  affiliation: {
    purpose: 'Le portail d’affiliation Edukora organise l’acquisition commerciale des écoles : candidatures d’apporteurs, cartographie des prospects, réservation des leads, conversion des écoles, commissions et demandes de retrait.',
    front: [['Espaces par profil','React et TanStack Router/Start séparent les parcours apporteur, influenceur, analyste et administration. Les services chargent statistiques, leads, portefeuille, retraits et notifications.'],['Cartographie et formulaires','Leaflet présente les écoles disponibles. Les formulaires et validateurs accompagnent inscription, qualification, réservation et changement de statut; l’interface suit session, rôle et résultat des actions.']],
    back: [['Supabase Auth et PostgreSQL','Les profils sont résolus depuis l’identité et les tables aff_*. Les tables, contraintes, RLS, triggers et fonctions PL/pgSQL portent les règles du portail.'],['Réservation et finances','Les RPC contrôlent les doublons, verrouillent la disponibilité d’une école et créent un lead. La validation d’un paiement crée les commissions; une unicité sur le paiement encadre leur duplication.']],
    methods:['Réservation concurrente de prospects','RPC et invariants financiers SQL','Résolution de rôle et session côté interface','Cartographie Leaflet','Chaîne lead → école → paiement → commission'],
    lifecycle:'Le lead garde son apporteur et son état. Une école cliente peut être liée au lead; chaque paiement validé donne lieu à une commission distincte. Les retraits et notifications complètent l’historique du portefeuille.',
    steps:['La session Supabase établit l’identité; le client résout le profil actif.','Les services chargent les statistiques, leads et écoles disponibles.','L’apporteur sélectionne une école ou décrit un nouveau prospect.','Une RPC vérifie les doublons et verrouille la disponibilité.','Le lead est créé et la carte est réservée.','Les actions de qualification font évoluer le statut du lead.','Après conversion, un paiement d’école est enregistré et validé.','Le trigger génère la commission rattachée à ce paiement.','L’apporteur suit le solde et demande un retrait, avec un historique séparé.'],
    architecture:`flowchart TB
      subgraph F[Frontend React et TanStack]
        AUTH[Connexion et inscription]
        ROLE[Résolution du profil]
        APP[Apporteur : carte, leads, portefeuille]
        INF[Influenceur : promotions et résultats]
        ADMIN[Admin et analyste : validation et suivi]
        SVC[Services Supabase et formulaires]
        AUTH --> ROLE --> APP & INF & ADMIN
        APP & INF & ADMIN --> SVC
      end
      subgraph B[Supabase et logique SQL]
        SA[Supabase Auth]
        RLS[RLS sur tables aff]
        LEAD[RPC réservation et transitions]
        PAY[RPC paiement et retraits]
        TRIG[Trigger de commission]
        SVC --> SA & RLS & LEAD & PAY
        PAY --> TRIG
      end
      subgraph D[Modèle commercial]
        PRO[(Apporteurs et influenceurs)]
        CARTE[(Cartographie et leads)]
        SCHOOL[(Écoles clientes et paiements)]
        MONEY[(Commissions et retraits)]
        LEAD --> CARTE
        RLS --> PRO
        PAY --> SCHOOL
        TRIG --> MONEY
        SCHOOL -. synchronisation .-> E[Edukora SaaS]
      end`,
    sources:['README.md','src/hooks/use-require-role.ts','src/lib/supabase/apporteur-actions.ts','supabase/migrations/003_portail_commissions.sql'],
  },
  maison: {
    purpose:'Maison Web organise les stocks et la caisse d’une boutique et d’une maison : produits, prélèvements, réapprovisionnements, transferts, consommation, dépenses et budgets.',
    front:[['Interfaces de gestion','React regroupe pages de stock, formulaires de gestion, analytics et administration. Le client manipule produits, règles, mouvements, comptages et dépenses à travers les services Supabase.'],['Historique et décisions','Les filtres, confirmations et indicateurs mettent les opérations en contexte. Une annulation demande une action explicite et un motif plutôt que de masquer simplement une ligne.']],
    back:[['Fonctions transactionnelles','Les RPC évaluent les règles et le solde, verrouillent les produits concernés et appliquent les mutations de stock. request_id permet de reconnaître une demande répétée.'],['Audit et caisse','Les opérations d’annulation vérifient le rôle, écrivent un mouvement inverse, mettent à jour les dépendances et produisent une trace administrative. RLS répartit l’accès aux lignes.']],
    methods:['Idempotence par acteur et request_id','Verrous transactionnels et advisory','Contraintes sur quantités et stock','Écriture compensatrice','RLS et fonctions métier privilégiées','Indicateurs issus de l’historique'],
    lifecycle:'Le solde courant résume les mouvements. La demande, son acteur et ses références restent dans l’historique; les annulations créent une compensation et un audit. Les comptages et cycles sont distingués des mouvements ordinaires.',
    steps:['Le membre choisit un produit, un lieu et une quantité dans l’interface.','Le client envoie la demande métier avec un identifiant de requête.','La fonction SQL vérifie le profil, les règles et la répétition de la demande.','Le produit et son solde sont verrouillés pour la mutation.','Le mouvement et le solde sont écrits dans la transaction.','Les vues de stock, caisse et historique présentent le résultat.','Un administrateur peut demander une annulation motivée.','La fonction vérifie le stock, crée une compensation et journalise l’opération.'],
    architecture:`flowchart TB
      subgraph F[Interface React]
        ST[Stocks et mouvements]
        FORMS[Formulaires et confirmations]
        AN[Analytics et administration]
        CLIENT[Client Supabase typé]
        ST & FORMS & AN --> CLIENT
      end
      subgraph B[PostgreSQL]
        AUTH[Auth et RLS]
        RPC[RPC : règles, idempotence, verrous]
        VOID[Annulation avec motif et compensation]
        CLIENT --> AUTH --> RPC
        RPC --> VOID
      end
      subgraph D[Données]
        P[(Produits et règles)]
        S[(Soldes et mouvements)]
        C[(Caisse, budgets, cycles, comptages)]
        A[(Audit)]
        RPC --> P & S & C
        VOID --> S & C & A
      end`,
    sources:['src/App.tsx','src/StockPages.tsx','src/ManageForms.tsx','src/AnalyticsPage.tsx','supabase/migrations'],
  },
  house: {
    purpose:'HouseConnect est un tableau de bord domotique qui permet d’explorer une maison par pièce et de manipuler des appareils simulés : lumière, réfrigérateur et thermostat.',
    front:[['Plan et appareils','Le plan FloorPlan et les cartes spécialisées représentent les pièces, les capacités et les états. Les commandes permettent alimentation, luminosité, température et mode.'],['Gestion d’état','DeviceService relie les composants au store Zustand. Il applique un état optimiste, transmet la commande et reçoit les événements de l’adaptateur. Le simulateur introduit latence, erreur et télémétrie.']],
    back:[['Adaptateur interchangeable','Le contrat IoTDeviceAdapter isole l’interface des futurs transports MQTT, HTTP ou WebSocket. Le dépôt instancie SimulatedAdapter et conserve les états en mémoire; il n’expose pas encore de serveur matériel.']],
    methods:['Adapter pattern','Store par état d’appareil','Mise à jour optimiste et retour d’erreur','Registre des capacités','Simulation de télémétrie et de réseau'],
    lifecycle:'Les appareils sont initialisés depuis un registre. Leurs états évoluent en mémoire au rythme des commandes et de la simulation; ils reviennent à l’état initial au rechargement. Aucun stockage relationnel n’est revendiqué.',
    steps:['L’interface charge le registre de pièces et d’appareils.','Une carte affiche les capacités et l’état connu.','L’utilisateur modifie une commande.','DeviceService met à jour le store de manière optimiste.','L’adaptateur simule le délai et le résultat.','Un événement d’état revient vers le service puis le store.','Les cartes se mettent à jour; le basculement d’alimentation peut être restauré en cas d’échec.'],
    architecture:`flowchart LR
      PLAN[Plan des pièces] --> UI[Cartes lumière, frigo, thermostat]
      UI --> SERVICE[DeviceService]
      REG[DeviceRegistry et capacités] --> SERVICE
      SERVICE --> STORE[Store Zustand]
      STORE --> UI
      SERVICE --> ADAPTER[Contrat IoTDeviceAdapter]
      ADAPTER --> SIM[SimulatedAdapter]
      SIM --> EVENTS[Latence, échec et télémétrie]
      EVENTS --> SERVICE`,
    sources:['src/pages/Dashboard.tsx','src/components/house/FloorPlan.tsx','src/core/services/DeviceService.ts','src/core/adapters/SimulatedAdapter.ts'],
  },
  astronet: {
    purpose:'ASTRONET explore une chaîne d’analyse de courbes photométriques : récupérer une observation d’archive, extraire les données FITS, les préparer puis les transmettre à un module C++ depuis une API Python.',
    front:[['Consommation du moteur','Le dépôt est un service d’analyse et ne contient pas d’interface web scientifique complète. Son entrée HTTP permet à un client de demander une analyse et de recevoir des données JSON.']],
    back:[['Ingestion réelle','Astroquery recherche des produits K2/TESS dans MAST. Le client choisit les colonnes temps et flux, retire les valeurs invalides, normalise et conserve un cache NumPy.'],['Pont natif','pybind11 transmet les vecteurs au moteur C++. Celui-ci comprend des calculs exploratoires, mais certaines sorties de période, gaz et température sont synthétiques dans l’état examiné.']],
    methods:['Formats scientifiques FITS et NPZ','Nettoyage et normalisation NumPy','Cache local avant téléchargement','Séparation Python / C++','Binding pybind11 et API FastAPI'],
    lifecycle:'Le téléchargement produit un FITS; la préparation extrait des séries et les met en cache dans un fichier NPZ. Les vecteurs sont passés au moteur natif et le résultat est sérialisé par FastAPI. Il n’y a pas de base relationnelle dans ce dépôt.',
    steps:['Le client demande une analyse par nom via FastAPI.','Le service cherche un cache NPZ existant.','En son absence, le client MAST recherche un produit FITS compatible.','Le fichier est téléchargé puis ses colonnes temps et flux sont extraites.','Les NaN sont filtrés et le flux est normalisé par sa médiane.','Les séries sont conservées dans le cache.','Le binding transmet les vecteurs au moteur C++.','Le service retourne le résultat du prototype en JSON.'],
    architecture:`flowchart LR
      HTTP[Client HTTP] --> API[FastAPI]
      API --> CACHE{Cache NPZ}
      CACHE -->|absent| MAST[Astroquery et MAST]
      MAST --> FITS[Lecture FITS et choix des colonnes]
      FITS --> NORM[Filtre NaN et normalisation]
      NORM --> NPZ[(Fichier NumPy)]
      CACHE -->|présent| NPZ
      NPZ --> BIND[pybind11]
      BIND --> CPP[Moteur C++ exploratoire]
      CPP --> API`,
    sources:['README.md','data_ingestion/nasa_client.py','api/main.py','core_analyzer/analyzer.cpp','bridge/bindings.cpp'],
  },
  timekeeper: {
    purpose:'Timekeeper Connect, nommé PresenceFlow dans le README, explore un parcours de présence employé combinant onboarding, QR temporaire, position géographique et collecte de credentials passkey.',
    front:[['Parcours employés','React/Vite comprend connexion, onboarding, affichage du QR et pointage. Les formulaires recueillent le profil et les éléments de la demande; le navigateur fournit les capacités caméra, position et WebAuthn.'],['Administration','Le tableau de bord présente les statistiques et l’historique. Le client API sépare les appels HTTP des pages.']],
    back:[['Express et validation','Le serveur crée les challenges, vérifie leurs états et la position puis enregistre la présence. Zod valide les payloads; la vérification cryptographique passkey reste incomplète.'],['Persistance du prototype','JSONStorage conserve utilisateurs, passkeys, challenges et présences dans des fichiers. Un schéma SQL/Supabase est aussi présent comme cible distincte.']],
    methods:['Challenge UUID à durée limitée','Modélisation du cycle de pointage','Validation Zod','Contrôle de zone','Séparation API et pages React'],
    lifecycle:'Le challenge porte utilisateur, type et expiration puis devient utilisé. La présence conserve son horodatage et son contexte. Le stockage effectif est local JSON; le schéma PostgreSQL ne doit pas être présenté comme le moteur actif du prototype.',
    steps:['L’employé complète son profil et le parcours de credential.','Le client demande un challenge IN ou OUT.','Le serveur crée un UUID et une expiration de 60 secondes.','Le QR transporte les références du challenge.','Le parcours de présence collecte challenge, compte et position.','Le serveur vérifie le challenge et l’utilisateur puis le rayon.','La présence est enregistrée dans JSONStorage.','L’interface consulte et filtre l’historique via l’API.'],
    architecture:`flowchart TB
      UI[React : login, onboarding, QR, pointage, admin] --> CLIENT[Client API]
      GEO[Géolocalisation navigateur] --> UI
      PASS[Collecte WebAuthn] --> UI
      CLIENT --> EXP[Express]
      EXP --> QR[Challenges temporaires]
      EXP --> ATT[Validation de présence et zone]
      EXP --> HIST[Historique]
      QR & ATT & HIST --> JSON[JSONStorage]
      JSON --> FILES[(Users, passkeys, QR, attendances)]
      TARGET[Schéma SQL prévu] -. distinct du stockage actif .-> PG[(PostgreSQL / Supabase)]`,
    sources:['README.md','src/pages/Attendance.tsx','src/pages/Onboarding.tsx','server/src/routes/attendance.ts','server/src/storage.ts'],
  },
  agro: {
    purpose:'Agro est une application web Laravel de suivi du cheptel : enregistrer les animaux, les rattacher à un éleveur et les retrouver par espèce, nom et état de santé.',
    front:[['Pages Blade','Les vues couvrent accueil, listes et détails d’animaux, création, édition, profil, connexion et inscription. L’administration distingue tableaux de bord, gestion des animaux et des utilisateurs.'],['Navigation métier','Les formulaires validés et la pagination organisent les recherches sans imposer le chargement d’un catalogue entier.']],
    back:[['Laravel MVC','Les routes web utilisent session et middleware; les contrôleurs portent recherche, filtres, statistiques et écritures. Eloquent relie User et Animal.'],['Contraintes','Le schéma précise espèces et états de santé, poids décimal et naissance. La validation contrôle les valeurs acceptées avant l’écriture.']],
    methods:['Laravel MVC et Blade','Relations Eloquent','Validation alignée aux catégories SQL','Recherche et pagination','Séparation des actions administratives'],
    lifecycle:'La fiche représente l’état courant de l’animal et sa relation au compte. Les mises à jour changent cette fiche; le dépôt examiné ne stocke pas de série historique de soins ou de vaccinations.',
    steps:['L’utilisateur s’inscrit puis ouvre une session.','La route authentifiée charge la liste d’animaux.','Le contrôleur applique recherche, filtres et pagination.','La page Blade présente les résultats et les accès au détail.','Un administrateur ouvre un formulaire de création ou édition.','Laravel valide espèce, état, date et poids.','Eloquent enregistre la fiche liée au propriétaire.','La liste et les statistiques reflètent les données courantes.'],
    architecture:`flowchart TB
      UI[Pages Blade : liste, détail, formulaires, profil] --> ROUTES[Routes Laravel et session]
      ADM[Pages admin : dashboard, animaux, utilisateurs] --> ROLE[Middleware admin]
      ROLE --> ROUTES
      ROUTES --> CONT[AnimalController et AdminController]
      CONT --> VALID[Validation et filtres]
      VALID --> ELOQ[Eloquent User et Animal]
      ELOQ --> USERS[(users)]
      ELOQ --> ANIMALS[(animals)]
      USERS -->|propriétaire| ANIMALS
      CONT --> PAG[Pagination et statistiques] --> UI`,
    sources:['routes/web.php','app/Http/Controllers/AnimalController.php','app/Models/Animal.php','resources/views/animals','resources/views/admin'],
  },
  edupro: {
    purpose:'EduPro Backend est une API scolaire qui structure les ressources étudiants, cours, formateurs, notes, bulletins et emplois du temps pour alimenter un client de gestion.',
    front:[['Contrat client','Ce dépôt correspond au backend. Les réponses JSON et ressources REST fournissent les objets à une interface scolaire; les écrans complets du client ne sont pas présents dans le périmètre relu.']],
    back:[['Ressources Laravel','apiResource répartit les opérations vers les contrôleurs dédiés. Les modèles Eloquent et migrations décrivent les entités scolaires et leurs relations.'],['Validation et modèle','Les contrôleurs valident les requêtes et renvoient du JSON. Les contrats des notes et bulletins constituent encore un chantier d’alignement dans cette version.']],
    methods:['Découpage API par ressource','Migrations et relations SQL','Contrôleurs et validation Laravel','Contrats JSON pour un frontend séparé'],
    lifecycle:'Les données de référence étudiants et cours sont réutilisées par notes, bulletins et horaires. La fiche décrit la structure de l’API observée, sans présenter les agrégats scolaires comme finalisés.',
    steps:['Un client appelle la ressource REST choisie.','Laravel sélectionne le contrôleur de la ressource.','Le contrôleur valide la demande lorsque les règles sont définies.','Le modèle Eloquent lit ou crée l’objet.','Les relations résolvent étudiant, cours et données associées.','Le résultat est renvoyé en JSON au client.'],
    architecture:`flowchart LR
      UI[Client scolaire séparé] --> R[Routes apiResource]
      R --> C[Contrôleurs Student, Filiere, Formateur, Note, Bulletin, Schedule]
      C --> V[Validation de requête]
      V --> M[Modèles Eloquent]
      M --> S[(Students et courses)]
      M --> N[(Notes et bulletins)]
      M --> H[(Formateurs et schedules)]
      M --> JSON[Réponse JSON] --> UI`,
    sources:['routes/api.php','app/Http/Controllers/Api','app/Models','database/migrations'],
  },
  dashboard: {
    purpose:'Dashboard Backend est un module Laravel de gestion de tâches destiné à alimenter une interface de tableau de bord. Une tâche conserve titre, statut, type, date et urgence.',
    front:[['Contrat d’intégration','L’interface du tableau de bord est un consommateur externe; le dépôt fourni expose la ressource API et son modèle de données.']],
    back:[['Chaîne CRUD','La route apiResource appelle TacheController. Le modèle autorise les champs métier et la migration crée la table taches; chaque action fournit un résultat JSON.']],
    methods:['API REST Laravel','Chaîne route, contrôleur, modèle, migration','Assignation contrôlée par fillable'],
    lifecycle:'Une tâche est créée, consultée, modifiée puis supprimée par les opérations de la ressource. Le dépôt porte sur ce périmètre simple, sans workflow d’équipe ou historique d’événements.',
    steps:['Le client demande une liste ou une opération de tâche.','La route REST sélectionne TacheController.','Le contrôleur utilise le modèle Tache.','Eloquent lit ou modifie la table taches.','Le résultat JSON est renvoyé au tableau de bord.'],
    architecture:`flowchart LR
      UI[Client dashboard] --> R[API resource taches] --> C[TacheController] --> M[Tache Eloquent] --> DB[(taches)]
      C --> J[JSON] --> UI`,
    sources:['routes/api.php','app/Http/Controllers/TacheController.php','app/Models/Tache.php','database/migrations'],
  },
  promessenger: {
    purpose:'ProMessenger est un socle Laravel de messagerie directe : comptes, profils, rôles, état de présence envisagé et relations entre expéditeur, destinataire et messages.',
    front:[['Socle web Breeze','Les vues Blade gèrent connexion, inscription, récupération d’accès et profil. Le dépôt amorce un parcours social mais ne contient pas de client de conversation terminé.']],
    back:[['Comptes et messages','Laravel Breeze et Sanctum fournissent le socle d’identité. La table messages relie sender_id et receiver_id aux utilisateurs; les relations de messages envoyés et reçus sont définies côté utilisateur.'],['Exploration Firebase','Un contrôleur de diagnostic teste une écriture Realtime Database; il ne constitue pas une synchronisation complète du chat.']],
    methods:['Authentification web Laravel','Relations expéditeur et destinataire','Schéma de messages directs','Exploration de Firebase côté serveur'],
    lifecycle:'Le modèle relationnel conserve les références des deux comptes et le contenu. Le transport temps réel et le cycle de conversation ne sont pas complets dans la source étudiée.',
    steps:['Le visiteur s’inscrit ou se connecte via Breeze.','La session lui donne accès aux vues de profil et au dashboard.','Les modèles représentent les comptes et relations de messages.','La migration messages conserve expéditeur, destinataire et contenu.','Le contrôleur Firebase explore séparément la connexion au service.'],
    architecture:`flowchart TB
      B[Pages Blade Breeze et profil] --> AUTH[Session Laravel et Sanctum]
      AUTH --> USER[Modèle User]
      USER --> U[(users)]
      USER --> SENT[Messages envoyés et reçus]
      SENT --> M[(messages : sender et receiver)]
      TEST[Contrôleur de diagnostic] --> FIRE[Firebase Realtime Database]`,
    sources:['resources/views/auth','routes/web.php','app/Models/User.php','app/Models/Message.php','app/Http/Controllers/FirebaseTestController.php'],
  },
  siggil: {
    purpose:'Siggil est un site e-commerce pour une marque de streetwear. Le produit associe découverte des collections, variantes, panier, commande, historique client et gestion administrative du catalogue.',
    front:[['Boutique','React Router relie accueil, catalogue, fiche produit, premium, panier, checkout et confirmation. Le CartContext utilise un reducer pour quantités, total et nombre d’articles; d’autres contexts suivent produits, favoris, identité et paiement.'],['Administration','Les pages admin et formulaires gèrent les produits, catégories et commandes. Les composants communs et transitions conservent l’identité de la marque entre boutique et gestion.']],
    back:[['Services Supabase','Les services produits, catégories et commandes isolent les requêtes. orderService écrit orders, lit une commande par order_id et met à jour son statut.'],['Modèle commercial','La commande conserve un instantané des articles, les coordonnées de livraison, le total et le mode de paiement choisi. Le choix d’un mode ne prouve pas à lui seul une capture automatique auprès du fournisseur.']],
    methods:['React Context et reducer pour le panier','Services typés par domaine','Variantes, quantités et totaux dérivés','Séparation boutique et administration','Statuts de commande et historique'],
    lifecycle:'Les quantités du panier et son total sont recalculés par le reducer. La commande capture ses articles et informations de livraison, puis évolue par statut dans orders; le client peut la retrouver par son identifiant public.',
    steps:['Le visiteur filtre le catalogue puis consulte une fiche produit.','Il choisit sa variante et ajoute une quantité au panier.','Le reducer fusionne ou ajoute la ligne et recalcule total et compteur.','Le checkout collecte identité, adresse, ville et mode de paiement choisi.','Le service crée une ligne orders contenant l’instantané des articles.','Le client reçoit la confirmation et peut consulter sa commande.','L’administration charge les commandes et met à jour leur statut de suivi.'],
    architecture:`flowchart TB
      subgraph F[Boutique React]
        CAT[Accueil, catalogue, produit et premium]
        CART[CartContext et reducer]
        CHECK[Checkout et confirmation]
        HISTORY[Historique client]
        CAT --> CART --> CHECK
      end
      ADMIN[Administration produits et commandes] --> SERVICES[Services produits, catégories et commandes]
      CHECK & HISTORY --> SERVICES
      SERVICES --> SB[Client Supabase et Auth]
      SB --> P[(Produits et catégories)]
      SB --> O[(orders et instantané des articles)]
      CART --> TOTAL[Quantités, compteur et total dérivés]`,
    sources:['README.md','src/contexts/CartContext.tsx','src/services/orderService.ts','src/services/productService.ts','src/pages/Checkout.tsx'],
  },
  opendevin: {
    purpose:'OpenHands est une plateforme d’agent IA pour le développement logiciel. Une consigne est traitée dans une conversation reliée à un dépôt et à un environnement de travail où l’agent peut utiliser les outils de code; les actions et leurs résultats restent visibles dans l’interface.',
    front:[['Conversation et outils','L’application React / TypeScript s’appuie sur React Router et Vite. Ses routes couvrent notamment la conversation, les paramètres du modèle, les intégrations, le terminal, le navigateur, les changements de fichiers et le plan de travail. Monaco affiche le code; xterm fournit le terminal dans l’interface.'],['API et flux en direct','Les appels REST créent ou consultent les conversations et leurs paramètres. Socket.IO transporte les actions et observations en temps réel. Le client transmet l’identifiant de conversation et le dernier événement reçu pour reprendre le flux après une coupure.'],['Adaptation du frontend','La configuration Vite définit l’alias de source, le mode SPA sans SSR et les proxys de développement vers les endpoints API, WebSocket et Socket.IO. Le serveur Python ne monte les fichiers de l’interface que lorsque le dossier compilé existe.']],
    back:[['Serveur FastAPI et Socket.IO','FastAPI assemble les routes de conversations, fichiers, Git, paramètres, secrets, sécurité, santé et API v1. L’application ASGI est enveloppée par Socket.IO; les connexions de conversation sont validées avant leur rattachement au gestionnaire de conversations.'],['Agent, actions et runtime','Le gestionnaire relie la conversation au flux d’événements et au runtime. Un registre sélectionne les environnements Docker / event stream, local, distant, Kubernetes ou CLI. L’agent émet des actions; l’environnement exécute les outils et renvoie des observations.'],['Métadonnées, tâches et événements','La migration Alembic crée notamment conversation_metadata, app_conversation_start_task et v1_remote_sandbox. Les métadonnées conservent l’utilisateur, le dépôt, la branche, le titre, les métriques de modèle et l’identifiant de sandbox; la tâche suit la création et l’état de démarrage. Les événements de la conversation passent par l’Event Store, séparé des métadonnées SQL.'],['Démarrage et packaging','Les adaptations locales rendent le montage du frontend conditionnel, ajoutent un réglage pour ignorer Alembic au démarrage et détectent une base déjà à la révision courante. La configuration Hatch inclut le paquet Python du CLI dans le wheel.']],
    methods:['Interface SPA React Router avec build Vite','Proxy de développement REST, WebSocket et Socket.IO','Contrats API et flux d’événements temps réel','Rejeu des événements à partir du dernier identifiant reçu','Abstraction de plusieurs runtimes et environnements isolés','Métadonnées SQL et événements de conversation séparés','Migrations Alembic et packaging Hatch du CLI'],
    lifecycle:'La création d’une conversation initialise une tâche de démarrage et associe un environnement d’exécution. Les métadonnées SQL conservent propriétaire, dépôt, branche, modèle, métriques et sandbox; l’Event Store conserve les actions et observations ordonnées. Socket.IO diffuse le flux à l’interface. À la reconnexion, le serveur relit les événements à partir du dernier identifiant reçu avant de rattacher le client à la conversation active.',
    steps:['L’utilisateur choisit un dépôt, formule une tâche et configure le modèle.','L’interface React envoie les paramètres et la demande de conversation à l’API FastAPI.','La création du runtime est suivie dans app_conversation_start_task; les métadonnées de conversation sont stockées dans conversation_metadata.','Le serveur sélectionne un runtime compatible et ouvre l’environnement de travail.','Le navigateur rejoint le flux Socket.IO avec l’identifiant de conversation et le dernier événement connu.','Le gestionnaire transmet les actions de l’utilisateur à la boucle de conversation et à l’agent.','Le runtime exécute les outils dans le dépôt et renvoie des observations.','Les actions et observations sont ajoutées à l’Event Store puis diffusées à l’interface.','Le terminal, les changements de fichiers et les états de l’agent se mettent à jour au fil du flux.','Après une reconnexion, le serveur rejoue les événements manquants puis rattache le client à la conversation active.'],
    architecture:`flowchart TB
      subgraph CLIENT[Interface de développement]
        UI[React / TypeScript · React Router]
        EDITOR[Monaco · fichiers et changements]
        TERMINAL[xterm · terminal]
        BROWSER[Onglet navigateur · plan · paramètres]
        UI --> EDITOR
        UI --> TERMINAL
        UI --> BROWSER
      end
      UI -->|REST| API[FastAPI · routes et services]
      UI <-->|Socket.IO · actions et événements| SIO[Socket.IO ASGI]
      API --> META[(conversation_metadata)]
      API --> TASK[(app_conversation_start_task)]
      API --> SANDBOX[(v1_remote_sandbox)]
      API --> MANAGER[Gestionnaire de conversations]
      SIO -->|validation, replay, rattachement| MANAGER
      MANAGER --> SELECTOR[Registre de runtimes]
      SELECTOR --> DOCKER[Docker / event stream]
      SELECTOR --> LOCAL[Local]
      SELECTOR --> REMOTE[Remote]
      SELECTOR --> K8S[Kubernetes]
      SELECTOR --> CLI[CLI]
      DOCKER & LOCAL & REMOTE & K8S & CLI --> AGENT[Agent et outils]
      AGENT -->|actions| EXEC[Exécution dans le workspace]
      EXEC -->|observations| EVENTS[Flux d’événements]
      EVENTS --> STORE[(Event Store par conversation)]
      EVENTS --> SIO
      STORE -->|replay depuis latest_event_id| SIO`,
    sequence:`sequenceDiagram
      actor Dev as Développeur
      participant UI as Interface React
      participant API as API FastAPI
      participant CM as Gestionnaire de conversations
      participant RT as Runtime
      participant AG as Agent
      participant ES as Event Store
      participant WS as Socket.IO
      Dev->>UI: Choisir un dépôt et formuler une tâche
      UI->>API: Créer la conversation et ses paramètres
      API->>CM: Enregistrer la demande de démarrage
      CM->>RT: Sélectionner et initialiser l’environnement
      RT-->>CM: Workspace prêt
      CM-->>API: Conversation initialisée
      API-->>UI: Identifiant et métadonnées de conversation
      UI->>WS: Connexion avec conversation_id et latest_event_id
      WS->>CM: Valider l’accès et rattacher le client
      Dev->>UI: Envoyer une instruction ou une action
      UI->>WS: Émettre l’action utilisateur
      WS->>CM: Transmettre à la conversation active
      CM->>AG: Lancer ou poursuivre le tour de l’agent
      AG->>RT: Exécuter les outils sur le workspace
      RT-->>AG: Résultat de l’outil / observation
      AG->>ES: Ajouter l’action et l’observation au flux
      ES-->>WS: Événements ordonnés de la conversation
      WS-->>UI: Mettre à jour terminal, fichiers et état de l’agent
      Note over UI,ES: Après une coupure, replay des événements depuis latest_event_id`,
    sources:['README.md','frontend/vite.config.ts','frontend/src/routes/conversation.tsx','frontend/src/routes/changes-tab.tsx','openhands/server/app.py','openhands/server/listen.py','openhands/server/listen_socket.py','openhands/server/routes/conversation.py','openhands/server/routes/manage_conversations.py','openhands/runtime/__init__.py','openhands/app_server/app_lifespan/alembic/versions/001.py','openhands/app_server/app_conversation/sql_app_conversation_info_service.py','openhands/app_server/app_conversation/sql_app_conversation_start_task_service.py','openhands-cli/pyproject.toml'],
  },
}
