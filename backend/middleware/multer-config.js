// enregistres les images arrivant depuis le frontend dans le dossier 'images'

const multer = require('multer'); // ajout de multer

// dictionnaire de 'MIME_TYPES':
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// objet de configuration pour multer :
const storage = multer.diskStorage({ // fonction permettant de stocker sur le disque
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // fonction pour généré le nouveau nom du fichier
        const name = file.originalname.split(' ').join('_'); // utilisation du nom d'origine en remplaçant les ' ' par des '_'
        const extension = MIME_TYPES[file.mimetype]; // définit l'extention en fonction du 'MIME_TYPES'
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image'); // exportation du middleware