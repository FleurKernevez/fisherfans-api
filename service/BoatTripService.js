'use strict';

const { database } = require('../tables.js');

// Créer une sortie bateau
exports.createBoatTrip = function (boatTripData) {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO boatTrip (title, practicalInformation, type, priceType, startDate, endDate, passengersNumber, price, user_id, boat_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  

    const values = [
      boatTripData.title, boatTripData.practicalInformation, boatTripData.type, boatTripData.priceType,
      boatTripData.startDate, boatTripData.endDate, boatTripData.passengersNumber, boatTripData.price,
      boatTripData.user_id, boatTripData.boat_id
    ];

    database.run(query, values, function (err) {
      if (err) {
        console.error("Erreur lors de la création du voyage en bateau :", err.message);
        return reject(new Error("DATABASE_ERROR"));
      }

      database.get("SELECT * FROM boatTrip WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          console.error("Erreur lors de la récupération du voyage créé :", err.message);
          return reject(new Error("DATABASE_ERROR"));
        }
        resolve(row);
      });
    });
  });
};


// Récupérer tous les voyages d'un utilisateur
exports.getBoatTripByUserId = function (user_id) {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT id, title, practicalInformation, type, priceType, startDate, endDate, 
                 passengersNumber, price, user_id, boat_id 
          FROM boatTrip 
          WHERE user_id = ?`;

    database.all(query, [user_id], (err, rows) => {
      if (err) {
        console.error("Erreur lors de la récupération des voyages en bateau :", err);
        return reject({
          success: false,
          errorCode: "DATABASE_ERROR",
          message: "Erreur interne du serveur."
        });
      }
      resolve(rows);
    });
  });
};


// Recuperer les voyages filtres
exports.getFilteredBoatTrips = function (filters) {
  return new Promise((resolve, reject) => {
    // Vérifier si au moins un filtre est fourni
    if (!filters.title && !filters.type && !filters.startDate && !filters.endDate && !filters.price) {
      return reject({
        success: false,
        errorCode: "MISSING_FILTERS",
        message: "Vous devez fournir au moins un critère de filtre pour récupérer les sorties de pêche."
      });
    }

    let sql = "SELECT * FROM boatTrip WHERE 1=1"; // Construction dynamique de la requête
    const params = [];

    const allowedFilters = {
      "title": "TEXT",
      "type": "TEXT",
      "startDate": "TEXT",
      "endDate": "TEXT",
      "price": "REAL"
    };

    // Appliquer les filtres dynamiques
    Object.keys(filters).forEach(key => {
      if (allowedFilters[key] && filters[key]) {
        if (allowedFilters[key] === "REAL") {
          sql += ` AND ${key} = ?`;
          params.push(parseFloat(filters[key]));
        } else {
          sql += ` AND ${key} = ?`;
          params.push(filters[key]);
        }
      }
    });

    database.all(sql, params, (error, rows) => {
      if (error) {
        console.error("Erreur SQL lors de la récupération des sorties de pêche :", error);
        return reject({
          success: false,
          errorCode: "DATABASE_ERROR",
          message: "Erreur interne du serveur."
        });
      }

      resolve(rows);
    });
  });
};


// Supprimer un voyage
exports.deleteBoatTrip = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM boatTrip WHERE id = ?';
    database.run(sql, [id], function (error) {
      if (error) {
        console.error("Erreur lors de la suppression du voyage en bateau :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve({ affectedRows: this.changes });
    });
  });
};


// Mettre à jour un voyage en bateau
exports.updateBoatTrip = function (id, updates) {
  return new Promise((resolve, reject) => {
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
          UPDATE boatTrip
          SET ${fields.join(', ')}
          WHERE id = ?
      `;

    database.run(sql, params, function (error) {
      if (error) {
        console.error("Erreur lors de la mise à jour du voyage en bateau :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve({ affectedRows: this.changes });
    });
  });
};


// Récupérer un voyage en bateau par ID
exports.getBoatTripById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM boatTrip WHERE id = ?`;
    database.get(sql, [id], (error, row) => {
      if (error) {
        console.error("Erreur lors de la récupération du voyage en bateau :", error);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(row); // Retourne `null` si aucun voyage trouvé
    });
  });
};




