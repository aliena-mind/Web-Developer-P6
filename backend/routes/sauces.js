const express = require('express'); 

const router = express.Router(); // ajout du router

const auth = require('../middleware/auth'); // ajout du middleware 'auth'

const multer = require('../middleware/multer-config');  // ajout du middleware 'multer'

const saucesCtrl = require('../controllers/sauces'); // ajout du controller saucesCtrl

// middleware GET, obtient la liste des sauces disponible sur la base de données
router.get('/', auth, saucesCtrl.getAllSauce);

// middleware POST, poste une nouvelle sauce sur la base de données
router.post('/', auth, multer, saucesCtrl.createThing);

// middleware GET, obtient les données de la sauce choisi disponible sur la base de données
router.get('/:id', auth, saucesCtrl.getOneThing);

// middleware PUT, modifie les données de la sauce choisi sur la base de données
router.put('/:id', auth, multer, saucesCtrl.modifyThing);

// middleware DELETE, supprime la sauce choisi de la base de données
router.delete('/:id', auth, saucesCtrl.deleteThing);

module.exports = router; 
