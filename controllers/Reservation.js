'use strict';

const utils = require('../utils/writer.js');
const Reservation = require('../service/ReservationService');


/**
 * Créer une réservation
 */
module.exports.createReservation = function createReservation(req, res) {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié depuis le token
  const { boatTrip_id, choosenDate, seatsBooked, totalPrice } = req.body;

  if (!boatTrip_id || !choosenDate || !seatsBooked || !totalPrice) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  Reservation.createReservation(boatTrip_id, choosenDate, seatsBooked, totalPrice, userId)
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
 * Récupérer les réservations de l'utilisateur par date
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
 * Supprimer une réservation si elle appartient à l'utilisateur
 */
module.exports.deleteReservation = function deleteReservation(req, res) {
  const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
  const { id } = req.params; // Récupérer l'ID de la réservation

  if (!id) {
    return res.status(400).json({ error: "L'ID de la réservation est requis." });
  }

  Reservation.deleteReservation(id, userId)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(403).json({ error: "Action non autorisée ou réservation non trouvée." }); 
      }
      res.status(200).json({ message: "Réservation supprimée avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la suppression de la réservation :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



/**
 * Mettre à jour une réservation si elle appartient à l'utilisateur
 */
module.exports.majReservation = function majReservation(req, res) {
  const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
  const { id } = req.params; // Récupérer l'ID de la réservation
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ error: "L'ID de la réservation est requis." });
  }

  Reservation.updateReservation(id, updatedData, userId)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(403).json({ error: "Action non autorisée ou réservation non trouvée." }); 
      }
      res.status(200).json({ message: "Réservation mise à jour avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de la réservation :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};








