'use strict';

const sqlite3 = require('sqlite3').verbose();

var utils = require('../utils/writer.js');
var Boat = require('../service/BoatService');

// Connexion à la base de données SQLite
const database = new sqlite3.Database('./fisher-fans.db', (err) => {
  if (err) {
      console.error('Erreur lors de la connexion à la base de données :', err.message);
  } else {
      console.log('Connexion réussie à la base de données SQLite.');
  }
});

// Fonction pour récupérer la liste des bateaux
module.exports.boatDatas = function boatDatas(req, res) {
  const query = 'SELECT * FROM boat'; // Requête SQL pour récupérer les données

  database.all(query, [], (err, rows) => {
      if (err) {
          console.error('Erreur lors de la récupération des données des bateaux :', err.message);
          res.status(500).send('Erreur interne du serveur.');
      } else {
          console.log('Données des bateaux récupérées avec succès.');
          res.status(200).json(rows); // Retourne les données sous forme de JSON
      }
  });
};

// Fonction pour récupérer la liste des bateaux filtrés selon leurs caractéristiques
module.exports.getFilteredBoats = function(req, res) {
  const filters = req.query;
  console.log('filters', filters);

  Boat.getFilteredBoats(filters)
    .then(boats => {
      res.json(boats);
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });  // Gérer les erreurs
    });
};

// Fonction pour créer un bateau
module.exports.createBoat = function createBoat(req, res) {
  const { name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id } = req.body;

  // Validation des données
  if (!name || !brand || !productionYear || !licenceType || !type || !cautionAmount || !capacityMax || !bedsNumber || !homePort || !latitude1 || !longitude1 || !latitude2 || !longitude2 || !engineType || !enginePower || !user_id) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  const query = `
    INSERT INTO boat (name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment, cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower, user_id];

  database.run(query, values, function(err) {
    console.log(req.body)
    if (err) {
      console.error('Erreur lors de la création du bateau :', err.message);
      res.status(500).send('Erreur interne du serveur.');
    } else {
      console.log('Bateau créé avec succès.');
      res.status(201).json({ id: this.lastID, message: 'Bateau créé avec succès.' });
    }
  });
}

// Fonction pour supprimer un bateau
module.exports.deleteBoat = (req, res, next) => {
  const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête

  // Vérification si l'ID est fourni et valide
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "L'identifiant du bateau est requis et doit être un nombre valide.",
    });
  }

  // Appel à la méthode de suppression du bateau
  Boat.deleteBoat(id)
    .then(response => {
      if (!response || response.affectedRows === 0) {
        // Vérification si aucun bateau n'a été supprimé
        return res.status(404).json({
          success: false,
          message: `Aucun bateau trouvé avec l'identifiant ${id}.`,
        });
      }

      // Réponse réussie : renvoyer un message de confirmation
      res.status(200).json({
        success: true,
        message: `Le bateau avec l'identifiant ${id} a été supprimé avec succès.`,
        data: response,
      });
    })
    .catch(error => {
      console.error("Erreur lors de la suppression du bateau :", error);
      // Réponse en cas d'erreur serveur
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la suppression du bateau.",
        error: error.message || error,
      });
    });
};

 // Fonction pour mettre à jour les données d'un bateau
module.exports.majBoat = function updateBoat(req, res) {
  const { id } = req.params; // Récupération de l'ID depuis les paramètres de l'URL
  const updates = req.body; // Données de mise à jour depuis le corps de la requête

  // Vérifier que l'ID est valide et que des données sont fournies
  if (!id || isNaN(id)) {
    return utils.writeJson(res, {
      success: false,
      message: "L'identifiant du bateau est requis et doit être un nombre valide.",
    }, 400);
  }

  if (!updates || Object.keys(updates).length === 0) {
    return utils.writeJson(res, {
      success: false,
      message: "Aucune donnée de mise à jour n'a été fournie.",
    }, 400);
  }

  // Appel au service pour mettre à jour le bateau
  Boat.updateBoat(id, updates)
    .then((response) => {
      if (response.affectedRows === 0) {
        // Aucun bateau mis à jour (ID inexistant)
        return utils.writeJson(res, {
          success: false,
          message: `Aucun bateau trouvé avec l'identifiant ${id}.`,
        }, 404);
      }

      // Succès
      utils.writeJson(res, {
        success: true,
        message: `Le bateau avec l'identifiant ${id} a été mis à jour avec succès.`,
        affectedRows: response.affectedRows,
      }, 200);
    })
    .catch((error) => {
      console.error("Erreur lors de la mise à jour du bateau :", error);
      utils.writeJson(res, {
        success: false,
        message: "Une erreur est survenue lors de la mise à jour du bateau.",
        error: error.message || error,
      }, 500);
    });
};

module.exports.getBoatsInBoundingBox = function(req, res) {
  const { minLatitude, maxLatitude, minLongitude, maxLongitude } = req.query;

  // Vérifier que toutes les coordonnées sont fournies
  if (
    minLatitude === undefined || maxLatitude === undefined ||
    minLongitude === undefined || maxLongitude === undefined
  ) {
    return utils.writeJson(res, {
      success: false,
      message: "Les paramètres minLatitude, maxLatitude, minLongitude et maxLongitude sont requis.",
    }, 400);
  }

  // Appel au service pour récupérer les bateaux
  Boat.getBoatsInBoundingBox(
    parseFloat(minLatitude),
    parseFloat(maxLatitude),
    parseFloat(minLongitude),
    parseFloat(maxLongitude)
  )
    .then((boats) => {
      utils.writeJson(res, {
        success: true,
        message: "Liste des bateaux récupérée avec succès.",
        data: boats,
      }, 200);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des bateaux :", error);
      utils.writeJson(res, {
        success: false,
        message: "Une erreur est survenue lors de la récupération des bateaux.",
        error: error.message || error,
      }, 500);
    });
};