const express = require('express'); // importe le module Express.js dans l'application

const app = express();  // crée une instance de l'application Express

app.use(express.json()); //  configure l'application pour utiliser le format JSON pour les données envoyées par les requêtes HTTP

// ajout des routers
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const likesRoutes = require('./routes/likes');

const path = require('path'); // importe le module path, qui fournit des fonctions pour travailler avec les chemins dans le système de fichiers

require("dotenv").config({ path: "./config/.env" }); // importe le module dotenv pour lire les variables d'environnement du fichier .env dans le répertoire config

const mongoose = require('mongoose'); // importe le module Mongoose qui permet de travailler avec MongoDB en utilisant une interface orientée objet

mongoose.set('strictQuery', false); // suppression erreur 

// connexion à la base de données MongoDB en utilisant les informations d'authentification définies dans les variables d'environnement
mongoose.connect('mongodb+srv://' + process.env.MONGODB_USER_PASS + process.env.MONGODB_LINK,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// middleware général CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// définit le chemin du routeur 'saucesRoutes' (routeur général)
app.use('/api/sauces', saucesRoutes);

// définit le chemin du routeur 'likesRoutes'
app.use('/api/sauces', likesRoutes);

// définit le chemin du router 'userRoutes' 
app.use('/api/auth', userRoutes);

// définit le dossier 'images' pour le multer
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;