'use strict';

const sqlite3 = require('sqlite3').verbose();
var utils = require('../utils/writer.js');

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
 * Fonction pour créer un voyage en bateau 
 * L’API FF devra interdire la création d’une sortie pêche aux utilisateurs
ne possédant pas de bateau
 */
module.exports.createBoatTrip = function createBoatTrip (
  req, 
  res, 
  next
) {

  const db = getDatabase();

  // Vérifier si l'utilisateur a un permis
  const checkUserQuery = 'SELECT boatLicenceNumber FROM user WHERE id = ?';
  db.get(checkUserQuery, [req.body.user_id], (checkUserErr, userRow) => {
    if (checkUserErr) {
        console.error("Erreur lors de la vérification du permis utilisateur :", checkUserErr);
        return utils.writeJson(res, { message: "Erreur interne" }, 500);
    }

      if (!userRow) {
          return utils.writeJson(res, { message: "Utilisateur non trouvé" }, 404);
      }

      if (!userRow.boatLicenceNumber) { 
          return utils.writeJson(res, { message: "L'utilisateur ne possède pas de permis pour créer un voyage en bateau." }, 403); // 403 Forbidden
      }

      // Si l'utilisateur a un permis, créer le voyage
      const insertBoatTripQuery = `
          INSERT INTO boatTrip (title, practicalInformation, type, priceType, startDate, endDate, passengersNumber, price, user_id, boat_id, reservation_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertBoatTripQuery, [
        req.body.title, 
        req.body.practicalInformation, 
        req.body.type, 
        req.body.priceType, 
        req.body.startDate, 
        req.body.endDate, 
        req.body.passengersNumber, 
        req.body.price,
        req.body.user_id, 
        req.body.boat_id, 
        req.body.reservation_id
      ], function (insertErr) {
        if (insertErr) {
            console.error("Erreur lors de la création du voyage en bateau :", insertErr);
            return utils.writeJson(res, { message: "Erreur interne" }, 500);
        }

          // 3. Récupérer le voyage créé
          const lastID = this.lastID;
          const getBoatTripQuery = 'SELECT * FROM boatTrip WHERE id = ?';
          db.get(getBoatTripQuery, [lastID], (getBoatTripErr, boatTripRow) => {
              if (getBoatTripErr) {
                  console.error("Erreur lors de la récupération du voyage créé :", getBoatTripErr);
                  return next(getBoatTripErr);
              }
              utils.writeJson(res, boatTripRow, 201);
          });
      });
  });
};

/**
 * Fonction pour supprimer un voyage en bateau
 */
module.exports.deleteBoatTrip = function deleteBoatTrip(req, res, next, id) {
    const db = getDatabase();
    const query = 'SELECT id FROM boatTrip WHERE id = ?';

    // Vérification si l'ID existe
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'ID :", err);
            return utils.writeJson(res, { message: "Erreur interne" }, 500);
        }
        // Requête de suppression
        const queryForDelete = 'DELETE FROM boatTrip WHERE id = ?';
        // Suppression si l'ID existe
        db.run(queryForDelete, [id], function(err) {
            if (err) {
                console.error("Erreur lors de la suppression du voyage en bateau :", err);
                return utils.writeJson(res, { message: "Erreur interne" }, 500);
            }
            if (this.changes === 0) {
                return utils.writeJson(res, { message: "Voyage non trouvé" }, 404);
            }
        
            utils.writeJson(res, { message: "Voyage supprimé avec succès" }, 200);
        });
    });
};

/**
 * Fonction pour récupérer les données d'un voyage en bateau

 */
module.exports.getBoatTrip = function getBoatTrip(req, res, next, id) {
    const db = getDatabase();
    const query = 'SELECT id, title, practicalInformation, type, priceType, startDate, endDate, passengersNumber, price, user_id, boat_id, reservation_id FROM boatTrip WHERE id = ?';

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la récupération du voyage :", err);
            return utils.writeJson(res, { message: "Erreur interne" }, 500);
        }

        if (!row) {
            return utils.writeJson(res, { message: "Voyage non trouvé" }, 404);
        }

        utils.writeJson(res, row, 200);
    });
};

/**
 * BF22 L’API FF devra renvoyer une liste de sorties en filtrant sur un sous- ensemble quelconque des caractéristiques d’une sortie 
 * getBoatTripByParams
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports.getBoatTripByParams = function getBoatTripByParams(req, res, next) {
    const db = getDatabase();

    const {
        user_id, 
        boat_id, 
        title, 
        practicalInformation, 
        type, 
        priceType, 
        startDate, 
        endDate, 
        passengersNumber, 
        price, 
        reservation_id
    } = req.body;

    let query = 'SELECT * FROM boatTrip WHERE 1=1';
    const params = [];

    const filters = {
        user_id,
        boat_id,
        title,
        practicalInformation,
        type,
        priceType,
        startDate,
        endDate,
        passengersNumber,
        price,
        reservation_id
    };

    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
            query += ` AND ${key} = ?`;
            params.push(value);
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des voyages :", err);
            return next(err);
        }
        if (rows.length === 0) {
            return utils.writeJson(res, { message: "Aucun voyage trouvé avec les paramètres fournis" }, 404);
        }
        console.log("Voyages récupérés avec succès :", rows);
        utils.writeJson(res, rows, 200);
    });
}

/**
 * Fonction pour mettre à jour les données d'un voyage en bateau 
 * Si l’API est appelée avec PUT, tous les champs doivent être fournis, sinon ils seront mis à NULL.
 * Dans ce cas, il faut vérifier que req.body contient bien toutes les données attendues.
 */
module.exports.updateBoatTrip = function updateBoatTrip(req, res, next, id) {
    const db = getDatabase();

    if (!id) {
        return utils.writeJson(res, { message: "ID du voyage manquant" }, 400);
    }

    const {
        user_id, 
        boat_id, 
        title, 
        practicalInformation, 
        type, 
        priceType, 
        startDate, 
        endDate, 
        passengersNumber, 
        price, 
        reservation_id
    } = req.body;

    // Vérification : tous les champs doivent être fournis pour un PUT
    if (
        user_id === undefined || boat_id === undefined || title === undefined || practicalInformation === undefined ||
        type === undefined || priceType === undefined || startDate === undefined ||
        endDate === undefined || passengersNumber === undefined || price === undefined || reservation_id === undefined
    ) {
        return utils.writeJson(res, { message: "Tous les champs doivent être fournis pour un PUT" }, 400);
    }

    const queryForUpdateDatas = `
        UPDATE boatTrip
        SET user_id = ?, boat_id = ?, title = ?, practicalInformation = ?, type = ?, priceType = ?, startDate = ?, endDate = ?, passengersNumber = ?, price = ?, reservation_id = ?
        WHERE id = ?
    `;

    db.run(queryForUpdateDatas, [
        user_id, boat_id, title, practicalInformation, type, priceType,
        startDate, endDate, passengersNumber, price, reservation_id, id
    ], function(err) {
        if (err) {
            console.error("Erreur lors de la mise à jour :", err);
            return next(err);
        }

        if (this.changes === 0) {
            return utils.writeJson(res, { message: "Voyage non trouvé ou aucune modification effectuée" }, 404);
        }

        db.get('SELECT * FROM boatTrip WHERE id = ?', [id], (err, updatedRow) => {
            if (err) {
                console.error("Erreur lors de la récupération des données mises à jour :", err);
                return next(err);
            }
            return utils.writeJson(res, updatedRow, 200);
        });
    });
};

/**
 * Fonction pour mettre à jour les données d'un voyage en bateau requête PATCH
 * Avec PATCH, on ne modifie que les champs fournis.
 * Si un champ est absent de req.body, on garde la valeur existante.
 */
    module.exports.updateBoatTrip_1 = function updateBoatTrip(req, res, next, id) {
        const db = getDatabase();
    
        if (!id) {
            return utils.writeJson(res, { message: "ID du voyage manquant" }, 400);
        }
    
        // Vérifier si le voyage existe avant mise à jour
        db.get('SELECT * FROM boatTrip WHERE id = ?', [id], (err, existingRow) => {
            if (err) {
                console.error("Erreur lors de la récupération du voyage :", err);
                return next(err);
            }
            if (!existingRow) {
                return utils.writeJson(res, { message: "Voyage non trouvé" }, 404);
            }
    
            // Fusionner les nouvelles valeurs avec les anciennes
            const updatedData = {
                user_id: req.body.user_id ?? existingRow.user_id,
                boat_id: req.body.boat_id ?? existingRow.boat_id,
                title: req.body.title ?? existingRow.title,
                practicalInformation: req.body.practicalInformation ?? existingRow.practicalInformation,
                type: req.body.type ?? existingRow.type,
                priceType: req.body.priceType ?? existingRow.priceType,
                startDate: req.body.startDate ?? existingRow.startDate,
                endDate: req.body.endDate ?? existingRow.endDate,
                passengersNumber: req.body.passengersNumber ?? existingRow.passengersNumber,
                price: req.body.price ?? existingRow.price,
                reservation_id: req.body.reservation_id ?? existingRow.reservation_id
            };
            const queryForUpdateDatas = `
                UPDATE boatTrip
                SET user_id = ?, boat_id = ?, title = ?, practicalInformation = ?, type = ?, priceType = ?, startDate = ?, endDate = ?, passengersNumber = ?, price = ?, reservation_id = ?
                WHERE id = ?
            `;
    
            db.run(queryForUpdateDatas, [
                updatedData.user_id, updatedData.boat_id, updatedData.title,
                updatedData.practicalInformation, updatedData.type, updatedData.priceType,
                updatedData.startDate, updatedData.endDate, updatedData.passengersNumber,
                updatedData.price, updatedData.reservation_id, id
            ], function(err) {
                if (err) {
                    console.error("Erreur lors de la mise à jour :", err);
                    return next(err);
                }
    
                if (this.changes === 0) {
                    return utils.writeJson(res, { message: "Aucune modification effectuée" }, 400);
                }
    
                db.get('SELECT * FROM boatTrip WHERE id = ?', [id], (err, updatedRow) => {
                    if (err) {
                        console.error("Erreur lors de la récupération des données mises à jour :", err);
                        return next(err);
                    }
                    return utils.writeJson(res, updatedRow, 200);
                });
            });
        });
    };
