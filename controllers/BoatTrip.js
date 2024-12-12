'use strict';

var utils = require('../utils/writer.js');
var BoatTrip = require('../service/BoatTripService');

/**
 * Fonction pour créer un voyage en bateau 

 */
module.exports.createBoatTrip = function createBoatTrip (req, res, next, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.createBoatTrip(user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour supprimer un voyage en bateau
 */
module.exports.deleteBoatTrip = function deleteBoatTrip (req, res, next, id) {
  BoatTrip.deleteBoatTrip(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour récupérer les données d'un voyage en bateau 

 */
module.exports.getBoatTrip = function getBoatTrip (req, res, next, user_id, boat_id, id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.getBoatTrip(user_id, boat_id, id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour mettre à jour les données d'un voyage en bateau 

 */
module.exports.updateBoatTrip = function updateBoatTrip (req, res, next, id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.updateBoatTrip(id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour mettre à jour les données d'un voyage en bateau
 */
module.exports.updateBoatTrip_1 = function updateBoatTrip_1 (req, res, next, id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.updateBoatTrip_1(id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
