'use strict';

var utils = require('../utils/writer.js');
var FishingBook = require('../service/FishingBookService');

/**
 * Fonction pour créer un livre de pêche 

 */
module.exports.createFishingBook = function createFishingBook (req, res, next, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id) {
  FishingBook.createFishingBook(fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour supprimer un livre de pêche
 */
module.exports.deleteFishingBook = function deleteFishingBook (req, res, next, id) {
  FishingBook.deleteFishingBook(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
 * Fonction pour mettre à jour les données d'un livre de pêche
 */
module.exports.updateFishingBook = function updateFishingBook (req, res, next, id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id) {
  FishingBook.updateFishingBook(id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

/**
  * Fonction pour mettre à jour les données d'un livre de pêche
 */
module.exports.updateFishingBookById = function updateFishingBookById (req, res, next, id, user_id) {
  FishingBook.updateFishingBookById(id, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateFishingBookById_1 = function updateFishingBookById_1 (req, res, next, id, user_id) {
  FishingBook.updateFishingBookById_1(id, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateFishingBook_2 = function updateFishingBook_2 (req, res, next, id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id) {
  FishingBook.updateFishingBook_2(id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
