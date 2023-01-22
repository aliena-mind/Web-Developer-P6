const fs = require('fs');

const Sauce = require('../models/Sauce'); // importation de la constante 'Sauce'

exports.getLikes = (req, res, next) => {
    
    // console.log('je suis dans le controllers like');

    // récupération du body de la requête
    // console.log('contenu req.body likeCtrl');
    // console.log(req.body);

    // récupération de l'id dans l'url de la requête :
    // console.log('contenu req.params likeCtrl');
    // console.log(req.params);

    // mise au format de 'id' vers '_id' pour le récuperer dans la base de données
    // console.log('contenu req.params likeCtrl');
    // console.log({_id : req.params.id});

    Sauce.findOne({ // récupère l'id dans les paramètres de recherche et cherche l'id correspondant dans la base de données
        _id: req.params.id 
    })
    .then((sauce) => { // si succès :
        
        // console.log('contenu résultat promesse likeCtrl');
        // console.log({sauce});

        // console.log('req.auth.userId likeCtrl');
        // console.log(req.auth.userId);

        // console.log('contenu résultat promesse likeCtrl');
        // console.log(req.body.like);

        // like : +1, si le 'userLiked' (base de données) est false, et que le like est === 1 (requête)
        if(!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1){  
            
            // maj base de données
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc : {likes : 1}, // modification du champ 'likes' de la 'sauce' de la base de données avec $inc
                    $push : {usersLiked : req.auth.userId} // ajoute l'userId au tableau usersLiked
                }
            )
            .then(res.status(201).json({ message : "likes : +1, userId : +1"}))
            .catch((error) => res.status(400).json({error}));
        }

        // (après like : +1) like : =0, si le 'userLiked' (base de données) est true, et que le like est === 0 (requête)
        else if(sauce.usersLiked.includes(req.auth.userId) && req.body.like === 0){  
            
            // maj base de données
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc : {likes : -1}, // modification du champ 'likes' de la 'sauce' de la base de données avec $inc
                    $pull : {usersLiked : req.auth.userId} // retire l'userId du tableau 'usersLiked'
                }
            )
            .then(res.status(201).json({ message : "likes : -1, userId : -1"}))
            .catch((error) => res.status(400).json({error}));
        }

        // like : -1, si le 'userDisliked' (base de données) est false, et que le like est === -1 (requête)
        else if(!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1){  
            
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc : {dislikes : 1}, // modification du champ 'dislikes' de la 'sauce' de la base de données avec $inc
                    $push : {usersDisliked : req.auth.userId} // ajoute l'userId au tableau 'usersDisliked'
                }
            )
            .then(res.status(201).json({ message : "dilikes : +1, userId : +1"}))
            .catch((error) => res.status(400).json({error}));
        }

        // (après like : -1), like : =0, si le 'userDisliked' (base de données) est true, et que le like est === 1 (requête)
        else if(sauce.usersDisliked.includes(req.auth.userId) && req.body.like === 0){  
            
            Sauce.updateOne(
                {_id : req.params.id},
                {
                    $inc : {dislikes : -1}, // modification du champ 'dislikes' de la 'sauce' de la base de données avec $inc
                    $pull : {usersDisliked : req.auth.userId} // retire l'userId du tableau 'usersDisliked'
                }
            )
            .then(res.status(201).json({ message : "dislikes : -1, userId : -1"}))
            .catch((error) => res.status(400).json({error}));
        }
    })
    .catch((error) => res.status(404).json({error}));
};