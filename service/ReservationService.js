'use strict';

const { database } = require('../tables.js');

/**
 * Créer une nouvelle réservation
 */
exports.createReservation = function (boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  return new Promise((resolve, reject) => {
    // Vérifier la capacité maximale du boatTrip
    const getBoatTripCapacityQuery = `SELECT passengersNumber FROM boatTrip WHERE id = ?`;
    database.get(getBoatTripCapacityQuery, [boatTrip_id], (err, boatTrip) => {
      if (err) {
        return reject({ message: "Erreur lors de la récupération du boatTrip.", code: "DB_ERROR" });
      }
      if (!boatTrip) {
        return reject({ message: "Le boatTrip n'existe pas.", code: "BOATTRIP_NOT_FOUND" });
      }

      const maxCapacity = boatTrip.passengersNumber; // Capacité maximale du boatTrip

      // Calculer le nombre total de places déjà réservées
      const getTotalReservedSeatsQuery = `SELECT SUM(seatsBooked) AS totalSeats FROM reservation WHERE boatTrip_id = ?`;
      database.get(getTotalReservedSeatsQuery, [boatTrip_id], (err, result) => {
        if (err) {
          return reject({ message: "Erreur lors de la vérification des réservations.", code: "DB_ERROR" });
        }

        const totalSeatsReserved = result.totalSeats || 0;
        const availableSeats = maxCapacity - totalSeatsReserved;

        // Vérifier si la réservation est possible
        if (seatsBooked > availableSeats) {
          return reject({ message: `Il ne reste que ${availableSeats} places disponibles sur ce boatTrip.`, code: "LIMIT_EXCEEDED" });
        }

        // Insérer la réservation si elle est valide
        const insertReservationQuery = `
          INSERT INTO reservation (boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) 
          VALUES (?, ?, ?, ?, ?)`;

        database.run(insertReservationQuery, [boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id], function (err) {
          if (err) {
            return reject(err);
          }
          resolve({ id: this.lastID });
        });
      });
    });
  });
};



/**
 * Récupérer les réservations de l'utilisateur avec option de filtrage par date
 */
exports.getReservationsByDate = function (user_id, choosenDate = null) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM reservation WHERE user_id = ?`;
    const values = [user_id];

    if (choosenDate) {
      query += ` AND choosenDate = ?`;
      values.push(choosenDate);
    }

    database.all(query, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};



/**
 * Supprimer une réservation si elle appartient à l'utilisateur
 */
exports.deleteReservation = function (id, user_id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM reservation WHERE id = ? AND user_id = ?`;

    database.run(query, [id, user_id], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ affectedRows: this.changes });
    });
  });
};



/**
 * Mettre à jour une réservation si elle appartient à l'utilisateur
 */
exports.updateReservation = function (id, updatedData, user_id) {
  return new Promise((resolve, reject) => {
      const allowedFields = ["choosenDate", "seatsBooked", "totalPrice", "boatTrip_id"];
      const updates = [];
      const values = [];

      Object.keys(updatedData).forEach(key => {
        if (allowedFields.includes(key) && updatedData[key] !== undefined) {
          updates.push(`${key} = ?`);
          values.push(updatedData[key]);
        }
      });

      if (updates.length === 0) {
        return reject({ message: "Aucune donnée valide à mettre à jour." });
      }

      values.push(id, user_id);
      const query = `UPDATE reservation SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;

      database.run(query, values, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ affectedRows: this.changes });
      });
  });
};

