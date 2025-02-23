'use strict';

const utils = require('../utils/writer.js');
const FishingBook = require('../service/FishingBookService.js');

// Créer un FishingBook
module.exports.createFishingBook = function createFishingBook(req, res) {
  try {
    const userId = req.user.id; // ID de l'utilisateur authentifié
    const { title, description } = req.body;

    // Vérifier que le titre et la description sont fournis
    if (!title || !description) {
      return utils.writeJson(res, {
        success: false,
        errorCode: "MISSING_FIELDS",
        message: "Le titre et la description sont obligatoires."
      }, 400);
    }

    // Création du FishingBook
    FishingBook.createFishingBook(title, description, userId)
      .then(response => utils.writeJson(res, response, 201))
      .catch(error => {
        console.error("Erreur lors de la création du FishingBook :", error.message);
        utils.writeJson(res, {
          success: false,
          errorCode: "DATABASE_ERROR",
          message: "Erreur interne du serveur."
        }, 500);
      });

  } catch (error) {
    console.error("Erreur lors de la création du FishingBook :", error);
    utils.writeJson(res, {
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Erreur interne du serveur."
    }, 500);
  }
};









