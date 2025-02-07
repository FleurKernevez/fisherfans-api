'use strict';

var utils = require('../utils/writer.js');
var FishingBook = require('../service/FishingBookService');

const sqlite3 = require('sqlite3').verbose();

let database;
function getDatabase() {
    if (!database) {
        database = new sqlite3.Database('./fisher-fans.db', (err) => {
            if (err) {
                console.error('Erreur lors de la connexion à la base de données :', err.message);
            } else {
                console.log('Connexion réussie à la base de données SQLite.');
            }
        });
    }
    return database;
}

/**
 * Fonction pour créer un livre de pêche 

 */
module.exports.createFishingBook = function createFishingBook (
  req, 
  res, 
  next,
) {
  const db = getDatabase();
  const query = "SELECT * FROM bookPage";

  db.get(query, (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération des données de la table "bookPage":', err.message);
      return utils.writeJson(res, { message: "Erreur interne" }, 500);
    }

    if (!row) {
      return utils.writeJson(res, { message: "Données non trouvées" }, 404);
    }

    const requestForCreateNewFishingBook = `
      INSERT INTO bookPage (fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(requestForCreateNewFishingBook, [
      req.body.fishName,
      req.body.urlFishPicture,
      req.body.comment,
      req.body.size,
      req.body.weight,
      req.body.fishingPlace,
      req.body.fishingDate,
      req.body.releasedFish,
      req.body.user_id
    ], function (err) {
      if (err) {
        console.error('Erreur lors de la création d\'un livre de pêche :', err.message);
        return utils.writeJson(res, { message: "Erreur interne" }, 500);
      }
      const lastID = this.lastID;
      const requestForGetFishingBook = 'SELECT * FROM bookPage WHERE id = ?';
      db.get(requestForGetFishingBook, [lastID], (err, row) => {
        if (err) {
          console.error('Erreur lors de la récupération du livre de pêche créé :', err.message);
          return utils.writeJson(res, { message: "Erreur interne" }, 500);
        }
        utils.writeJson(res, row, 201);
      });
    });
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
module.exports.updateFishingBook = function updateFishingBook (
  req, 
  res, 
  next, 
  id, 
  fishName, 
  urlFishPicture, 
  comment, 
  size, 
  weight, 
  fishingPlace, 
  fishingDate, 
  releasedFish, 
  user_id
) {
  FishingBook.updateFishingBook(
    id, 
    fishName,
    urlFishPicture, 
    comment, 
    size, 
    weight, 
    fishingPlace, 
    fishingDate, 
    releasedFish, 
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

module.exports.updateFishingBook_2 = function updateFishingBook_2 (
  req, 
  res, 
  next, 
  id, 
  fishName, 
  urlFishPicture, 
  comment, 
  size, 
  weight, 
  fishingPlace, 
  fishingDate, 
  releasedFish, 
  user_id
) {
  FishingBook.updateFishingBook_2(
    id, 
    fishName, 
    urlFishPicture, 
    comment, 
    size, 
    weight, 
    fishingPlace, 
    fishingDate, 
    releasedFish, 
    user_id
  )
  .then(function (response) {
    utils.writeJson(res, response);
  })
  .catch(function (response) {
    utils.writeJson(res, response);
  });
};
