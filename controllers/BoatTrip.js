'use strict';

var utils = require('../utils/writer.js');
var BoatTrip = require('../service/BoatTripService');

module.exports.createBoatTrip = function createBoatTrip (req, res, next, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.createBoatTrip(user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteBoatTrip = function deleteBoatTrip (req, res, next, id) {
  BoatTrip.deleteBoatTrip(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBoatTrip = function getBoatTrip (req, res, next, user_id, boat_id, id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.getBoatTrip(user_id, boat_id, id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBoatTrip = function updateBoatTrip (req, res, next, id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.updateBoatTrip(id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBoatTrip_1 = function updateBoatTrip_1 (req, res, next, id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price) {
  BoatTrip.updateBoatTrip_1(id, user_id, boat_id, title, practicalInformations, type, priceType, dates, times, passengersNumber, price)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
