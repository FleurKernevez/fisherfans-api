'use strict';

const { database } = require('../tables.js');


// Ajouter un bateau dans la base de données
exports.createBoat = function (boatData) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO boat (name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, 
          cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, 
          engineType, enginePower, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      boatData.name, boatData.description, boatData.brand, boatData.productionYear, boatData.urlBoatPicture,
      boatData.licenceType, boatData.type, boatData.equipment, boatData.cautionAmount, boatData.capacityMax,
      boatData.bedsNumber, boatData.homePort, boatData.latitude1, boatData.longitude1, boatData.latitude2,
      boatData.longitude2, boatData.engineType, boatData.enginePower, boatData.user_id
    ];

    database.run(query, values, function (err) {
      if (err) {
        console.error("Erreur lors de l'insertion du bateau :", err.message);
        return reject(new Error("Erreur lors de la création du bateau."));
      }
      resolve({ id: this.lastID });
    });
  });
};


// Récupérer tous les bateaux d'un utilisateur
exports.getAllBoats = function (user_id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM boat`;
    
    database.all(sql, [user_id], (error, rows) => {
      if (error) {
        return reject(error);
      }
      resolve(rows);
    });
  });
};


// Récupérer une liste de bateaux filtrés selon leurs caractéristiques 
exports.getFilteredBoats = function (filters) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM boat WHERE 1=1"; // Permet d'ajouter dynamiquement des filtres
    const params = [];

    const allowedFilters = {
      "name": "TEXT",
      "brand": "TEXT",
      "type": "TEXT",
      "licenceType": "TEXT",
      "capacityMax": "INTEGER",
      "engineType": "TEXT"
    };

    // Appliquer les filtres dynamiques
    Object.keys(filters).forEach(key => {
      if (allowedFilters[key] && filters[key]) {
        if (allowedFilters[key] === "INTEGER") {
          sql += ` AND ${key} = ?`;
          params.push(parseInt(filters[key], 10));  // Convertir en INT
        } else {
          sql += ` AND ${key} = ?`;
          params.push(filters[key]);
        }
      }
    });

    database.all(sql, params, (error, rows) => {
      if (error) {
        return reject(error);
      }

      if (!rows || rows.length === 0) {
        console.warn("Aucun bateau trouvé avec ces filtres:", filters);
        return reject({
          success: false,
          errorCode: "NO_BOATS_FOUND",
          message: `Aucun bateau ne correspond aux filtres fournis.`,
          filters: filters
        });
      }
      resolve(rows);
    });
  });
};


// Récupérer les bateaux dans une zone géographique donnée
exports.getBoatsInBoundingBox = function (minLatitude, maxLatitude, minLongitude, maxLongitude) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM boat
      WHERE 
        latitude1 BETWEEN ? AND ? AND longitude1 BETWEEN ? AND ? 
        AND latitude2 BETWEEN ? AND ? AND longitude2 BETWEEN ? AND ?
    `;

    database.all(sql, [minLatitude, maxLatitude, minLongitude, maxLongitude, minLatitude, maxLatitude, minLongitude, maxLongitude], (error, rows) => {
      if (error) {
        console.error("Erreur SQL lors de la récupération des bateaux :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(rows);
    });
  });
};


// Récupérer les bateaux d'un user
exports.getBoatsByUserId = function (userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM boat WHERE user_id = ?`;

    database.all(sql, [userId], (error, rows) => {
      if (error) {
        console.error("Erreur lors de la récupération des bateaux :", error);
        return reject({
          success: false,
          errorCode: "DATABASE_ERROR",
          message: "Erreur interne du serveur lors de la récupération des bateaux."
        });
      }

      if (!rows || rows.length === 0) {
        console.warn(`Aucun bateau trouvé en base pour l'utilisateur ID: ${userId}`);
        return reject({
          success: false,
          errorCode: "NO_BOATS_FOUND",
          message: "Aucun bateau n'existe actuellement pour cet utilisateur."
        });
      }
      resolve(rows);
    });
  });
};


// Supprimer un bateau par ID
exports.deleteBoat = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM boat WHERE id = ?';
    database.run(sql, [id], function (error) {
      if (error) {
        console.error("Erreur lors de la suppression du bateau :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve({ affectedRows: this.changes });
    });
  });
};


// Modifier un bateau
exports.updateBoat = function (id, updates) {
  return new Promise(function (resolve, reject) {
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

    database.run(sql, params, function (error) {
      if (error) {
        return reject(error); // Rejeter la promesse en cas d'erreur
      }
      resolve({ affectedRows: this.changes }); // Résoudre avec le nombre de lignes affectées
    });
  });
};


// Récupérer un bateau par son ID
exports.getBoatById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM boat WHERE id = ?`;
    database.get(sql, [id], (error, row) => {
      if (error) {
        console.error("Erreur lors de la récupération du bateau :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(row); // Retourne `null` si aucun bateau trouvé
    });
  });
};





