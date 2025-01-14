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
module.exports.createBoat = function createBoat (
  req, 
  res, 
  next, 
  boatLicenceNumber, 
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
  Boat.createBoat(
    boatLicenceNumber, 
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
 * Fonction pour supprimer un bateau
 */
module.exports.deleteBoat = function deleteBoat (req, res, next, id) {
  Boat.deleteBoat(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

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
