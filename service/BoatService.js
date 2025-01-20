'use strict';

const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database('./fisher-fans.db', (err) => {
  if (err) {
      console.error('Erreur lors de la connexion à la base de données :', err.message);
  } else {
      console.log('Connexion réussie à la base de données SQLite.');
  }
});


/**
 * Create
 * Create new boat
 *
 * boatLicenceNumber  
 * name   (optional)
 * description   (optional)
 * brand   (optional)
 * productionYear   (optional)
 * urlBoatPicture   (optional)
 * licenseType   (optional)
 * type   (optional)
 * equipements   (optional)
 * cautionAmount   (optional)
 * capacityMax   (optional)
 * bedsNumber   (optional)
 * homePort   (optional)
 * latitude   (optional)
 * longitude   (optional)
 * egineType   (optional)
 * eginePower   (optional)
 * no response value expected for this operation
 **/
exports.createBoat = function(boatLicenceNumber,name,description,brand,productionYear,urlBoatPicture,licenseType,type,equipements,cautionAmount,capacityMax,bedsNumber,homePort,latitude,longitude,egineType,eginePower) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}



//Delete a boat
exports.deleteBoat = function(id) {
  return new Promise(function(resolve, reject) {
    const sql = 'DELETE FROM boat WHERE id = ?'; // Requête SQL pour supprimer un bateau
    database.run(sql, [id], function(error) {
      if (error) {
        return reject(error); // Rejeter la promesse en cas d'erreur
      }
      resolve({ affectedRows: this.changes }); // Résoudre avec le nombre de lignes affectées
    });
  });
};


/**
 * Get
 * Get a Boat
 *
 * latitude   (optional)
 * longitude   (optional)
 * no response value expected for this operation
 **/
exports.getBoat = function(latitude,longitude) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get
 * Get boats inside latitude and longitude
 *
 * latitude  
 * longitude  
 * no response value expected for this operation
 **/
exports.getBoatsBetweenLatitudeAndLongitude = function(latitude,longitude) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update
 * Update values for about boat
 *
 * id  
 * name   (optional)
 * description   (optional)
 * brand   (optional)
 * productionYear   (optional)
 * urlBoatPicture   (optional)
 * licenseType   (optional)
 * type   (optional)
 * equipements   (optional)
 * cautionAmount   (optional)
 * capacityMax   (optional)
 * bedsNumber   (optional)
 * homePort   (optional)
 * latitude   (optional)
 * longitude   (optional)
 * egineType   (optional)
 * eginePower   (optional)
 * no response value expected for this operation
 **/
exports.updateBoat = function(id,name,description,brand,productionYear,urlBoatPicture,licenseType,type,equipements,cautionAmount,capacityMax,bedsNumber,homePort,latitude,longitude,egineType,eginePower) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update
 * Update values for about boat
 *
 * id  
 * name   (optional)
 * description   (optional)
 * brand   (optional)
 * productionYear   (optional)
 * urlBoatPicture   (optional)
 * licenseType   (optional)
 * type   (optional)
 * equipements   (optional)
 * cautionAmount   (optional)
 * capacityMax   (optional)
 * bedsNumber   (optional)
 * homePort   (optional)
 * latitude   (optional)
 * longitude   (optional)
 * egineType   (optional)
 * eginePower   (optional)
 * no response value expected for this operation
 **/
exports.updateBoatById = function(id,name,description,brand,productionYear,urlBoatPicture,licenseType,type,equipements,cautionAmount,capacityMax,bedsNumber,homePort,latitude,longitude,egineType,eginePower) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

