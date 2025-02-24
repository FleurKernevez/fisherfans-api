'use strict';

const { database } = require('../tables.js');

// Ajouter une page (BookPage) à un FishingBook
exports.createBookPage = function (bookPageData) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bookPage (fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            bookPageData.fishingBook_id, bookPageData.fishName, bookPageData.urlFishPicture, 
            bookPageData.comment, bookPageData.size, bookPageData.weight, 
            bookPageData.fishingPlace, bookPageData.fishingDate, bookPageData.releasedFish, bookPageData.user_id
        ];

        database.run(query, values, function (err) {
            if (err) {
                return reject(new Error("DATABASE_ERROR"));
            }

            resolve({
                bookPageId: this.lastID,
                fishingBookId: bookPageData.fishingBook_id,
                fishName: bookPageData.fishName,
                fishingDate: bookPageData.fishingDate
            });
        });
    });
};


// Récupérer toutes les pages du carnet de pêche d’un utilisateur (BF19)
exports.getUserBookPages = function (user_id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM bookPage WHERE user_id = ?`;
        database.all(query, [user_id], (err, rows) => {
            if (err) {
                return reject(new Error("Erreur lors de la récupération des pages"));
            }
            resolve(rows);
        });
    });
};


// Supprimer une page du FishingBook 
exports.deleteBookPage = function (bookPageId) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM bookPage WHERE id = ?`;
        database.run(query, [bookPageId], function (err) {
            if (err) {
                return reject(new Error("DATABASE_ERROR"));
            }
            resolve({ affectedRows: this.changes });
        });
    });
};


// Modifier une page du FishingBook 
exports.updateBookPage = function (bookPageId, updatedData) {
    return new Promise((resolve, reject) => {
        const allowedFields = [
            "fishName", "urlFishPicture", "comment", "size", "weight",
            "fishingPlace", "fishingDate", "releasedFish"
        ];

        const updates = [];
        const values = [];

        Object.keys(updatedData).forEach(key => {
            if (allowedFields.includes(key) && updatedData[key] !== undefined) {
                updates.push(`${key} = ?`);
                values.push(updatedData[key]);
            }
        });

        if (updates.length === 0) {
            return reject({ message: "Aucune donnée valide à mettre à jour.", code: "NO_VALID_DATA" });
        }

        values.push(bookPageId);
        const query = `UPDATE bookPage SET ${updates.join(", ")} WHERE id = ?`;

        database.run(query, values, function (err) {
            if (err) {
                return reject(new Error("DATABASE_ERROR"));
            }
            resolve({ affectedRows: this.changes });
        });
    });
};


// Modifier une page donnée du carnet de pêche d’un utilisateur donné (BF18)
exports.updateBookPageForUser = function (fishingBookId, bookPageId, userId, updatedData) {
    return new Promise((resolve, reject) => {
        const allowedFields = [
            "fishName", "urlFishPicture", "comment", "size", "weight",
            "fishingPlace", "fishingDate", "releasedFish"
        ];

        const updates = [];
        const values = [];

        Object.keys(updatedData).forEach(key => {
            if (allowedFields.includes(key) && updatedData[key] !== undefined) {
                updates.push(`${key} = ?`);
                values.push(updatedData[key]);
            }
        });

        if (updates.length === 0) {
            return reject({ message: "Aucune donnée valide à mettre à jour.", code: "NO_VALID_DATA" });
        }

        values.push(bookPageId, fishingBookId, userId);
        const query = `UPDATE bookPage SET ${updates.join(", ")} WHERE id = ? AND fishingBook_id = ? AND user_id = ?`;

        database.run(query, values, function (err) {
            if (err) {
                return reject(new Error("DATABASE_ERROR"));
            }
            resolve({ affectedRows: this.changes });
        });
    });
};


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


exports.getBookPageById = function (bookPageId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM bookPage WHERE id = ?`;

        database.get(query, [bookPageId], (err, row) => {
            if (err) {
                return reject(new Error("DATABASE_ERROR"));
            }
            resolve(row);
        });
    });
};






