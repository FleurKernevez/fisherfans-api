'use strict';

const { database } = require('../tables.js');

/**
 * Créer un FishingBook
 */
exports.createFishingBook = function (title, description, user_id) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO fishingBook (title, description, user_id) VALUES (?, ?, ?)`;

    database.run(query, [title, description, user_id], function (err) {
      if (err) {
        return reject(new Error("Erreur lors de la création du FishingBook"));
      }

      resolve({
        message: "FishingBook créé avec succès.",
        fishingBookId: this.lastID,
        title,
        description
      });
    });
  });
};


