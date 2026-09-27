# Guide d'Installation Complet

Ce guide vous accompagne pas à pas pour installer et configurer **Universelle Cellule Ariana** en local sur votre PC.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation de Node.js](#installation-de-nodejs)
3. [Installation de MySQL](#installation-de-mysql)
4. [Configuration du Backend](#configuration-du-backend)
5. [Configuration du Frontend](#configuration-du-frontend)
6. [Lancement de l'Application](#lancement-de-lapplication)
7. [Création du Premier Compte Admin](#création-du-premier-compte-admin)
8. [Dépannage](#dépannage)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

- **Système d'exploitation** : Windows 10/11, macOS, ou Linux
- **Espace disque** : Au moins 2 GB disponibles
- **Connexion Internet** : Pour télécharger les dépendances

---

## 📦 Installation de Node.js

### Windows

1. Téléchargez Node.js depuis [nodejs.org](https://nodejs.org/)
2. Choisissez la version **LTS** (Long Term Support)
3. Exécutez l'installateur et suivez les instructions
4. Vérifiez l'installation :

```cmd
node --version
npm --version
```

### macOS

```bash
# Avec Homebrew
brew install node

# Vérifier l'installation
node --version
npm --version
```

### Linux (Ubuntu/Debian)

```bash
# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

---

## 🗄️ Installation de MySQL

### Windows

1. Téléchargez MySQL depuis [mysql.com/downloads](https://dev.mysql.com/downloads/installer/)
2. Choisissez **MySQL Installer for Windows**
3. Sélectionnez **Developer Default** lors de l'installation
4. Définissez un mot de passe root (notez-le !)
5. Terminez l'installation

### macOS

```bash
# Avec Homebrew
brew install mysql

# Démarrer MySQL
brew services start mysql

# Sécuriser l'installation
mysql_secure_installation
```

### Linux (Ubuntu/Debian)

```bash
# Installer MySQL
sudo apt update
sudo apt install mysql-server

# Démarrer MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Sécuriser l'installation
sudo mysql_secure_installation
```

### Vérification de MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Dans le shell MySQL
mysql> SELECT VERSION();
mysql> EXIT;
```

---

## ⚙️ Configuration du Backend

### Étape 1 : Naviguer vers le dossier backend

```bash
cd universelle-ariana-standalone/backend
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cette commande va installer :
- Express.js (serveur web)
- Passport.js (authentification)
- bcryptjs (hachage de mots de passe)
- JWT (tokens sécurisés)
- Multer (upload de fichiers)
- MySQL2 (driver base de données)
- Et bien d'autres...

**Temps estimé** : 2-5 minutes selon votre connexion

### Étape 3 : Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer le fichier .env
# Windows: notepad .env
# macOS/Linux: nano .env
```

**Contenu du fichier `.env` à personnaliser** :

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL_ICI
DB_NAME=universelle_ariana

# JWT Configuration
JWT_SECRET=changez_cette_cle_secrete_par_une_chaine_aleatoire_de_32_caracteres_minimum
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Important** :
- Remplacez `VOTRE_MOT_DE_PASSE_MYSQL_ICI` par votre mot de passe MySQL root
- Générez une clé secrète aléatoire pour `JWT_SECRET` (minimum 32 caractères)

**Générer une clé JWT sécurisée** :

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou en ligne
# Visitez: https://randomkeygen.com/
```

### Étape 4 : Créer la base de données

```bash
# Lancer les migrations
npm run db:migrate
```

Cette commande va :
1. Créer la base de données `universelle_ariana`
2. Créer toutes les tables nécessaires
3. Configurer les index et relations

**Sortie attendue** :

```
📦 Connected to MySQL server
✅ Database 'universelle_ariana' created or already exists
🚀 Running migrations...

✅ Migration 1/7: Table 'users' created
✅ Migration 2/7: Table 'cases' created
✅ Migration 3/7: Table 'case_photos' created
✅ Migration 4/7: Table 'donations' created
✅ Migration 5/7: Table 'events' created
✅ Migration 6/7: Table 'case_views' created
✅ Migration 7/7: Table 'favorites' created

🎉 All migrations completed successfully!
```

### Étape 5 : (Optionnel) Ajouter des données de test

```bash
npm run db:seed
```

Cette commande va ajouter :
- 3 utilisateurs de test (admin, association, donateur)
- 6 cas sociaux variés
- 2 événements solidaires
- Quelques dons de test

**Comptes de test créés** :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@universelle.ma | admin123 |
| Association | association@test.ma | test123 |
| Donateur | donor@test.ma | test123 |

### Étape 6 : Démarrer le serveur backend

```bash
# Mode développement (avec auto-reload)
npm run dev

# Ou mode production
npm start
```

**Sortie attendue** :

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Universelle Cellule Ariana - Backend Server      ║
║                                                        ║
║   Environment: development                             ║
║   Port: 5000                                           ║
║   Database: Connected ✅                               ║
║                                                        ║
║   API: http://localhost:5000/api                       ║
║   Health: http://localhost:5000/api/health             ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

**Tester le backend** :

Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api/health
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-06T..."
}
```

---

## 🎨 Configuration du Frontend

### Étape 1 : Ouvrir un nouveau terminal

**Gardez le terminal du backend ouvert !**

Ouvrez un **nouveau terminal** pour le frontend.

### Étape 2 : Naviguer vers le dossier frontend

```bash
cd universelle-ariana-standalone/frontend
```

### Étape 3 : Installer les dépendances

```bash
npm install
```

Cette commande va installer :
- React (framework UI)
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Router (routing)
- Zustand (state management)
- Et bien d'autres...

**Temps estimé** : 2-5 minutes

### Étape 4 : (Optionnel) Configurer l'URL de l'API

Créez un fichier `.env` dans le dossier `frontend` :

```bash
# Créer le fichier .env
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Note** : Par défaut, le frontend utilise le proxy Vite, donc cette étape est optionnelle.

### Étape 5 : Démarrer le serveur frontend

```bash
npm run dev
```

**Sortie attendue** :

```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🚀 Lancement de l'Application

### Vérification finale

Vous devriez maintenant avoir **2 terminaux ouverts** :

1. **Terminal 1 (Backend)** : `http://localhost:5000`
2. **Terminal 2 (Frontend)** : `http://localhost:3000`

### Accéder à l'application

Ouvrez votre navigateur et allez sur :

```
http://localhost:3000
```

Vous devriez voir la page d'accueil de **Universelle Cellule Ariana** ! 🎉

---

## 👤 Création du Premier Compte Admin

### Option 1 : Utiliser les données de test

Si vous avez exécuté `npm run db:seed`, vous pouvez vous connecter avec :

- **Email** : `admin@universelle.ma`
- **Mot de passe** : `admin123`

### Option 2 : Créer un nouveau compte

1. Cliquez sur **"S'inscrire"**
2. Remplissez le formulaire :
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)
   - Rôle : **Association** ou **Donateur**
3. Cliquez sur **"Créer un compte"**

### Promouvoir un utilisateur en Admin (via MySQL)

```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la base de données
USE universelle_ariana;

# Promouvoir un utilisateur en admin
UPDATE users SET role = 'admin' WHERE email = 'votre@email.com';

# Vérifier
SELECT id, email, name, role FROM users;

# Quitter
EXIT;
```

---

## 🐛 Dépannage

### Problème 1 : "Cannot connect to database"

**Cause** : MySQL n'est pas démarré ou les credentials sont incorrects.

**Solution** :

```bash
# Vérifier le statut de MySQL
# Windows
net start MySQL80

# macOS
brew services list

# Linux
sudo systemctl status mysql

# Redémarrer MySQL si nécessaire
# Windows
net stop MySQL80
net start MySQL80

# macOS
brew services restart mysql

# Linux
sudo systemctl restart mysql
```

Vérifiez aussi votre fichier `.env` :
- `DB_USER` est correct (généralement `root`)
- `DB_PASSWORD` correspond à votre mot de passe MySQL
- `DB_HOST` est `localhost`
- `DB_PORT` est `3306`

### Problème 2 : "Port 5000 already in use"

**Cause** : Un autre processus utilise le port 5000.

**Solution** :

```bash
# Trouver le processus
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Tuer le processus
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>

# Ou changer le port dans .env
PORT=5001
```

### Problème 3 : "Module not found" ou erreurs d'import

**Cause** : Dépendances manquantes ou corrompues.

**Solution** :

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Si le problème persiste, vider le cache npm
npm cache clean --force
npm install
```

### Problème 4 : "Access denied for user 'root'@'localhost'"

**Cause** : Mot de passe MySQL incorrect.

**Solution** :

```bash
# Réinitialiser le mot de passe MySQL
# Se connecter sans mot de passe (si possible)
mysql -u root

# Dans MySQL
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau_mot_de_passe';
FLUSH PRIVILEGES;
EXIT;

# Mettre à jour .env avec le nouveau mot de passe
```

### Problème 5 : Page blanche ou erreur CORS

**Cause** : Le frontend ne peut pas communiquer avec le backend.

**Solution** :

1. Vérifiez que le backend est bien démarré sur `http://localhost:5000`
2. Vérifiez `ALLOWED_ORIGINS` dans le `.env` du backend
3. Videz le cache du navigateur (Ctrl+Shift+Del)
4. Essayez en navigation privée

### Problème 6 : "Cannot read property 'map' of undefined"

**Cause** : Données non chargées ou API non accessible.

**Solution** :

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs réseau (onglet Network)
3. Vérifiez que l'API répond : `http://localhost:5000/api/health`
4. Vérifiez les logs du backend dans le terminal

---

## ✅ Checklist de Vérification

Avant de contacter le support, vérifiez :

- [ ] Node.js est installé (`node --version`)
- [ ] MySQL est installé et démarré
- [ ] Les dépendances backend sont installées (`backend/node_modules` existe)
- [ ] Les dépendances frontend sont installées (`frontend/node_modules` existe)
- [ ] Le fichier `.env` est configuré correctement
- [ ] La base de données est créée (`npm run db:migrate` exécuté)
- [ ] Le backend est démarré et répond sur `http://localhost:5000/api/health`
- [ ] Le frontend est démarré sur `http://localhost:3000`
- [ ] Aucune erreur dans les terminaux backend et frontend

---

## 📞 Besoin d'aide ?

Si vous rencontrez toujours des problèmes :

1. **Consultez les logs** dans les terminaux backend et frontend
2. **Vérifiez la console du navigateur** (F12)
3. **Contactez le support** :
   - Email : universellecellulearianna@gmail.com
   - Téléphone : 95403001

---

## 🎉 Félicitations !

Vous avez installé avec succès **Universelle Cellule Ariana** !

**Prochaines étapes** :

1. Explorez l'interface utilisateur
2. Créez votre premier cas social
3. Testez les différents rôles (donateur, association, admin)
4. Consultez la [Documentation API](API.md)
5. Préparez le déploiement avec le [Guide de Déploiement](DEPLOYMENT.md)

---

**"Votre code peut changer des vies"** 💙
