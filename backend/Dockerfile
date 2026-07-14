# Utiliser une image Node.js officielle comme base
FROM node:18-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances de production et de développement (pour la compilation TS)
RUN npm install

# Copier le reste du code source de l'application
COPY . .

# Compiler TypeScript en JavaScript
RUN npm run build
# 'build' doit être défini dans votre package.json, ex: "build": "tsc"

# --- Image de Production ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier uniquement les dépendances de production depuis l'image builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copier les fichiers compilés depuis l'image builder
COPY --from=builder /usr/src/app/dist ./dist
# Copier package.json pour que 'npm start' fonctionne
COPY package.json .
# Copier le fichier .env.example pour référence, mais les vraies variables d'env seront injectées
COPY .env.example .

# Exposer le port sur lequel l'application tourne
EXPOSE 5000

# Commande pour démarrer l'application
CMD [ "npm", "start" ]
# 'start' doit être défini dans votre package.json, ex: "start": "node dist/server.js"
