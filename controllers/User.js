'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

/**
 * Fonction pour créer un utilisateur 

 */
module.exports.createUser = function createUser (req, res, next, email, password, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList) {
  User.createUser(email, password, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour supprimer un utilisateur
 */
module.exports.deleteUser = function deleteUser (req, res, next, id) {
  User.deleteUser(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour mettre à jour les données d'un utilisateur
 */
module.exports.majDatasUser = function majDatasUser (req, res, next, id, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList) {
  User.majDatasUser(id, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour mettre à jour les données d'un utilisateur
 */
module.exports.majUser = function majUser (req, res, next, id, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList) {
  User.majUser(id, lastname, firstName, birthdate, phoneNumber, address, postalCode, city, languagesSpoken, urlUserPicture, boatLicenceNumber, insuranceNumber, status, companyName, activityType, sIRETNumber, rCNumber, boatsList, fishingBook, boatTripsList, reservationsList)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour obtenir les données d'un utilisateur
 */
module.exports.userDatas = function userDatas (req, res, next, id) {
  User.userDatas(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
