# Documentation Projet Frontend (Structure et Organisation)

## ✨ Objectif du Projet

Cette application frontend est conçue pour gérer des profils, des messageries, des tableaux de bord et des systèmes d'authentification pour une plateforme de mentorat ou de gestion d'étudiants.

---

## 🔹 Structure Globale des Dossiers

```
src/
├── assets/          # Images, icônes, polices, etc.
├── components/      # Composants UI réutilisables (Boutons, Layouts, Profils)
├── config/          # Constantes et configurations globales (ex: URL API)
├── context/         # Contextes React globaux (AuthContext, etc.)
├── features/        # Fonctionnalités métier (auth, admin, chat, etc.)
├── hooks/           # Hooks personnalisés (useAuth, useSocket, etc.)
├── pages/           # Pages React représentant les vues principales
│   ├── Auth/
│   ├── Dashboard/
│   ├── Profile/
│   └── Settings/
├── providers/       # Fournisseurs React globaux (WebSocketProvider, etc.)
├── services/        # Appels API et logique métier
├── store/           # Store global (Zustand, Redux ou autre)
├── styles/          # Styles globaux (CSS, SCSS)
├── types/           # Types TypeScript globaux
├── utils/           # Fonctions utilitaires
├── App.tsx          # Composant principal
└── index.tsx        # Point d'entrée React
```

---

## 🔍 Détails par Dossier

### 1. `assets/`

Stocke toutes les ressources statiques (images, logos, icônes).

### 2. `components/`

Contient les composants UI réutilisables comme :

* Boutons
* Modals
* Layouts (Header, Sidebar)
* Cartes de profil

### 3. `features/`

Chaque fonctionnalité métier est isolée :

* `auth/` : Connexion, Inscription, Authentification
* `chat/` : Messagerie, Chat temps réel
* `dashboard/` : Statistiques, Suivi RH
* `mentorship/` : Gestion de mentorat

Chaque feature peut avoir ses propres :

* Composants spécifiques
* Hooks
* Services API
* Stores locaux

### 4. `pages/`

Contient les pages principales affichées dans le routeur (React Router).

### 5. `services/`

Centralisation de tous les appels API (éventuellement avec Axios).

### 6. `hooks/`

Tous les hooks React personnalisés et réutilisables.

### 7. `context/` et `providers/`

Gèrent les contextes React (ex: Auth, Thème) et leurs fournisseurs globaux.

### 8. `store/`

Pour la gestion d'état globale (Zustand ou Redux).

### 9. `styles/`

CSS global, theming ou framework CSS (ex: Tailwind).

### 10. `types/`

Interfaces et types TypeScript globaux.

### 11. `utils/`

Fonctions utilitaires (formatage de date, helpers).

---

## 🌐 Bonnes Pratiques

* Chaque **feature** est autonome : composants + hooks + services dans un même dossier.
* Les composants réutilisables ne doivent pas contenir de logique métier.
* Centraliser tous les appels API dans `services/`.
* Utiliser des hooks personnalisés pour la logique réutilisable.
* Préfixer les noms des contextes et stores pour éviter les collisions.

---

 

 | Page              | URL                | Description                                                               |
| ----------------- | ------------------ | ------------------------------------------------------------------------- |
| Dashboard         | `/admin/dashboard` | Vue d’ensemble des stats (stagiaires, mentors, sessions actives, alertes) |
| Utilisateurs      | `/admin/users`     | Liste des comptes (stagiaires, mentors, RH). CRUD + rôle attribuable      |
| Reporting global  | `/admin/reports`   | Export global des rapports de stage ou activité                           |
| Gestion des rôles | `/admin/roles`     | Attribution de rôles et permissions (si système RBAC avancé)              |



| Page                | URL                 | Description                                                  |
| ------------------- | ------------------- | ------------------------------------------------------------ |
| Dashboard           | `/mentor/dashboard` | Vue d’ensemble de ses stagiaires, sessions à venir, messages |
| Matching            | `/mentor/matching`  | Page pour accepter/refuser des stagiaires proposés           |
| Profil              | `/mentor/profile`   | Modifier ses infos personnelles, expertise, bio              |
| Sessions / Mentorat | `/mentor/sessions`  | Calendrier ou historique des séances de mentorat             |
| Messages            | `/mentor/messages`  | Messagerie privée avec ses stagiaires                        |




| Page                | URL                 | Description                                                |
| ------------------- | ------------------- | ---------------------------------------------------------- |
| Dashboard           | `/intern/dashboard` | Vue des mentors associés, progrès, prochaines sessions     |
| Matching            | `/intern/matching`  | Explorer les mentors disponibles, candidater               |
| Profil              | `/intern/profile`   | Modifier ses infos, filière, objectifs                     |
| Rapport de stage    | `/intern/reporting` | Générateur de rapport auto (formulaire, export PDF, suivi) |
| Sessions / Mentorat | `/intern/sessions`  | Liste ou calendrier des séances prévues                    |
| Messages            | `/intern/messages`  | Contacter un mentor ou RH                                  |


| Page                    | URL             | Description                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------- |
| Dashboard RH            | `/hr/dashboard` | Vue d’ensemble des stagiaires en entreprise, activité globale |
| Matching                | `/hr/matching`  | Gestion du matching mentor/stagiaire (approbation côté RH)    |
| Suivi des stagiaires    | `/hr/interns`   | Liste des stagiaires par service, supervision                 |
| Rapports des stagiaires | `/hr/reports`   | Lire/télécharger les rapports, notifier les stagiaires        |
| Messages                | `/hr/messages`  | Contacter un stagiaire ou un mentor                           |



/messages (Messagerie interne temps réel via WebSocket ou Livewire-like)

/notifications (Notifications globales : nouveau mentor, session planifiée…)

/settings (Compte, sécurité, préférences pour tous)




Ensuite tu peux tester les routes suivantes :

http://localhost:5001/ → Accueil

http://localhost:5001/login → Connexion

http://localhost:5173/register → Inscription

http://localhost:5173/rh/matching → Matching RH

http://localhost:5173/rh/reports → Rapports RH

etc.







import { Mentorship } from '@api/mentorship.api';


générer du code de ce  fichier 