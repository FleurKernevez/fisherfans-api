'use strict';

const utils = require('../utils/writer.js');
const Boat = require('../service/BoatService');
const User = require('../service/UserService.js')
// Liste des équipements autorisés
const VALID_EQUIPMENT = ['sondeur', 'vivier', 'échelle', 'GPS', 'porte-cannes', 'radio VHF'];


// Créer un bateau 
module.exports.createBoat = function createBoat(req, res) {
  const user_id = req.user.id;

  // Vérifier si l'utilisateur a un numéro de permis bateau
  User.getUserById(user_id)
    .then(user => {
      if (!user || !user.boatLicenceNumber) {
        return utils.writeJson(res, {
          success: false,
          errorCode: "MISSING_LICENSE",
          message: "Vous devez renseigner un numéro de permis bateau pour créer un bateau."
        }, 403);
      }

      const {
        name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment,
        cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2, engineType, enginePower
      } = req.body;

      let selectedEquipments = [];
      if (equipment) {
        if (Array.isArray(equipment)) {
          selectedEquipments = equipment.filter(equip => VALID_EQUIPMENT.includes(equip));
        } else if (typeof equipment === 'string') {
          selectedEquipments = equipment.split(',').map(e => e.trim()).filter(equip => VALID_EQUIPMENT.includes(equip));
        }

        if (selectedEquipments.length !== (Array.isArray(equipment) ? equipment.length : equipment.split(',').length)) {
          return utils.writeJson(res, {
            success: false,
            errorCode: "INVALID_EQUIPMENT",
            message: "Certains équipements sélectionnés ne sont pas valides."
          }, 400);
        }
      }

      // Création du bateau
      Boat.createBoat({
        name, description, brand, productionYear, urlBoatPicture, licenceType, type, equipment: selectedEquipments.join(','),
        cautionAmount, capacityMax, bedsNumber, homePort, latitude1, longitude1, latitude2, longitude2,
        engineType, enginePower, user_id
      })
        .then(response => utils.writeJson(res, { id: response.id, message: 'Bateau créé avec succès.' }, 201))
        .catch(error => {
          console.error('Erreur lors de la création du bateau :', error);
          utils.writeJson(res, {
            success: false,
            errorCode: "DATABASE_ERROR",
            message: "Erreur interne du serveur."
          }, 500);
        });

    })
    .catch(error => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      utils.writeJson(res, {
        success: false,
        errorCode: "DATABASE_ERROR",
        message: "Erreur interne du serveur."
      }, 500);
    });
};


// Récupérer la liste de tous les bateaux de l'utilisateur connecté
module.exports.boatDatas = function boatDatas(req, res) {
  Boat.getAllBoats()
    .then(boats => {
      if (!boats || boats.length === 0) {
        console.warn("Aucun bateau trouvé en base.");
        return utils.writeJson(res, {
          success: false,
          errorCode: "NO_BOATS_FOUND",
          message: "Aucun bateau n'existe actuellement en base."
        }, 404);
      }

      utils.writeJson(res, {
        success: true,
        message: "Liste des bateaux récupérée avec succès.",
        data: boats
      }, 200);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des bateaux :", error.message);
      utils.writeJson(res, {
        success: false,
        errorCode: "DATABASE_ERROR",
        message: "Erreur interne du serveur lors de la récupération des bateaux."
      }, 500);
    });
};


// Récupérer la liste filtrée des bateaux 
module.exports.getFilteredBoats = function getFilteredBoats(req, res) {
  const filters = req.query; // Récupérer les filtres depuis la requête

  Boat.getFilteredBoats(filters)
    .then(boats => {
      if (!boats || boats.length === 0) {
        console.warn("Aucun bateau trouvé avec ces filtres :", filters);
        return utils.writeJson(res, {
          success: false,
          errorCode: "NO_RESULTS",
          message: "Aucun bateau ne correspond aux filtres fournis.",
          filters: filters
        }, 404);
      }

      utils.writeJson(res, {
        success: true,
        message: "Liste des bateaux récupérée avec succès.",
        data: boats
      }, 200);
    })
    .catch(error => {
      console.log("Une erreur interne s'est produite !", error);
      utils.writeJson(res, {
        success: false,
        errorCode: "DATABASE_ERROR",
        message: "Une erreur interne du serveur s'est produite."
      }, 500);
    });
};


// Récupérer les bateaux dans une zone géographique donnée
module.exports.getBoatsInBoundingBox = function (req, res) {
  const { minLatitude, maxLatitude, minLongitude, maxLongitude } = req.query;

  if (minLatitude === undefined || maxLatitude === undefined || minLongitude === undefined || maxLongitude === undefined) {
    return utils.writeJson(res, {
      success: false,
      errorCode: "MISSING_PARAMETERS",
      message: "Les paramètres minLatitude, maxLatitude, minLongitude et maxLongitude sont requis."
    }, 400);
  }

  Boat.getBoatsInBoundingBox(parseFloat(minLatitude), parseFloat(maxLatitude), parseFloat(minLongitude), parseFloat(maxLongitude))
    .then(boats => utils.writeJson(res, {
      success: true, message: "Liste des bateaux récupérée avec succès.",
      data: boats
    }, 200))
    .catch(error => {
      console.error("Erreur lors de la récupération des bateaux :", error);
      utils.writeJson(res, {
        success: false,
        errorCode: "DATABASE_ERROR",
        message: "Une erreur est survenue lors de la récupération des bateaux."
      }, 500);
    });
};


// Récupérer les bateaux d'un user
module.exports.getBoatsByUserId = function (req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token

  // Vérification de l'ID utilisateur (juste une sécurité supplémentaire)
  if (!userId) {
    return utils.writeJson(res, {
      success: false,
      errorCode: "MISSING_USER_ID",
      message: "L'ID utilisateur est introuvable dans le token d'authentification."
    }, 400);
  }

  // Appel au service pour récupérer les bateaux de l'utilisateur
  Boat.getBoatsByUserId(userId)
    .then(boats => {
      if (!boats || boats.length === 0) {
        console.warn(`Aucun bateau trouvé pour l'utilisateur ID: ${userId}`);
        return utils.writeJson(res, {
          success: false,
          errorCode: "NO_BOATS_FOUND",
          message: "Aucun bateau trouvé pour cet utilisateur."
        }, 404);
      }

      utils.writeJson(res, {
        success: true,
        message: "Liste des bateaux récupérée avec succès.",
        data: boats
      }, 200);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des bateaux :", error);
      utils.writeJson(res, {
        success: false,
        errorCode: "DATABASE_ERROR",
        message: "Erreur interne du serveur lors de la récupération des bateaux."
      }, 500);
    });
};


// Supprimer un bateau
module.exports.deleteBoat = async function (req, res) {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    // Vérification que l'ID est valide
    if (!id || isNaN(id)) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "INVALID_BOAT_ID",
        message: "L'identifiant du bateau est requis et doit être un nombre valide."
      }, 400);
    }

    // Vérifier que le user est le bon
    const boat = await Boat.getBoatById(id);
    if (!boat) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "BOAT_NOT_FOUND",
        message: "Bateau non trouvé."
      }, 404);
    }

    if (boat.user_id !== user_id) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "FORBIDDEN",
        message: "Accès interdit : vous n'êtes pas le propriétaire de ce bateau."
      }, 403);
    }

    // Suppression 
    Boat.deleteBoat(id)
      .then(response => {
        if (!response || response.affectedRows === 0) {
          return utils.writeJson(res, {
            success: false,
            errorCode: "BOAT_NOT_FOUND",
            message: `Aucun bateau trouvé avec l'identifiant ${id}.`
          }, 404);
        }
        return utils.writeJson(res, {
          success: true,
          message: `Le bateau avec l'identifiant ${id} a été supprimé avec succès.`
        }, 200);
      })
      .catch(error => {
        utils.writeJson(res, {
          success: false,
          errorCode: "DATABASE_ERROR",
          message: "Une erreur est survenue lors de la suppression du bateau.",
          details: error.message || error
        }, 500);
      });

  } catch (error) {
    utils.writeJson(res, {
      success: false,
      errorCode: "DATABASE_ERROR",
      message: "Une erreur est survenue lors de la vérification du bateau.",
      details: error.message || error
    }, 500);
  }
};


// Mettre à jour les données d'un bateau
module.exports.majBoat = async function updateBoat(req, res) {
  try {
    const user_id = req.user.id; // ID de l'utilisateur authentifié
    const { id } = req.params; // ID du bateau à mettre à jour
    const updates = req.body; // Données de mise à jour

    // Vérification que l'ID est valide et que des données sont fournies
    if (!id || isNaN(id)) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "INVALID_BOAT_ID",
        message: "L'identifiant du bateau est requis et doit être un nombre valide."
      }, 400);
    }

    if (!updates || Object.keys(updates).length === 0) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "MISSING_UPDATE_DATA",
        message: "Aucune donnée de mise à jour n'a été fournie."
      }, 400);
    }

    // Récupérer le bateau et vérifier qu'il appartient bien à l'utilisateur
    const boat = await Boat.getBoatById(id);
    if (!boat) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "BOAT_NOT_FOUND",
        message: "Bateau non trouvé."
      }, 404);
    }

    if (boat.user_id !== user_id) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "FORBIDDEN",
        message: "Accès interdit : vous n'êtes pas le propriétaire de ce bateau."
      }, 403);
    }

    // Appel au service pour mettre à jour le bateau
    const response = Boat.updateBoat(id, updates);

    if (response.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucun bateau trouvé avec l'identifiant ${id}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Le bateau avec l'identifiant ${id} a été mis à jour avec succès.`,
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du bateau :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du bateau.",
      error: error.message || error,
    });
  }
};







