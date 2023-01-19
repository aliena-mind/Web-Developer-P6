const express = require('express');

const router = express.Router(); // ajout du router

const userCtrl = require('../controllers/user'); // ajout du controller userCtrl

// middleware POST, inscription de l'utilisateur
router.post('/auth/signup', userCtrl.signup);

// middleware POST, connexion de l'utilisateur
router.post('/auth/login', userCtrl.login);

module.exports = router;