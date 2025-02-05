'use strict';

const { database } = require('../tables.js');

/**
 * Créer un nouvel utilisateur 
 */
exports.createUser = function (userData) {
  return new Promise((resolve, reject) => {
    // Vérifier si l'email existe déjà avant l'insertion
    const checkQuery = `SELECT id FROM user WHERE email = ?`;
    database.get(checkQuery, [userData.email], (err, row) => {
      if (err) {
        return reject(err);
      }
      if (row) {
        return reject({ message: `L'email ${userData.email} est déjà enregistré.`, code: "EMAIL_ALREADY_EXISTS" });
      }

      // Liste des champs attendus dans la table "user"
      const fields = [
        "lastname", "firstname", "birthdate", "email", "password", "phoneNumber", "address",
        "postalCode", "city", "languagesSpoken", "insuranceNumber", "boatLicenceNumber",
        "status", "activityType", "urlUserPicture", "SIRETNumber", "RCNumber", "companyName",
        "boatTrip_id", "reservation_id"
      ]; 

      // Générer les placeholders pour la requête SQL
      const placeholders = fields.map(() => "?").join(", ");
      const query = `INSERT INTO user (${fields.join(", ")}) VALUES (${placeholders});`;

      // Construire les valeurs pour la requête
      const values = fields.map(field => userData[field] || null);

      // Exécuter la requête SQL pour insérer l'utilisateur
      database.run(query, values, function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed: user.email")) {
            return reject({ message: `L'email ${userData.email} est déjà enregistré.`, code: "EMAIL_ALREADY_EXISTS" });
          }
          return reject(err);
        }
        resolve({ id: this.lastID });
      });
    });
  });
};



/**
 * Récupérer un utilisateur par son ID
 */
exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user WHERE id = ?`;

    database.get(query, [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row); // Retourne l'utilisateur trouvé ou `null` si aucun résultat
    });
  });
};



/**
 * Récupérer TOUS les utilisateurs (sans filtre)
 */
exports.getAllUsers = function () {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user`; // Récupère toutes les colonnes

    database.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};



/**
 * Récupérer les utilisateurs avec filtres (firstname, lastname, status, activityType)
 */
exports.getAllUsersByFilter = function (filters) {
  return new Promise((resolve, reject) => {
    const allowedFilters = ["firstname", "lastname", "status", "activityType"];
    const whereClauses = [];
    const values = [];

    Object.keys(filters).forEach(key => {
      if (allowedFilters.includes(key) && filters[key]) {
        whereClauses.push(`${key} = ?`);
        values.push(filters[key]);
      }
    });

    let query = `SELECT * FROM user`; //Récupère toutes les colonnes

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    database.all(query, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};



/**
 * Supprimer un utilisateur
 */
exports.deleteUser = function (id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM user WHERE id = ?`;

    database.run(query, [id], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ affectedRows: this.changes });
    });
  });
};


/**
 * Mettre à jour les données d'un utilisateur
 */
exports.majUser = function (id, updatedData) {
  return new Promise((resolve, reject) => {
    const allowedFields = [
      "lastname", "firstname", "birthdate", "phoneNumber", "address", "postalCode", "city",
      "languagesSpoken", "urlUserPicture", "boatLicenceNumber", "insuranceNumber", "status",
      "companyName", "activityType", "SIRETNumber", "RCNumber"
    ];

    const updates = [];
    const values = [];

    Object.keys(updatedData).forEach(key => {
      if (allowedFields.includes(key) && updatedData[key]) {
        updates.push(`${key} = ?`);
        values.push(updatedData[key]);
      }
    });

    if (updates.length === 0) {
      return reject({ message: "Aucune donnée valide à mettre à jour." });
    }

    values.push(id); // Ajouter l'ID à la fin pour la clause WHERE
    const query = `UPDATE user SET ${updates.join(", ")} WHERE id = ?`;

    database.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ affectedRows: this.changes });
    });
  });
};




