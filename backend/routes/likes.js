const express = require('express'); 

const router = express.Router(); // ajout du router

const auth = require('../middleware/auth'); // ajout du middleware 'auth'

const likesCtrl = require('../controllers/likes'); // ajout du controller saucesCtrl

// middleware POST, poste les like des publications sur la base de données
router.post('/:id/like', auth, likesCtrl.getLikes);

module.exports = router; 