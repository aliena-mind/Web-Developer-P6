const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token de l'utilisateur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décodage du token
        const userId = decodedToken.userId; // récupération de l'userId
        req.auth = { // transmission aux middleware/routeur
           userId: userId
        };
	next();
    } catch(error) {
        res.status(401).json({ error });
    }
};