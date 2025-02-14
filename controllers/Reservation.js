'use strict';

const utils = require('../utils/writer.js');
const Reservation = require('../service/ReservationService');


/**
 * Créer une réservation
 */
module.exports.createReservation = function createReservation(req, res) {
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur authentifié
  const { boatTrip_id, choosenDate, seatsBooked, totalPrice } = req.body;

  if (!boatTrip_id || !choosenDate || !seatsBooked || !totalPrice) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  Reservation.createReservation(boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then(response => {
      res.status(201).json({ message: "Réservation créée avec succès.", reservationId: response.id });
    })
    .catch(error => {
      console.error("Erreur lors de la création de la réservation :", error.message);
      
      if (error.code === "LIMIT_EXCEEDED") {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


/**
 * Récupérer les réservations de l'utilisateur connecté
 */
module.exports.reservationDatas = function reservationDatas(req, res) {
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur authentifié

  Reservation.getReservationsByDate(user_id)
    .then(reservations => {
      res.status(200).json(reservations);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des réservations :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


/**
 * Supprimer une réservation
 */
module.exports.deleteReservation = function deleteReservation(req, res) {
  const user_id = req.user.id; // ID de l'utilisateur authentifié
  const { id } = req.params;

  Reservation.deleteReservation(id, user_id)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(403).json({ error: "Action non autorisée." }); 
      }
        res.status(200).json({ message: "Réservation supprimée avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la suppression de la réservation :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


/**
 * Mettre à jour une réservation
 */
module.exports.majReservation = function majReservation(req, res) {
  const user_id = req.user.id; // ID de l'utilisateur authentifié
  const { id } = req.params;
  const updatedData = req.body;

  Reservation.updateReservation(id, updatedData, user_id)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(403).json({ error: "Action non autorisée." }); // 403 Forbidden 
      }
      res.status(200).json({ message: "Réservation mise à jour avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de la réservation :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};
