'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

/**
 * Fonction pour créer un utilisateur 
 */
module.exports.createUser = function createUser(req, res) {
  const userData = req.body;

  // Validation des données requises
  const requiredFields = ['email', 'password', 'lastname', 'firstname', 'birthdate', 'phoneNumber'];
  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Les champs suivants sont obligatoires : ${missingFields.join(', ')}` });
  }

  User.createUser(userData)
    .then(response => {
      console.log('Utilisateur créé avec succès.');
      res.status(201).json({ id: response.id, message: 'Utilisateur créé avec succès.' });
    })
    .catch(error => {
      if (error.code === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({ error: error.message }); // 409 Conflict : Email déjà utilisé
      }
      console.error('Erreur lors de la création de l’utilisateur :', error.message);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    });
};



/**
 * Fonction pour récupérer un utilisateur par son ID
 */
module.exports.getUserById = function getUserById(req, res) {
  const { id } = req.params; // Récupération de l'ID depuis l'URL

  if (!id) {
    return res.status(400).json({ error: "L'ID de l'utilisateur est requis." });
  }

  User.getUserById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



/**
 * Fonction pour récupérer tous les utilisateurs (sans filtre)
 */
module.exports.getAllUsers = function getAllUsers(req, res) {
  User.getAllUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



/**
 * Récupérer les utilisateurs avec filtres (firstname, lastname, status, activityType)
 */
module.exports.getAllUsersByFilter = function getAllUsersByFilter(req, res) {
  const filters = req.query; // Récupération des filtres passés en query parameters

  User.getAllUsersByFilter(filters)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs filtrés :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



/**
 * Fonction pour supprimer un utilisateur
 */
module.exports.deleteUser = function deleteUser(req, res) {
  const { id } = req.params; //Récupération de l'ID de l'utilisateur depuis l'URL

  if (!id) {
    return res.status(400).json({ error: "L'ID de l'utilisateur est requis." });
  }

  User.deleteUser(id)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la suppression de l'utilisateur :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



/**
 * Fonction pour mettre à jour les informations d'un utilisateur
 */
module.exports.majUser = function majUser(req, res) {
  const { id } = req.params; //Récupération de l'ID de l'utilisateur depuis l'URL
  const updatedData = req.body; // Récupération des données mises à jour depuis le body

  if (!id) {
    return res.status(400).json({ error: "L'ID de l'utilisateur est requis." });
  }

  User.majUser(id, updatedData)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
      res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


