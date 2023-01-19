const bcrypt = require('bcrypt'); // ajout de 'bcrypt'

const jwt = require('jsonwebtoken'); // ajout du token

const User = require('../models/User'); // importation de la constante 'User'

// inscription de l'utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  // fonction de hachage :
        .then(hash => {                     // récupère le hash du mdp
            const user = new User({         // création d'un nouvel utilisateur depuis le modèle mongoose
            email: req.body.email,          // récupération de l'e-mail dans le body de la requête
            password: hash                  // enregistrement du mdp crypté
            });
            user.save()                 // enregistrement dans la base de données :
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // 500 : erreur serveur
};

// connexion de l'utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) 
        .then(user => { // récupérationde la valeur trouvée par la requête
            if (user === null) { // si la valeur est nulle :
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            else { // si la valeur n'est pas nulle :
               bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) { // si 'false', erreur d'authentification :
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign( // appel de la fonction sign de jsonwebtoken, qui encode le payload (les données)
                                { userId: user._id },   // objet userID
                                'RANDOM_TOKEN_SECRET',  // clée secrète pour l'encodage
                                { expiresIn: '24h' }    // temps d'expiration
                            )
                        });
                    }
                })
                .catch(error => res.status(500).json({ error }));  // 500 : erreur serveur
            }
        })
        .catch(error => res.status(500).json({ error })); // 500 : erreur serveur
};