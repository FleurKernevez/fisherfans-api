'use strict';

const utils = require('../utils/writer.js');
const Reservation = require('../service/ReservationService');


/**
 * Créer une réservation
 */
module.exports.createReservation = function createReservation(req, res) {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié depuis le token
  const { boatTrip_id, choosenDate, seatsBooked, totalPrice } = req.body;

  // Vérification des champs obligatoires
  if (!boatTrip_id || !choosenDate || !seatsBooked || !totalPrice) {
    return res.status(400).json({
      success: false,
      errorCode: "MISSING_FIELDS",
      message: "Tous les champs (boatTrip_id, choosenDate, seatsBooked, totalPrice) sont requis."
    });
  }

  // Création de la réservation
  Reservation.createReservation(boatTrip_id, choosenDate, seatsBooked, totalPrice, userId)
    .then(response => {
      return res.status(201).json({
        success: true,
        message: "Réservation créée avec succès.",
        reservationId: response.id
      });
    })
    .catch(error => {
      console.error("Erreur lors de la création de la réservation :", error.message);

      if (error.code === "BOATTRIP_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          errorCode: "BOATTRIP_NOT_FOUND",
          message: "Le boatTrip spécifié n'existe pas."
        });
      }

      if (error.code === "LIMIT_EXCEEDED") {
        return res.status(400).json({
          success: false,
          errorCode: "LIMIT_EXCEEDED",
          message: "Le nombre de places réservées dépasse la capacité du bateau."
        });
      }

      return res.status(500).json({
        success: false,
        errorCode: "SERVER_ERROR",
        message: "Erreur interne du serveur."
      });
    });
};


/**
 * Récupérer les réservations de l'utilisateur 
 */
module.exports.reservationDatas = function reservationDatas(req, res) {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié

  Reservation.getReservationsByUser(userId)
    .then(reservations => {
      res.status(200).json({
        success: true,
        message: "Réservations récupérées avec succès.",
        data: reservations
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des réservations :", error.message);
      res.status(500).json({ success: false, error: "Erreur interne du serveur." });
    });
};


/**
 * Récupérer les réservations de l'utilisateur par date
 */
module.exports.getReservationsByDate = function getReservationsByDate(req, res) {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié
  const { date } = req.query; // Date passée en paramètre

  if (!date) {
    return res.status(400).json({
      success: false,
      errorCode: "MISSING_DATE",
      message: "Le paramètre 'date' est requis pour filtrer les réservations."
    });
  }

  Reservation.getReservationsByDate(userId, date)
    .then(reservations => {
      res.status(200).json({
        success: true,
        message: `Réservations pour la date ${date} récupérées avec succès.`,
        data: reservations
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des réservations par date :", error.message);
      res.status(500).json({ success: false, error: "Erreur interne du serveur." });
    });
};


/**
 * Supprimer une réservation si elle appartient à l'utilisateur
 */
module.exports.deleteReservation = async function deleteReservation(req, res) {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
    const { id } = req.params; // Récupérer l'ID de la réservation

    if (!id) {
      return res.status(400).json({ error: "L'ID de la réservation est requis." });
    }

    const response = await Reservation.deleteReservation(id, userId);
    
    if (response.affectedRows === 0) {
      return res.status(403).json({ error: "Action non autorisée ou réservation non trouvée." });
    }
    
    return res.status(200).json({ message: "Réservation supprimée avec succès." });

  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation :", error.message);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};


/**
 * Mettre à jour une réservation si elle appartient à l'utilisateur
 */
module.exports.majReservation = async function majReservation(req, res) {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
    const { id } = req.params; // Récupérer l'ID de la réservation
    const updatedData = req.body;

    if (!id) {
      return res.status(400).json({ error: "L'ID de la réservation est requis." });
    }

    const response = await Reservation.updateReservation(id, updatedData, userId);

    if (response.affectedRows === 0) {
      return res.status(403).json({ error: "Action non autorisée ou réservation non trouvée." });
    }
    
    return res.status(200).json({ message: "Réservation mise à jour avec succès." });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error.message);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};








