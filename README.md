  
 sc config MongoDB start= auto
  sc start MongoDB
cd frontend
npm run build
npm start

http://localhost:5000/api/auth/login


cd backend 
npm run dev

npx ts-node-dev src/app.ts



src/
├── assets/                # Images, icônes, polices
├── components/            # Composants UI réutilisables
│   ├── common/            # Boutons, Inputs, Modals, Loaders
│   ├── layout/            # Header, Footer, Sidebars
│   └── profile/           # Composants liés aux profils
├── config/                # Constantes et configurations globales (API_URL, Roles)
├── context/               # Contexte React (AuthContext, ThemeContext)
├── features/              # Fonctionnalités métier
│   ├── admin/                # Composants et pages pour les admins
│   ├── auth/                 # Composants et pages pour l'authentification
│   ├── chat/                 # Composants et pages pour le chat
│   ├── dashboard/            # Composants et pages pour le tableau de bord
│   ├── mentorship/          # Composants et pages pour le mentorat
│   └── messages/            # Composants et pages pour les messages
├── hooks/                 # Custom Hooks (useAuth, useChat, etc.)
├── pages/                 # Pages de navigation (vue principale)
│    ├── Auth/                 # Pages d'authentification (Login, Register)
│   ├── Chat/                # Page de chat
│   ├── Dashboard/           # Page de tableau de bord
│   ├── Profile/             # Page de profil
│   └── Settings/            # Page de paramètres
├── providers/             # Fournisseurs React (ThemeProvider, AuthProvider, etc.)
├── services/              # Appels API centralisés (axios, apiClient, services métier)
├── store/                 # Zustand, Redux, ou tout autre store global
├── styles/                # Fichiers CSS globaux
├── types/                 # Typescript global types et interfaces
├── utils/                 # Fonctions utilitaires
├── App.tsx                # Composant principal
└── index.tsx              # Point d'entrée React








 src/
├── features/
│   └── matching/
│       ├── MatchMentorPage.tsx
│       ├── MentorCard.tsx
│       ├── MentorshipRequestForm.tsx
│       ├── MyMentorshipRequests.tsx
│       └── api.ts         ← Appels API pour envoyer/demander




src/
└── config/
    └── api.ts   ← axios.create({ baseURL })
