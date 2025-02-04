'use strict';

const sqlite3 = require('sqlite3').verbose();

const database = new sqlite3.Database('./fisher-fans.db', (err) => {
  if (err) {
      console.error('Erreur lors de la connexion à la base de données :', err.message);
  } else {
      console.log('Connexion réussie à la base de données SQLite.');
  }
});

// Get a boat with some caracteristics
exports.getFilteredBoats = function(filters) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM boat WHERE 1=1";
    const params = [];

    // Ajouter dynamiquement des conditions pour chaque filtre
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        sql += ` AND ${key} IN (${value.map(() => '?').join(', ')})`;
        params.push(...value);
      } else {
        sql += ` AND ${key} = ?`;
        params.push(value);
      }
    }

    database.all(sql, params, (error, rows) => {
      if (error) {
        return reject(error); 
      }
      resolve(rows);
    });
  });
};

// Create a boat
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


// Update a boat 
exports.updateBoat = function(id, updates) {
  return new Promise(function(resolve, reject) {
    // Vérifier si des champs à mettre à jour ont été fournis
    if (!id || !updates || Object.keys(updates).length === 0) {
      return reject(new Error("ID et données de mise à jour sont requis"));
    }

    // Construire dynamiquement la requête SQL et les paramètres
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(id); // Ajouter l'ID à la fin pour la clause WHERE

    const sql = `
      UPDATE boat
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    database.run(sql, params, function(error) {
      if (error) {
        return reject(error); // Rejeter la promesse en cas d'erreur
      }
      resolve({ affectedRows: this.changes }); // Résoudre avec le nombre de lignes affectées
    });
  });
};

// find a boat in function of the place
exports.getBoatsInBoundingBox = function(minLatitude, maxLatitude, minLongitude, maxLongitude) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM boat
      WHERE
        latitude1 BETWEEN ? AND ? AND
        longitude1 BETWEEN ? AND ? AND
        latitude2 BETWEEN ? AND ? AND
        longitude2 BETWEEN ? AND ?
    `;

    const params = [
      minLatitude, maxLatitude,
      minLongitude, maxLongitude,
      minLatitude, maxLatitude,
      minLongitude, maxLongitude,
    ];

    database.all(sql, params, (error, rows) => {
      if (error) {
        return reject(error); // Rejeter en cas d'erreur
      }
      resolve(rows); // Résoudre avec les bateaux trouvés
    });
  });
};
