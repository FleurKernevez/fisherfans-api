'use strict';

const utils = require('../utils/writer.js');
const User = require('../service/UserService.js');

/**
 * Fonction pour créer un utilisateur 
 */
module.exports.createUser = function createUser(req, res) {
  const userData = req.body;

  // Validation des données requises
  const requiredFields = ['email', 'password', 'lastname', 'firstname', 'birthdate', 'phoneNumber', 'status'];
  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Les champs suivants sont obligatoires : ${missingFields.join(', ')}` });
  }

  // Vérification des champs pour les professionnels
  if (userData.status === "professionnel") {
    const professionalFields = ['SIRETNumber', 'RCNumber', 'companyName'];
    const missingProfessionalFields = professionalFields.filter(field => !userData[field]);

    if (missingProfessionalFields.length > 0) {
      return res.status(400).json({ error: `Les professionnels doivent fournir : ${missingProfessionalFields.join(', ')}` });
    }
  } else {
    // Si l'utilisateur est particulier, vider ces champs pour éviter les incohérences
    userData.SIRETNumber = null;
    userData.RCNumber = null;
    userData.companyName = null;
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
 * Connexion de l'utilisateur
 */
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


/**
 * Fonction pour récupérer un utilisateur par son ID (extrait du token JWT)
 */
module.exports.getUserById = function getUserById(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token

  if (!userId) {
    return res.status(400).json({ error: "ID utilisateur introuvable dans le token." });
  }

  User.getUserById(userId)
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
 * Récupérer tous les utilisateurs (sans filtre)
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
 * Supprimer un utilisateur
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
 * Mettre à jour les informations d'un utilisateur
 */
exports.majUser = function majUser(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token
  const updatedData = req.body; // Récupération des nouvelles données depuis le body

  if (!userId) {
    return res.status(400).json({ error: "ID utilisateur introuvable dans le token." });
  }

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
    return res.status(400).json({ error: "Aucune donnée valide à mettre à jour." });
  }

  values.push(userId); // Ajout de l'ID pour la clause WHERE
  const query = `UPDATE user SET ${updates.join(", ")} WHERE id = ?`;

  database.run(query, values, function (err) {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
    res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
  });
};



/**
 * Récupérer toutes les réservations d'un utilisateur
 */
module.exports.getUserReservations = function getUserReservations(req, res) {
  const user_id = req.params.id; // Récupérer l'ID de l'utilisateur depuis l'URL

  if (!user_id) {
    return res.status(400).json({ error: "L'ID de l'utilisateur est requis." });
  }

  Reservation.getUserReservations(user_id)
    .then(reservations => {
      res.status(200).json(reservations);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des réservations :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};



