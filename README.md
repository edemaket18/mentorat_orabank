# Orabank Mentorat — Plateforme de mentorat

Application de gestion de mentorat en entreprise (Admin, RH, Mentor, Stagiaire), disponible sur web, Android et iOS (via Capacitor).

## Stack technique

- **Frontend** : React 18 + TypeScript (Create React App via `craco`), Tailwind CSS, PWA, Capacitor
- **Backend** : Node.js + Express + TypeScript, MongoDB (Mongoose), Socket.IO, JWT
- **Mobile** : Capacitor (Android/iOS) au-dessus du build web

## Prérequis

- Node.js 18+
- Une base MongoDB accessible (locale ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Installation

```bash
git clone https://github.com/edemaket18/mentorat_orabank.git
cd mentorat_orabank
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# éditez .env : au minimum MONGO_URI et JWT_SECRET (une vraie valeur aléatoire,
# jamais la valeur d'exemple, y compris en local)
```

Créer des comptes de test (un par rôle : admin, RH, mentor, stagiaire) :

```bash
npm run seed
```

Démarrer le serveur (par défaut sur `http://localhost:5001`) :

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

L'app s'ouvre sur `http://localhost:3000`. En développement, `REACT_APP_API_URL` est lue depuis `.env.development` (déjà configurée pour pointer vers `http://127.0.0.1:5001/api`).

### Comptes de test (après `npm run seed`)

Mot de passe identique pour les quatre : `Password123!`

| Rôle | Email |
|---|---|
| Admin | admin@orabank.test |
| RH | rh@orabank.test |
| Mentor | mentor@orabank.test |
| Stagiaire | stagiaire@orabank.test |

## Docker (backend + MongoDB)

```bash
echo "JWT_SECRET=$(openssl rand -hex 64)" > .env
docker compose up --build
```

Le backend est alors accessible sur `http://localhost:5001`, MongoDB sur le port `27017`. Le frontend n'est pas conteneurisé pour l'instant (`npm start` en local).

## Build mobile (Capacitor)

```bash
cd frontend
npm run build
npx cap add android      # génère le projet Android
npx cap add ios          # génère le projet iOS (nécessite un Mac)
npx cap sync
npx cap open android     # ouvre Android Studio
npx cap open ios         # ouvre Xcode
```

Pensez à définir `REACT_APP_API_URL` dans `.env.production` avec l'URL réelle du backend déployé avant de builder pour mobile — `localhost` ne fonctionne pas depuis un téléphone.

## Tests

```bash
# Frontend
cd frontend && npm test

# Backend : aucun test automatisé pour l'instant (à écrire)
```

## Documentation API

Une fois le backend démarré, la documentation Swagger est disponible sur `http://localhost:5001/api-docs`.

## Structure du projet

```
backend/
  src/
    controllers/    # logique métier par ressource
    models/         # schémas Mongoose
    routes/         # définition des routes Express
    middlewares/    # auth, gestion d'erreurs, validation
    scripts/        # scripts utilitaires (seed...)
frontend/
  src/
    pages/          # une page par route, organisées par rôle (Admin/hr/mentor/intern)
    features/       # composants métier réutilisables (cartes, chat...)
    components/     # composants UI génériques (boutons, layout...)
    api/            # clients HTTP par domaine (auth, contract, mentor...)
    layouts/        # shell applicatif (topbar + sidebar par rôle)
    context/        # contexte d'authentification
```

## État du projet / limites connues

- Aucun test automatisé côté backend.
- Certaines fonctionnalités (recherche de mentor par expertise, système d'attestations) sont partiellement entamées mais non branchées à l'interface.
- Pas encore de rate-limiting par utilisateur authentifié (seulement par IP).