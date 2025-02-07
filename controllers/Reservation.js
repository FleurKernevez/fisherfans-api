'use strict';

var utils = require('../utils/writer.js');
var Reservation = require('../service/ReservationService');


/**
 * Fonction pour créer une nouvelle réservation
 */
module.exports.createReservation = function createReservation(req, res) {
  const { boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id } = req.body;


  if (!boatTrip_id || !choosenDate || !seatsBooked || !totalPrice || !user_id) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  Reservation.createReservation(boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error("Erreur lors de la création :", error); 
      res.status(500).json(error);
    });
};



/**
 * Récupérer une liste de réservations filtrées
 */
module.exports.getReservations = function getReservations(req, res) {
    const filters = req.query; // Récupérer les filtres depuis les paramètres de requête

    Reservation.getFilteredReservations(filters)
      .then((reservations) => {
        res.status(200).json(reservations);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des réservations :", error);
        res.status(500).json(error);
      });
};



/**
 * Fonction pour supprimer une réservation
 */
module.exports.deleteReservation = function deleteReservation (req, res, next, id) {
  Reservation.deleteReservation(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



/**
 * Fonction pour mettre à jour les données d'une réservation
 */
module.exports.updateByIdReservation = function updateByIdReservation (
  req, 
  res, 
  next, 
  id, 
  boatTrip_id, 
  choosenDate, 
  seatsBooked, 
  totalPrice, 
  user_id
) {
  Reservation.updateByIdReservation(
    id, 
    boatTrip_id, 
    choosenDate, 
    seatsBooked, 
    totalPrice, 
    user_id
  )
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};



/**
 * Fonction pour mettre à jour les données d'une réservation 

 */
module.exports.updateReservation = function updateReservation (
  req, 
  res, 
  next, 
  id, 
  boatTrip_id, 
  choosenDate, 
  seatsBooked, 
  totalPrice, 
  user_id
) {
  Reservation.updateReservation(id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};
