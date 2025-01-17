'use strict';

const sqlite3 = require('sqlite3').verbose();

var utils = require('../utils/writer.js');
var Boat = require('../service/BoatService');

// Connexion à la base de données SQLite
const database = new sqlite3.Database('./fisher-fans.db', (err) => {
  if (err) {
      console.error('Erreur lors de la connexion à la base de données :', err.message);
  } else {
      console.log('Connexion réussie à la base de données SQLite.');
  }
});

module.exports.boatDatas = function boatDatas(req, res) {
  const query = 'SELECT * FROM boat'; // Requête SQL pour récupérer les données

  database.all(query, [], (err, rows) => {
      if (err) {
          console.error('Erreur lors de la récupération des données des bateaux :', err.message);
          res.status(500).send('Erreur interne du serveur.');
      } else {
          console.log('Données des bateaux récupérées avec succès.');
          res.status(200).json(rows); // Retourne les données sous forme de JSON
      }
  });
};

/**
 * Fonction pour créer un bateau
 */

module.exports.createBoat = function createBoat(req, res) {
  const { name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id } = req.body;

  // Validation des données
  if (!name || !brand || !productionYear || !licenceType || !type || !cautionAmount || !capacityMax || !bedsNumber || !homePort || !latitude1 || !longitude1 || !latitude2 || !longitude2 || !engineType || !enginePower || !user_id) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  const query = `
    INSERT INTO boat (name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id];

  database.run(query, values, function(err) {
    console.log(req.body)
    if (err) {
      console.error('Erreur lors de la création du bateau :', err.message);
      res.status(500).send('Erreur interne du serveur.');
    } else {
      console.log('Bateau créé avec succès.');
      res.status(201).json({ id: this.lastID, message: 'Bateau créé avec succès.' });
    }
  });
}

 // Fonction pour supprimer un bateau

 module.exports.deleteBoat = (req, res, next) => {
  const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête
  
  Boat.deleteBoat(id)
    .then(response => {
      // Réponse réussie : renvoyer la réponse dans le format JSON
      utils.writeJson(res, response);
    })
    .catch(error => {
      // En cas d'erreur : renvoyer l'erreur dans le format JSON
      utils.writeJson(res, error);
    });
};

// module.exports.deleteBoat = function deleteBoat (req, res, next, id) {
//   Boat.deleteBoat(id)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

/**
 * Fonction qui tient compte de la latitude et de la longitude pour obtenir les bateaux
 */
module.exports.getBoatsBetweenLatitudeAndLongitude = function getBoatsBetweenLatitudeAndLongitude (
  req, 
  res, 
  next, 
  latitude, 
  longitude
) {
  Boat.getBoatsBetweenLatitudeAndLongitude(latitude, longitude)
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};

/**
 * Fonction pour mettre à jour les données d'un bateau
 */
module.exports.updateBoat = function updateBoat (
  req, 
  res, 
  next, 
  id, 
  name, 
  description, 
  brand, 
  productionYear, 
  urlBoatPicture, 
  licenseType, 
  type, 
  equipements, 
  cautionAmount, 
  capacityMax, 
  bedsNumber, 
  homePort, 
  latitude, 
  longitude, 
  egineType, 
  eginePower
) {
  Boat.updateBoat(
    id, 
    name, 
    description, 
    brand, 
    productionYear, 
    urlBoatPicture, 
    licenseType, 
    type, 
    equipements, 
    cautionAmount, 
    capacityMax, 
    bedsNumber, 
    homePort, 
    latitude, 
    longitude, 
    egineType, 
    eginePower
  )
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};

/**
 * Fonction pour mettre à jour les données d'un bateau 
 */
module.exports.updateBoatById = function updateBoatById (
  req, 
  res, 
  next, 
  id, 
  name, 
  description, 
  brand, 
  productionYear, 
  urlBoatPicture, 
  licenseType, 
  type, 
  equipements, 
  cautionAmount, 
  capacityMax, 
  bedsNumber, 
  homePort, 
  latitude, 
  longitude, 
  egineType, 
  eginePower
) {
  Boat.updateBoatById(id, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower)
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};
