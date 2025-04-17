# Utilisation de l'image Node.js
FROM node:18

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package.json package-lock.json ./
RUN npm install --production

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application en production
CMD ["npm", "start"]
