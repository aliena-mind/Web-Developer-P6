const express = require('express'); // ajout d'express

const app = express();

app.use(express.json()); 

// ajout des routers
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const likesRoutes = require('./routes/likes');

const path = require('path');

const mongoose = require('mongoose'); // ajout de mongoose

mongoose.set('strictQuery', false); // suppression erreur console

// connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://aliena-mind:12345@p6.aqzokxo.mongodb.net/?retryWrites=true&w=majority',
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

// 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;