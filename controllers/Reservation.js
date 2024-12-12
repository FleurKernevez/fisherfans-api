'use strict';

var utils = require('../utils/writer.js');
var Reservation = require('../service/ReservationService');

module.exports.createReservation = function createReservation (req, res, next, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  Reservation.createReservation(boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteReservation = function deleteReservation (req, res, next, id) {
  Reservation.deleteReservation(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReservation = function getReservation (req, res, next, id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  Reservation.getReservation(id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateByIdReservation = function updateByIdReservation (req, res, next, id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  Reservation.updateByIdReservation(id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateReservation = function updateReservation (req, res, next, id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id) {
  Reservation.updateReservation(id, boatTrip_id, choosenDate, seatsBooked, totalPrice, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
