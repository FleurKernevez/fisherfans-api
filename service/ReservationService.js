'use strict';

const { database } = require('../tables.js');


// Créer une nouvelle réservation
exports.createReservation = function (boatTrip_id, choosenDate, seatsBooked, totalPrice, userId) {
  return new Promise((resolve, reject) => {
    const getBoatTripCapacityQuery = `SELECT passengersNumber FROM boatTrip WHERE id = ?`;

    database.get(getBoatTripCapacityQuery, [boatTrip_id], (err, boatTrip) => {
      if (err) {
        console.error("Erreur lors de la récupération du boatTrip :", err);
        return reject({ message: "Erreur interne du serveur.", code: "DB_ERROR" });
      }

      if (!boatTrip) {
        console.warn(`BoatTrip avec ID ${boatTrip_id} introuvable.`);
        return reject({ message: "Le boatTrip spécifié n'existe pas.", code: "BOATTRIP_NOT_FOUND" });
      }

      const getTotalReservedSeatsQuery = `SELECT SUM(seatsBooked) AS totalSeats FROM reservation WHERE boatTrip_id = ?`;

      database.get(getTotalReservedSeatsQuery, [boatTrip_id], (err, result) => {
        if (err) {
          console.error("Erreur lors de la vérification des réservations :", err);
          return reject({ message: "Erreur interne du serveur.", code: "DB_ERROR" });
        }

        const insertReservationQuery = `
          INSERT INTO reservation (boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) 
          VALUES (?, ?, ?, ?, ?)`;

        database.run(insertReservationQuery, [boatTrip_id, choosenDate, seatsBooked, totalPrice, userId], function (err) {
          if (err) {
            console.error("Erreur lors de l'insertion de la réservation :", err);
            return reject({ message: "Erreur interne du serveur.", code: "DB_ERROR" });
          }
          resolve({ id: this.lastID });
        });
      });
    });
  });
};


// Récupérer les réservations de l'utilisateur avec option de filtrage par date
exports.getReservationsByUser = function (userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM reservation WHERE user_id = ?`;

    database.all(query, [userId], (err, rows) => {
      if (err) {
        console.error("Erreur SQL lors de la récupération des réservations :", err);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(rows);
    });
  });
};


// Récupérer les réservations d'un utilisateur pour une date spécifique
exports.getReservationsByDate = function (userId, choosenDate) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM reservation WHERE user_id = ? AND choosenDate = ?`;

    database.all(query, [userId, choosenDate], (err, rows) => {
      if (err) {
        console.error("Erreur SQL lors de la récupération des réservations par date :", err);
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(rows);
    });
  });
};


// Supprimer une réservation si elle appartient à l'utilisateur
exports.deleteReservation = async function (id, userId) {
  try {
    const query = `DELETE FROM reservation WHERE id = ? AND user_id = ?`;
    
    return new Promise((resolve, reject) => {
      database.run(query, [id, userId], function (err) {
        if (err) {
          console.error("Erreur lors de la suppression de la réservation :", err);
          return reject(new Error("DATABASE_ERROR"));
        }
        resolve({ affectedRows: this.changes });
      });
    });
  } catch (error) {
    console.error("Erreur SQL lors de la suppression de la réservation :", error);
    throw new Error("DATABASE_ERROR");
  }
};


// Mettre à jour une réservation si elle appartient à l'utilisateur
exports.updateReservation = async function (id, updatedData, userId) {
  try {
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
      throw new Error("Aucune donnée valide à mettre à jour.");
    }

    values.push(id, userId);
    const query = `UPDATE reservation SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;

    return new Promise((resolve, reject) => {
      database.run(query, values, function (err) {
        if (err) {
          console.error("Erreur SQL lors de la mise à jour de la réservation :", err);
          return reject(new Error("DATABASE_ERROR"));
        }
        resolve({ affectedRows: this.changes });
      });
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    throw new Error("DATABASE_ERROR");
  }
};


