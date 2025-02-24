'use strict';

const { database } = require('../tables.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Créer un nouvel utilisateur 
exports.createUser = async function (userData) {
  try {
    console.log("DEBUG: Données utilisateur après vérification:", userData);

    // Vérifier si l'email existe déjà
    const emailExists = await exports.isEmailExists(userData.email);
    if (emailExists) {
      throw { message: `L'email ${userData.email} est déjà utilisé.`, code: "EMAIL_ALREADY_EXISTS" };
    }

    // Définition des champs à insérer
    const fields = [
      "lastname", "firstname", "birthdate", "email", "password", "phoneNumber", "address",
      "postalCode", "city", "languagesSpoken", "insuranceNumber", "boatLicenceNumber",
      "status", "activityType", "urlUserPicture", "SIRETNumber", "RCNumber", "companyName",
      "boatTrip_id", "reservation_id"
    ];

    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO user (${fields.join(", ")}) VALUES (${placeholders});`;

    const values = fields.map(field => userData[field] !== undefined ? userData[field] : null);

    console.log("DEBUG: Exécution SQL ->", query);
    console.log("DEBUG: Valeurs insérées ->", values);

    return new Promise((resolve, reject) => {
      database.run(query, values, function (err) {
        if (err) {
          console.error("Erreur SQL lors de l'insertion de l'utilisateur :", err);
          return reject(new Error("DATABASE_ERROR"));
        }
        console.log("DEBUG: Utilisateur créé avec succès, ID :", this.lastID);
        resolve({ id: this.lastID });
      });
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    throw error;
  }
};


//Connexion de l'utilisateur
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


// Récupérer un utilisateur par email pour la connexion
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


// Récupérer un utilisateur par son ID
exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, lastname, firstname, birthdate, email, phoneNumber, address, postalCode, city,
             languagesSpoken, insuranceNumber, boatLicenceNumber, status, activityType,
             urlUserPicture, SIRETNumber, RCNumber, companyName, boatTrip_id, reservation_id
      FROM user WHERE id = ?`;

    database.get(query, [id], (err, row) => {
      if (err) {
        console.error("Erreur SQL lors de la récupération de l'utilisateur :", err);
        return reject(err);
      }
      resolve(row); // Retourne l'utilisateur ou null si non trouvé
    });
  });
};


// Récupérer TOUS les utilisateurs (sans filtre)
exports.getAllUsers = function (userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, lastname, firstname, birthdate, status, activityType, urlUserPicture, companyName 
      FROM user`; // Exclure email, password, téléphone, adresse, etc.

    database.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};


// Récupérer les utilisateurs avec filtres (firstname, lastname, status, activityType)
exports.getAllUsersByFilter = function (filters, userId) {
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

    let query = `SELECT id, lastname, firstname, birthdate, status, activityType, urlUserPicture, companyName FROM user`;

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


// Supprimer un utilisateur (soft delete : anonymisation des données)
exports.deleteUser = function (userId) {
  return new Promise((resolve, reject) => {
    // Vérifier si l'utilisateur a des réservations actives
    const checkReservationsQuery = `SELECT COUNT(*) AS count FROM reservation WHERE user_id = ?`;

    database.get(checkReservationsQuery, [userId], (err, result) => {
      if (err) {
        return reject({ message: "Erreur lors de la vérification des réservations.", code: "DB_ERROR" });
      }

      if (result.count > 0) {
        return reject({ message: "Impossible de supprimer l'utilisateur car il a des réservations actives.", code: "USER_HAS_RESERVATIONS" });
      }

      // Soft delete : anonymisation des données
      const anonymizedData = {
        lastname: "Anonyme",
        firstname: "Utilisateur",
        birthdate: null,
        email: `anonymous_${userId}@fisherfans.com`,
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
        companyName: null
      };

      const updateFields = Object.keys(anonymizedData).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(anonymizedData), userId];

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


// Mettre à jour les données d'un utilisateur
exports.majUser = function (userId, updatedData) {
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
      return reject({ message: "Aucune donnée valide à mettre à jour.", code: "NO_VALID_DATA" });
    }

    values.push(userId); // Ajouter l'ID pour la clause WHERE
    const query = `UPDATE user SET ${updates.join(", ")} WHERE id = ?`;

    database.run(query, values, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ affectedRows: this.changes });
    });
  });
};


exports.getUserReservations = function (userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM reservation WHERE user_id = ?`;

    database.all(query, [userId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};


// Vérifier si un email existe déjà
exports.isEmailExists = function (email) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM user WHERE email = ?`;

    database.get(query, [email], (err, row) => {
      if (err) {
        return reject(new Error("DATABASE_ERROR"));
      }
      resolve(!!row); // Retourne `true` si l'email existe déjà, sinon `false`
    });
  });
};











