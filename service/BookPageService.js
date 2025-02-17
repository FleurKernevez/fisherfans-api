'use strict';

const { database } = require('../tables.js');

/**
 * Ajouter une page (BookPage) à un FishingBook
 */
exports.createBookPage = function (fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id) {
    return new Promise((resolve, reject) => {
        // Vérifier si le FishingBook appartient bien à l'utilisateur
        const checkFishingBookQuery = `SELECT id FROM fishingBook WHERE id = ? AND user_id = ?`;

        database.get(checkFishingBookQuery, [fishingBook_id, user_id], (err, row) => {
            if (err) {
                return reject(new Error("Erreur lors de la vérification du FishingBook"));
            }

            if (!row) {
                return reject(new Error("Ce FishingBook ne vous appartient pas ou n'existe pas."));
            }

            // Insérer la nouvelle page dans le FishingBook
            const insertBookPageQuery = `
                INSERT INTO bookPage (fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            database.run(insertBookPageQuery, [fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id], function (err) {
                if (err) {
                    console.error("ERREUR SQL :", err.message);
                    return reject(new Error("Erreur lors de l'ajout de la page dans le FishingBook"));
                }

                resolve({
                    message: "Page ajoutée au FishingBook avec succès.",
                    bookPageId: this.lastID,
                    fishingBook_id,
                    fishName,
                    fishingDate
                });
            });
        });
    });
};



/**
 * Récupérer toutes les pages du carnet de pêche d’un utilisateur (BF19)
 */
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



/**
 * Supprimer une page du FishingBook 
 */
exports.deleteBookPage = function (bookPageId, user_id) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM bookPage WHERE id = ? AND user_id = ?`;
        database.run(query, [bookPageId, user_id], function (err) {
            if (err) {
                return reject(new Error("Erreur lors de la suppression de la page"));
            }
            if (this.changes === 0) {
                return reject(new Error("Aucune page trouvée ou non autorisée"));
            }
            resolve({ message: "Page supprimée avec succès" });
        });
    });
};


/**
 * Modifier une page du FishingBook (BF16)
 */
exports.updateBookPage = function (bookPageId, userId, updatedData) {
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

        values.push(bookPageId, userId);
        const query = `UPDATE bookPage SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;

        database.run(query, values, function (err) {
            if (err) {
                return reject(new Error("Erreur lors de la modification de la page"));
            }
            resolve({ affectedRows: this.changes });
        });
    });
};



/**
 * Modifier une page donnée du carnet de pêche d’un utilisateur donné (BF18)
 */
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
                return reject(new Error("Erreur lors de la modification de la page spécifique"));
            }
            resolve({ affectedRows: this.changes });
        });
    });
};







