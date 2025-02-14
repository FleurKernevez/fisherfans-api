'use strict';

const { database } = require('../tables.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Créer un nouvel utilisateur 
 */
exports.createUser = function (userData) {
  return new Promise((resolve, reject) => {
    // Hacher le mot de passe
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    userData.password = hashedPassword;

    // Vérification des champs professionnels
    if (userData.status === "professionnel") {
      const professionalFields = ['SIRETNumber', 'RCNumber', 'companyName'];
      const missingProfessionalFields = professionalFields.filter(field => !userData[field]);

      if (missingProfessionalFields.length > 0) {
        return reject({ message: `Les professionnels doivent fournir : ${missingProfessionalFields.join(', ')}`, code: "MISSING_PROFESSIONAL_FIELDS" });
      }
    } else {
      // Si l'utilisateur est particulier, vider ces champs pour éviter les incohérences
      userData.SIRETNumber = null;
      userData.RCNumber = null;
      userData.companyName = null;
    }

    const fields = ["lastname", "firstname", "birthdate", "email", "password", "phoneNumber", "address", "status", "SIRETNumber", "RCNumber", "companyName"];
    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO user (${fields.join(", ")}) VALUES (${placeholders});`;
    const values = fields.map(field => userData[field] || null);

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
};



/**
 * Connexion de l'utilisateur
 */
exports.login = function (email, password) {
  return new Promise((resolve, reject) => {
    // Vérifier si l'utilisateur existe dans la base de données
    const query = `SELECT * FROM user WHERE email = ?`;

    database.get(query, [email], (err, user) => {
      if (err) {
        return reject({ message: "Erreur lors de la connexion", code: "DB_ERROR" });
      }
      if (!user) {
        return reject({ message: "Utilisateur non trouvé.", code: "USER_NOT_FOUND" });
      }

      // Vérifier le mot de passe haché
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return reject({ message: "Mot de passe incorrect.", code: "INVALID_PASSWORD" });
      }

      // Générer un token JWT valide
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET, // Clé secrète définie dans .env
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Expiration par défaut de 1h
      );

      // Retourner le token et l'utilisateur connecté
      resolve({ token, user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname } });
    });
  });
};


/**
 * Récupérer un utilisateur par email pour la connexion
 */
exports.getUserByEmail = function (email) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user WHERE email = ?`;

    database.get(query, [email], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row); // Retourne l'utilisateur trouvé ou `null` si aucun résultat
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
      resolve(row);
    });
  });
};


/**
 * Récupérer TOUS les utilisateurs (sans filtre)
 */
exports.getAllUsers = function () {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user`;

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
    // Vérifier si l'utilisateur a des réservations actives
    const checkReservationsQuery = `SELECT COUNT(*) AS count FROM reservation WHERE user_id = ?`;

    database.get(checkReservationsQuery, [id], (err, result) => {
      if (err) {
        return reject({ message: "Erreur lors de la vérification des réservations.", code: "DB_ERROR" });
      }

      if (result.count > 0) {
        return reject({ message: "Impossible de supprimer l'utilisateur car il a des réservations actives.", code: "USER_HAS_RESERVATIONS" });
      }

      // Si pas de réservation, anonymisation des données
      const anonymizedData = {
        lastname: "Anonyme",
        firstname: "Utilisateur",
        birthdate: null,
        email: `anonymous_${id}@fisherfans.com`,
        password: "deleted_user",
        phoneNumber: null,
        address: null,
        postalCode: null,
        city: null,
        languagesSpoken: null,
        insuranceNumber: null,
        boatLicenceNumber: null,
        status: "particulier",
        activityType: null,
        urlUserPicture: null,
        SIRETNumber: null,
        RCNumber: null,
        companyName: null,
        isDeleted: true
      };

      const updateFields = Object.keys(anonymizedData).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(anonymizedData), id];

      const query = `UPDATE user SET ${updateFields} WHERE id = ?`;

      database.run(query, values, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ affectedRows: this.changes });
      });
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


/**
 * Récupérer toutes les réservations d'un utilisateur
 */
exports.getUserReservations = function (user_id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM reservation WHERE user_id = ?`;

    database.all(query, [user_id], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};





