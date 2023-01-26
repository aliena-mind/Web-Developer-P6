const fs = require('fs');

const Sauce = require('../models/Sauce'); // importation de la constante 'Sauce'

exports.createSauce = (req, res, next) => { // objet de la requête en chaine de caractère JSON
  
  const sauceObject = JSON.parse(req.body.sauce); // transforme en objet JS
  
  const sauce = new Sauce({ // création de l'objet
    ...sauceObject,
    userId: req.auth.userId, // récupéré via le middleware auth
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// génère l'url 
  });
 
  sauce.save() // enregistrement de l'objet dans la base de données
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => { // obtenir une sauce depuis la base de données
  Sauce.findOne({ 
    _id: req.params.id // récupère l'id dans les paramètres de recherche et cherche l'id correspondant dans la base de données
  })
  .then( // si succès :
    (sauce) => {
      res.status(200).json(sauce);
    }
  )
  .catch( // si echec :
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => { // modifier une sauce stockée sur la base de données
  const sauceObject = req.file ? {                    // vérifie s'il y à un champ file
    ...JSON.parse(req.body.sauce),                    // parse la chaine de caractère JSON 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // génère l'url
  } : { ...req.body }; // sinon on récupère l'objet dans le body de la requête

  Sauce.findOne({_id: req.params.id}) // cherche l'objet dans la base de données
    .then((sauce) => { // si succès :
      if (sauce.userId != req.auth.userId) { // récupère l'objet et vérifie que l'userId est != de l'userId du token
        res.status(401).json({ message : 'Not authorized'}); // 401 : erreur d'authentification
      } else {

        // console.log('req.file');
        // console.log(req.file);

        if (req.file !== undefined) { // si il y a un fichier 'image' : 

          const filename = sauce.imageUrl.split('/images/')[1]; // récupère le nom du fichier
          fs.unlink(`images/${filename}`, () => { // méthode unlink de 'fs' pour supprimer le fichier de l'image précédente stockée par le multer
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // définit l'enregistrement à mettre à jour avec quel objet (le body de de notre fonction et l'id venant des params de l'url)
            .then(() => res.status(200).json({message : 'Objet modifié!'})) // si succès :
            .catch(error => res.status(401).json({ error })); // 401 : erreur d'authentification
          });
        }
        else if (req.file == undefined) { // si il n'y a pas de fichier 'image' :
          
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // définit l'enregistrement à mettre à jour avec quel objet (le body de de notre fonction et l'id venant des params de l'url)
          .then(() => res.status(200).json({message : 'Objet modifié!'})) // si succès :
          .catch(error => res.status(401).json({ error })); // 401 : erreur d'authentification
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => { // supprimer une sauce stockée sur la base de données
  Sauce.findOne({ _id: req.params.id}) // récupères l'objet en base de données
    .then(sauce => { // si succès
      if (sauce.userId != req.auth.userId) { // si l'userId correspond à l'userId du token
        res.status(401).json({message: 'Not authorized'}); // 401 : erreur d'authentification
      } else { // sinon
        const filename = sauce.imageUrl.split('/images/')[1]; // récupère le nom du fichier
        fs.unlink(`images/${filename}`, () => { // méthode unlink de 'fs' pour supprimer l'image stockée par le multer
          Sauce.deleteOne({_id: req.params.id}) // suppression de l'objet dans la base de donnée
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch( error => {
      res.status(500).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => { // obtenir toutes les sauces disponible sur la base de données
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
