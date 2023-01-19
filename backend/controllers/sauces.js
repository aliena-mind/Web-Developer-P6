const fs = require('fs');

const Sauce = require('../models/Sauce'); // importation de la constante 'Sauce'

exports.createSauce = (req, res, next) => { // objet de la requête en chaine de caractère JSON
  const sauceObject = JSON.parse(req.body.sauce); // transforme en objet JS
  delete sauceObject._id; // suppression de l'id car il sera généré par la base de données
  delete sauceObject._userId; // suppression de l'UserId qui ne provient pas de la base de données
  const sauce = new Sauce({ // création de l'objet
      ...sauceObject,
      userId: req.auth.userId, // récupéré via le middleware
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // génère l'url 
  });
  console.log(sauce);

  sauce.save() // enregistrement de l'objet dans la base de données
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { // vérifie s'il y à un champ file
    ...JSON.parse(req.body.sauce), // parse la chaine de caractère JSON 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// génère l'url
  } : { ...req.body }; // sinon on récupère l'objet dans le body de la requête

  delete sauceObject._userId; // suppression de l'userID pour eviter les fraudes d'id
  Sauce.findOne({_id: req.params.id}) // cherche l'objet dans la base de données
    .then((sauce) => { // si succès :
      if (sauce.userId != req.auth.userId) { // récupère l'objet et vérifie que l'userId est != de l'userId du token
        res.status(401).json({ message : 'Not authorized'}); // 401 : erreur d'authentification
      } else {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // définit l'enregistrement à mettre à jour avec quel objet (le body de de notre fonction et l'id venant des params de l'url)
        .then(() => res.status(200).json({message : 'Objet modifié!'})) // si succès :
        .catch(error => res.status(401).json({ error })); // 401 : erreur d'authentification
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}) // récupères l'objet en base de données
    .then(sauce => { // si succès
      if (sauce.userId != req.auth.userId) { // si l'userId correspond à l'userId du token
        res.status(401).json({message: 'Not authorized'}); // 401 : erreur d'authentification
      } else { // sinon
        const filename = sauce.imageUrl.split('/images/')[1]; // récupère le nom du fichier
        fs.unlink(`images/${filename}`, () => { // méthode unlink de 'fs' pour supprimer le nom de fichier
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

exports.getAllSauce = (req, res, next) => {
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
