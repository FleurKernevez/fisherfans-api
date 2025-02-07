'use strict';

const { database } = require('../tables.js');


/**
 * Creer une nouvelle reservation
 **/
exports.createReservation = function (boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO reservation (boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) 
      VALUES (?, ?, ?, ?, ?);
    `;

    database.run(query, [boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id], function (err) {
      if (err) {
          reject({ error: "Erreur lors de la création de la réservation", details: err.message });
      } else {
          resolve({ success: "Réservation créée avec succès", reservationId: this.lastID });
      }
    });
  });
};



/**
 * Recuperer les reservations par filtre
 **/
exports.getFilteredReservations = function (filters) {
  return new Promise((resolve, reject) => {
    // Liste des colonnes autorisées pour les filtres
    const allowedFilters = ["user_id", "boatTrip_id", "choosenDate", "seatsBooked", "totalPrice"];
    const whereClauses = [];
    const values = [];

    // Construire dynamiquement les clauses WHERE en fonction des filtres
    Object.keys(filters).forEach((key) => {
      if (allowedFilters.includes(key) && filters[key]) {
        whereClauses.push(`${key} = ?`);
        values.push(filters[key]);
      }
    });

    // Construire la requête SQL
    let query = `SELECT * FROM reservation`; // Récupère toutes les colonnes de la table `reservation`

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    // Exécuter la requête avec les paramètres
    database.all(query, values, (err, rows) => {
      if (err) {
        return reject({ error: "Erreur lors de la récupération des réservations", details: err.message });
      }
      resolve(rows);
    });
  });
};



/**
 * Supprimer une reservation
 **/
exports.deleteReservation = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}



/**
 * Modifier une reservation
 **/
exports.updateReservation = function(id,boatTrip_id,choosenDate,seatsBooked,totalPrice,user_id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

