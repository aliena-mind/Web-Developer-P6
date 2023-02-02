const express = require('express');

const router = express.Router(); // ajout du router

const loginLimiter = require('../middleware/rate-limiter'); // ajout du limiteur de connexion

const userCtrl = require('../controllers/user'); // ajout du controller userCtrl

// middleware POST, inscription de l'utilisateur
router.post('/signup', userCtrl.signup);

// middleware POST, connexion de l'utilisateur
router.post('/login', loginLimiter, userCtrl.login);

module.exports = router;