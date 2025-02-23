'use strict';

const { database } = require('../tables.js');

// Créer un FishingBook
exports.createFishingBook = function (title, description, user_id) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO fishingBook (title, description, user_id) VALUES (?, ?, ?)`;

    database.run(query, [title, description, user_id], function (err) {
      if (err) {
        return reject(new Error("DATABASE_ERROR"));
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


// Récupérer un FishingBook par son ID
exports.getFishingBookById = function (fishingBookId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, user_id FROM fishingBook WHERE id = ?`;

    database.get(query, [fishingBookId], (err, row) => {
      if (err) {
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(row);
    });
  });
};
