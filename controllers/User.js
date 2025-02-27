'use strict';

const utils = require('../utils/writer.js');
const User = require('../service/UserService.js');
const bcrypt = require('bcryptjs');

// Créer un utilisateur 
exports.createUser = function createUser(req, res) {
  console.log("DEBUG: Données utilisateur reçues:", req.body);

  const userData = req.body;

  // Vérifier si le mot de passe est fourni et valide
  if (!userData.password || typeof userData.password !== "string") {
    return res.status(400).json({
      message: "Le mot de passe est requis et doit être une chaîne de caractères.",
      code: "MISSING_PASSWORD"
    });
  }

  // Hachage du mot de passe
  try {
    userData.password = bcrypt.hashSync(userData.password, 10);
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    return res.status(500).json({
      message: "Erreur interne lors du hachage du mot de passe.",
      code: "HASHING_ERROR"
    });
  }

  // Vérification des champs professionnels
  if (userData.status === "professionnel") {
    const requiredFields = ['SIRETNumber', 'RCNumber', 'companyName'];
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Les professionnels doivent fournir : ${missingFields.join(', ')}`,
        code: "MISSING_PROFESSIONAL_FIELDS"
      });
    }
  } else {
    // Nettoyer les champs inutiles pour un particulier
    userData.SIRETNumber = null;
    userData.RCNumber = null;
    userData.companyName = null;
  }

  // Appeler le service pour insérer l'utilisateur
  User.createUser(userData)
    .then(createdUser => {
      return res.status(201).json({
        message: "Utilisateur créé avec succès.",
        id: createdUser.id
      });
    })
    .catch(error => {
      console.error("Erreur lors de la création de l'utilisateur :", error);
    
      // Vérifie si l'erreur a un code personnalisé
      const statusCode = error.status || 500;
      
      return res.status(statusCode).json({
        message: error.message || "Erreur interne du serveur.",
        code: error.code || "SERVER_ERROR"
      });
    });
};


// Connexion de l'utilisateur
module.exports.login = function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  User.login(email, password)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      if (error.code === "USER_NOT_FOUND" || error.code === "INVALID_PASSWORD") {
        return res.status(401).json({ error: error.message });
      }
      console.error("Erreur lors de la connexion :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


// Récupérer un utilisateur par son ID 
exports.getUserById = function (req, res) {
  const userId = req.user ? req.user.id : req.params.id; // Récupère l'ID depuis le token JWT ou l'URL

  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur requis.", code: "MISSING_USER_ID" });
  }

  User.getUserById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé.", code: "USER_NOT_FOUND" });
      }
      return res.status(200).json(user);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return res.status(500).json({
        message: "Erreur interne du serveur.",
        code: "SERVER_ERROR"
      });
    });
};


// Récupérer tous les utilisateurs (sans filtre)
module.exports.getAllUsers = function getAllUsers(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token

  User.getAllUsers(userId)
    .then(users => {
      res.status(200).json({
        success: true,
        message: "Liste des utilisateurs récupérée avec succès.",
        data: users
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs :", error.message);
      res.status(500).json({ success: false, error: "Erreur interne du serveur." });
    });
};


// Récupérer les utilisateurs avec filtres (firstname, lastname, status, activityType)
module.exports.getAllUsersByFilter = function getAllUsersByFilter(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token
  const filters = req.query; // Récupération des filtres passés en query parameters

  User.getAllUsersByFilter(filters, userId)
    .then(users => {
      res.status(200).json({
        success: true,
        message: "Liste des utilisateurs filtrée avec succès.",
        data: users
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des utilisateurs filtrés :", error.message);
      res.status(500).json({ success: false, error: "Erreur interne du serveur." });
    });
};


// Supprimer un utilisateur 
module.exports.deleteUser = function deleteUser(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token

  if (!userId) {
    return res.status(400).json({ error: "ID utilisateur introuvable dans le token." });
  }

  User.deleteUser(userId)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé ou déjà supprimé." });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la suppression de l'utilisateur :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


// Mettre à jour les informations d'un utilisateur
module.exports.majUser = function majUser(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token
  const updatedData = req.body; // Récupération des nouvelles données depuis le body

  if (!userId) {
    return res.status(400).json({ error: "ID utilisateur introuvable dans le token." });
  }

  User.majUser(userId, updatedData)
    .then(response => {
      if (response.affectedRows === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé ou aucune donnée mise à jour." });
      }
      res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};


// Récupérer toutes les réservations de l'utilisateur connecté
module.exports.getUserReservations = function getUserReservations(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token

  if (!userId) {
    return res.status(400).json({ error: "ID utilisateur introuvable dans le token." });
  }

  User.getUserReservations(userId)
    .then(reservations => {
      res.status(200).json(reservations);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des réservations :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};




