const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token de l'utilisateur
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); // décodage du token et clé du token récupérée depuis le fichier .env
        const userId = decodedToken.userId; // récupération de l'userId 
        req.auth = { // transmission aux middleware/routeur
           userId: userId
        };
	next();
    } catch(error) {
        res.status(401).json({ error : "erreur d'authentification"});
    }
};