const fs = require('fs');

const Thing = require('../models/Thing'); // importation de la constante 'Thing'

exports.createThing = (req, res, next) => { // objet de la requête en chaine de caractère JSON
  const thingObject = JSON.parse(req.body.thing); // transforme en objet JS
  delete thingObject._id; // suppression de l'id car il sera généré par la base de données
  delete thingObject._userId; // suppression de l'UserId qui ne provient pas de la base de données
  const thing = new Thing({ // création de l'objet
      ...thingObject,
      userId: req.auth.userId, // récupéré via le middleware
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // génère l'url 
  });
  console.log(thing);

  thing.save() // enregistrement de l'objet dans la base de données
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ? { // vérifie s'il y à un champ file
    ...JSON.parse(req.body.thing), // parse la chaine de caractère JSON 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// génère l'url
  } : { ...req.body }; // sinon on récupère l'objet dans le body de la requête

  delete thingObject._userId; // suppression de l'userID pour eviter les fraudes d'id
  Thing.findOne({_id: req.params.id}) // cherche l'objet dans la base de données
    .then((thing) => { // si succès :
      if (thing.userId != req.auth.userId) { // récupère l'objet et vérifie que l'userId est != de l'userId du token
        res.status(401).json({ message : 'Not authorized'}); // 401 : erreur d'authentification
      } else {
        Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id}) // définit l'enregistrement à mettre à jour avec quel objet (le body de de notre fonction et l'id venant des params de l'url)
        .then(() => res.status(200).json({message : 'Objet modifié!'})) // si succès :
        .catch(error => res.status(401).json({ error })); // 401 : erreur d'authentification
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id}) // récupères l'objet en base de données
    .then(thing => { // si succès
      if (thing.userId != req.auth.userId) { // si l'userId correspond à l'userId du token
        res.status(401).json({message: 'Not authorized'}); // 401 : erreur d'authentification
      } else { // sinon
        const filename = thing.imageUrl.split('/images/')[1]; // récupère le nom du fichier
        fs.unlink(`images/${filename}`, () => { // méthode unlink de 'fs' pour supprimer le nom de fichier
          Thing.deleteOne({_id: req.params.id}) // suppression de l'objet dans la base de donnée
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
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
