'use strict';

const utils = require('../utils/writer.js');
const FishingBook = require('../service/FishingBookService.js');

/**
 * Créer un FishingBook
 * L'ID du user est récupéré dans le token
 */
module.exports.createFishingBook = function createFishingBook(req, res) {
  const userId = req.user.id; // Récupération de l'ID utilisateur depuis le token
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Le titre et la description sont obligatoires." });
  }

  FishingBook.createFishingBook(title, description, userId)
    .then(response => res.status(201).json(response))
    .catch(error => {
      console.error("Erreur lors de la création du FishingBook :", error.message);
      res.status(500).json({ error: "Erreur interne du serveur." });
    });
};








