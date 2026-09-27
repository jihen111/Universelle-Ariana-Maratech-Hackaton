# Universelle Cellule Ariana - Standalone Version

**Plateforme Numérique Solidaire pour Maratech 2026**  
Version standalone complètement indépendante - Exécution 100% locale

---

## 🎯 Vue d'ensemble

Cette version standalone de **Universelle Cellule Ariana** est une plateforme complète qui peut fonctionner entièrement en local sur votre PC, sans aucune dépendance à des services cloud externes.

### Caractéristiques principales

✅ **Authentification locale** avec email/password (Passport.js + JWT + bcrypt)  
✅ **Base de données MySQL locale** avec migrations automatiques  
✅ **Upload de fichiers local** avec Multer (pas de S3)  
✅ **API REST complète** avec Express.js  
✅ **Frontend moderne** avec React + Vite + Tailwind CSS  
✅ **UI améliorée** avec design professionnel et responsive  
✅ **Système d'accessibilité** complet (WCAG AAA)  
✅ **Documentation complète** pour installation et déploiement  

---

## 📁 Structure du Projet

```
universelle-ariana-standalone/
│
├── backend/                 # Backend Express.js
│   ├── src/
│   │   ├── config/         # Configuration (DB, Passport, Multer)
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Middlewares (auth, validation)
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── database/       # Migrations et seeds
│   │   └── server.js       # Point d'entrée
│   ├── uploads/            # Fichiers uploadés localement
│   ├── package.json
│   └── env.example         # Variables d'environnement
│
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Appels API (Axios)
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── contexts/       # Contextes React
│   │   ├── stores/         # State management (Zustand)
│   │   └── utils/          # Utilitaires
│   ├── package.json
│   └── vite.config.js
│
├── database/                # Scripts base de données
│   └── schema.sql
│
├── docs/                    # Documentation
│   ├── INSTALLATION.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
└── README.md                # Ce fichier
```

---

## 🚀 Installation Rapide

### Prérequis

- **Node.js** >= 18.0.0
- **MySQL** >= 8.0
- **pnpm** ou **npm**

### Étape 1 : Cloner le projet

```bash
cd universelle-ariana-standalone
```

### Étape 2 : Configurer le backend

```bash
cd backend
npm install

# Copier et configurer les variables d'environnement
cp env.example .env
# Éditez .env avec vos paramètres MySQL
```

### Étape 3 : Créer la base de données

```bash
# Lancer les migrations
npm run db:migrate

# (Optionnel) Ajouter des données de test
npm run db:seed
```

### Étape 4 : Démarrer le backend

```bash
npm run dev
# Backend accessible sur http://localhost:5000
```

### Étape 5 : Configurer le frontend

```bash
cd ../frontend
npm install
```

### Étape 6 : Démarrer le frontend

```bash
npm run dev
# Frontend accessible sur http://localhost:3000
```

---

## 🔧 Configuration

### Variables d'environnement Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=universelle_ariana

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Variables d'environnement Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Documentation

- **[Guide d'installation complet](docs/INSTALLATION.md)** - Installation détaillée pas à pas
- **[Documentation API](docs/API.md)** - Tous les endpoints disponibles
- **[Guide de déploiement](docs/DEPLOYMENT.md)** - Déployer en production

---

## 🎨 Fonctionnalités

### Authentification
- ✅ Inscription avec email/password
- ✅ Connexion sécurisée avec JWT
- ✅ Gestion de profil
- ✅ Changement de mot de passe
- ✅ Protection des routes par rôle (donor, association, admin)

### Gestion des Cas Sociaux
- ✅ Création de cas avec upload de photos
- ✅ Filtrage par catégorie
- ✅ Recherche par mots-clés
- ✅ Marquage urgent
- ✅ Statistiques de vues
- ✅ Progression des dons

### Dons
- ✅ Enregistrement des dons
- ✅ Historique personnel
- ✅ Dons anonymes
- ✅ Messages aux associations

### Événements
- ✅ Création d'événements solidaires
- ✅ Upload d'image
- ✅ Gestion par associations

### Accessibilité
- ✅ Mode sombre/clair
- ✅ Taille de police ajustable
- ✅ Navigation au clavier
- ✅ ARIA labels
- ✅ Contraste WCAG AAA

---

## 🛠️ Technologies Utilisées

### Backend
- **Express.js** 4.18 - Framework web
- **Passport.js** - Authentification
- **JWT** - Tokens sécurisés
- **bcrypt** - Hachage de mots de passe
- **Multer** - Upload de fichiers
- **MySQL2** - Base de données
- **express-validator** - Validation

### Frontend
- **React** 18.2 - Framework UI
- **Vite** 5.0 - Build tool
- **Tailwind CSS** 3.3 - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Router** 6.20 - Routing
- **React Hook Form** - Formulaires
- **Lucide React** - Icônes

---

## 📖 Guide d'utilisation

### Pour les Donateurs

1. **S'inscrire** avec un compte donateur
2. **Explorer les cas** sociaux par catégorie
3. **Consulter les détails** et photos
4. **Cliquer sur "Soutenir"** pour être redirigé vers Cha9a9a
5. **Suivre l'historique** de vos dons

### Pour les Associations

1. **S'inscrire** avec un compte association
2. **Créer des cas sociaux** avec photos
3. **Gérer vos cas** (modifier, supprimer)
4. **Créer des événements** solidaires
5. **Consulter les statistiques** de vos cas

### Pour les Administrateurs

1. **Modérer les cas** (approuver/rejeter)
2. **Gérer les utilisateurs**
3. **Consulter les statistiques globales**
4. **Superviser les événements**

---

## 🔒 Sécurité

- ✅ Mots de passe hachés avec bcrypt (salt rounds: 10)
- ✅ Tokens JWT avec expiration configurable
- ✅ Protection CSRF avec Helmet
- ✅ Rate limiting sur les endpoints API
- ✅ Validation des entrées avec express-validator
- ✅ Protection des routes par rôle
- ✅ CORS configuré

---

## 🚢 Déploiement

### Option 1 : Serveur VPS (Recommandé)

1. Installer Node.js et MySQL sur le serveur
2. Cloner le projet
3. Configurer les variables d'environnement
4. Build le frontend : `npm run build`
5. Utiliser PM2 pour le backend : `pm2 start src/server.js`
6. Configurer Nginx comme reverse proxy

### Option 2 : Docker

```bash
# À venir - Docker Compose configuration
```

### Option 3 : Hébergement Cloud

- **Backend** : Heroku, DigitalOcean, AWS EC2
- **Frontend** : Vercel, Netlify, Cloudflare Pages
- **Base de données** : PlanetScale, AWS RDS, DigitalOcean Managed DB

---

## 🐛 Dépannage

### Problème : "Cannot connect to database"

**Solution** : Vérifiez que MySQL est démarré et que les credentials dans `.env` sont corrects.

```bash
# Vérifier le statut MySQL
sudo systemctl status mysql

# Redémarrer MySQL
sudo systemctl restart mysql
```

### Problème : "Port 5000 already in use"

**Solution** : Changez le port dans `.env` ou arrêtez le processus utilisant le port 5000.

```bash
# Trouver le processus
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### Problème : "Module not found"

**Solution** : Réinstallez les dépendances.

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

**Association UniVersElle Ariana**  
Email: universellecellulearianna@gmail.com  
Téléphone: 95403001

---

## 📄 Licence

MIT License - Projet développé pour Maratech 2026

---

## 🙏 Remerciements

- **ESPRIT** - École Supérieure Privée d'Ingénierie et de Technologies
- **Association UniVersElle Ariana** - Fatma Taghouti
- **Maratech 2026** - Hackathon organisateur

---

**"Votre code peut changer des vies"** 💙

© 2026 Universelle Cellule Ariana - Version Standalone
