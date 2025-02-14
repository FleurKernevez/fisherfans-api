'use strict';

const BookPageService = require('../service/BookPageService');

/**
 * Ajouter une page à un FishingBook existant
 */
module.exports.createBookPage = function createBookPage(req, res) {
    const user_id = req.user.id; // Récupération de l'ID utilisateur depuis le token
    const { fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish } = req.body;

    if (!fishingBook_id || !fishName || !fishingDate) {
        return res.status(400).json({ error: "L'ID du FishingBook, le nom du poisson et la date de pêche sont obligatoires." });
    }

    BookPageService.createBookPage(fishingBook_id, fishName, urlFishPicture, comment, size, weight, fishingPlace, fishingDate, releasedFish, user_id)
        .then(response => res.status(201).json(response))
        .catch(error => {
            console.error("Erreur lors de l'ajout de la page dans le FishingBook :", error.message);
            res.status(500).json({ error: "Erreur interne du serveur." });
        });
};



/**
 * Récupérer toutes les pages du carnet de pêche d’un utilisateur 
 */
module.exports.getUserBookPages = function getUserBookPages(req, res) {
    const user_id = req.user.id;
    const fishingBookId = req.params.fishingBookId; // Récupération de l'ID du FishingBook depuis l'URL

    BookPageService.getUserBookPages(user_id, fishingBookId)
        .then(response => res.status(200).json(response))
        .catch(error => {
            console.error("Erreur lors de la récupération des pages :", error.message);
            res.status(500).json({ error: "Erreur interne du serveur." });
        });
};



/**
 * Supprimer une page du FishingBook (BF12)
 */
module.exports.deleteBookPage = function deleteBookPage(req, res) {
    const user_id = req.user.id;
    const fishingBookId = req.params.fishingBookId;
    const bookPageId = req.params.id;

    BookPageService.deleteBookPage(bookPageId, fishingBookId, user_id)
        .then(response => res.status(200).json(response))
        .catch(error => {
            console.error("Erreur lors de la suppression de la page :", error.message);
            res.status(500).json({ error: "Erreur interne du serveur." });
        });
};



/**
 * Modifier une page du FishingBook (BF16)
 */
module.exports.updateBookPage = function updateBookPage(req, res) {
   
};



/**
 * Modifier une page donnée du carnet de pêche d’un utilisateur (BF18)
 */
module.exports.updateBookPageForUser = function updateBookPageForUser(req, res) {
   
};
