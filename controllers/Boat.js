'use strict';

var utils = require('../utils/writer.js');
var Boat = require('../service/BoatService');

module.exports.createBoat = function createBoat (req, res, next, boatLicenceNumber, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower) {
  Boat.createBoat(boatLicenceNumber, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteBoat = function deleteBoat (req, res, next, id) {
  Boat.deleteBoat(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBoat = function getBoat (req, res, next, latitude, longitude) {
  Boat.getBoat(latitude, longitude)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBoatsBetweenLatitudeAndLongitude = function getBoatsBetweenLatitudeAndLongitude (req, res, next, latitude, longitude) {
  Boat.getBoatsBetweenLatitudeAndLongitude(latitude, longitude)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBoat = function updateBoat (req, res, next, id, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower) {
  Boat.updateBoat(id, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateBoatById = function updateBoatById (req, res, next, id, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower) {
  Boat.updateBoatById(id, name, description, brand, productionYear, urlBoatPicture, licenseType, type, equipements, cautionAmount, capacityMax, bedsNumber, homePort, latitude, longitude, egineType, eginePower)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
