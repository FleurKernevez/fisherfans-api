'use strict';

const utils = require('../utils/writer.js');
const BookPageService = require('../service/BookPageService');


// Ajouter une page à un FishingBook existant 
module.exports.createBookPage = async function createBookPage(req, res) {
    try {
        const userId = req.user.id; // ID de l'utilisateur authentifié
        const fishingBookId = req.params.fishingBookId; 

        const {
            fishName,
            urlFishPicture,
            comment,
            size,
            weight,
            fishingPlace,
            fishingDate,
            releasedFish
        } = req.body;

        // Vérification de l'ID du FishingBook dans l'URL
        if (!fishingBookId || isNaN(fishingBookId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_FISHINGBOOK_ID",
                message: "L'identifiant du FishingBook est requis et doit être un nombre valide."
            }, 400);
        }

        // Vérifier si le FishingBook existe et appartient bien à l'utilisateur
        const fishingBook = await BookPageService.getFishingBookById(fishingBookId);
        if (!fishingBook) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FISHINGBOOK_NOT_FOUND",
                message: "Le FishingBook spécifié n'existe pas."
            }, 404);
        }

        if (fishingBook.user_id !== userId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de ce FishingBook."
            }, 403);
        }

        // Ajouter la nouvelle page avec l'ID du FishingBook venant de l'URL
        const newBookPage = await BookPageService.createBookPage({
            fishingBook_id: fishingBookId, 
            fishName, 
            urlFishPicture, 
            comment, 
            size, 
            weight, 
            fishingPlace, 
            fishingDate, 
            releasedFish, 
            user_id: userId
        });

        return utils.writeJson(res, {
            success: true,
            message: "Page ajoutée au FishingBook avec succès.",
            data: {
                bookPageId: newBookPage.bookPageId,
                fishingBookId: Number(fishingBookId), 
                fishName: newBookPage.fishName,
                fishingDate: newBookPage.fishingDate
            }
        }, 201);
        

    } catch (error) {
        console.error("Erreur lors de l'ajout de la page dans le FishingBook :", error);
        return utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Erreur interne du serveur."
        }, 500);
    }
};



// Récupérer toutes les pages du carnet de pêche d’un utilisateur 
module.exports.getUserBookPages = function getUserBookPages(req, res) {
    const user_id = req.user.id;
    const fishingBookId = req.params.fishingBookId; // Récupération de l'ID du FishingBook depuis l'URL

    BookPageService.getUserBookPages(user_id, fishingBookId)
        .then(response => {
            if (!response || response.length === 0) {
                return utils.writeJson(res, {
                    success: false,
                    errorCode: "NO_PAGES_FOUND",
                    message: "Aucune page trouvée pour ce FishingBook."
                }, 404);
            }

            utils.writeJson(res, {
                success: true,
                message: "Pages récupérées avec succès.",
                data: response
            }, 200);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des pages :", error.message);
            utils.writeJson(res, {
                success: false,
                errorCode: "DATABASE_ERROR",
                message: "Erreur interne du serveur."
            }, 500);
        });
};


// Supprimer une page du FishingBook
module.exports.deleteBookPage = async function deleteBookPage(req, res) {
    try {
        const userId = req.user.id; // ID utilisateur authentifié
        const fishingBookId = parseInt(req.params.fishingBookId); // ID du carnet de pêche depuis l'URL
        const bookPageId = parseInt(req.params.id); // ID de la page de pêche

        if (!bookPageId || isNaN(bookPageId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_BOOKPAGE_ID",
                message: "L'identifiant de la page est requis et doit être un nombre valide."
            }, 400);
        }

        if (!fishingBookId || isNaN(fishingBookId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_FISHINGBOOK_ID",
                message: "L'identifiant du FishingBook est requis et doit être un nombre valide."
            }, 400);
        }

        // Vérifier si la page existe
        const bookPage = await BookPageService.getBookPageById(bookPageId);
        if (!bookPage) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "BOOKPAGE_NOT_FOUND",
                message: "Page non trouvée."
            }, 404);
        }

        // Vérifier si l'ID du FishingBook associé à la page correspond bien à l'ID fourni
        if (bookPage.fishingBook_id !== fishingBookId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FISHINGBOOK_MISMATCH",
                message: "Cette page n'appartient pas au FishingBook spécifié."
            }, 403);
        }

        // Vérifier si l'utilisateur est bien le propriétaire du FishingBook
        const fishingBook = await BookPageService.getFishingBookById(fishingBookId);
        if (!fishingBook) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FISHINGBOOK_NOT_FOUND",
                message: "FishingBook non trouvé."
            }, 404);
        }

        if (fishingBook.user_id !== userId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de ce FishingBook."
            }, 403);
        }

        // Suppression de la page
        const deletionResult = await BookPageService.deleteBookPage(bookPageId);
        if (!deletionResult || deletionResult.affectedRows === 0) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "PAGE_NOT_FOUND",
                message: "Page non trouvée ou déjà supprimée."
            }, 404);
        }

        return utils.writeJson(res, {
            success: true,
            message: "Page supprimée avec succès."
        }, 200);

    } catch (error) {
        console.error("Erreur lors de la suppression de la page :", error);
        return utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Erreur interne du serveur."
        }, 500);
    }
};


// Modifier une page du FishingBook 
module.exports.updateBookPage = async function updateBookPage(req, res) {
    try {
        const userId = req.user.id;
        const bookPageId = req.params.id;
        const updatedData = req.body;

        if (!bookPageId || isNaN(bookPageId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_BOOKPAGE_ID",
                message: "L'identifiant de la page est requis et doit être un nombre valide."
            }, 400);
        }

        if (!updatedData || Object.keys(updatedData).length === 0) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "MISSING_UPDATE_DATA",
                message: "Aucune donnée fournie pour la mise à jour."
            }, 400);
        }

        const bookPage = await BookPageService.getBookPageById(bookPageId);
        if (!bookPage) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "BOOKPAGE_NOT_FOUND",
                message: "Page non trouvée."
            }, 404);
        }

        if (bookPage.user_id !== userId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de cette page."
            }, 403);
        }

        BookPageService.updateBookPage(bookPageId, updatedData)
            .then(response => {
                if (!response || response.affectedRows === 0) {
                    return utils.writeJson(res, {
                        success: false,
                        errorCode: "NO_UPDATE",
                        message: "Aucune mise à jour effectuée."
                    }, 404);
                }

                utils.writeJson(res, {
                    success: true,
                    message: "Page mise à jour avec succès."
                }, 200);
            })
            .catch(error => {
                utils.writeJson(res, {
                    success: false,
                    errorCode: "DATABASE_ERROR",
                    message: "Erreur interne du serveur."
                }, 500);
            });

    } catch (error) {
        utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Erreur interne du serveur."
        }, 500);
    }
};


// Modifier une page donnée du carnet de pêche d’un utilisateur donné
module.exports.updateBookPageForUser = async function updateBookPageForUser(req, res) {
    try {
        const userId = req.user.id; // ID de l'utilisateur authentifié
        const fishingBookId = req.params.fishingBookId;
        const bookPageId = req.params.id;
        const updatedData = req.body; // Données à mettre à jour

        // Vérifier si l'utilisateur est authentifié
        if (!userId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "MISSING_USER_ID",
                message: "ID utilisateur introuvable dans le token."
            }, 400);
        }

        // Vérifier que l'ID du carnet de pêche est valide
        if (!fishingBookId || isNaN(fishingBookId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_FISHINGBOOK_ID",
                message: "L'identifiant du FishingBook est requis et doit être un nombre valide."
            }, 400);
        }

        // Vérifier que l'ID de la page est valide
        if (!bookPageId || isNaN(bookPageId)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_BOOKPAGE_ID",
                message: "L'identifiant de la page est requis et doit être un nombre valide."
            }, 400);
        }

        // Vérifier que des données sont bien fournies
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "MISSING_UPDATE_DATA",
                message: "Aucune donnée fournie pour la mise à jour."
            }, 400);
        }

        // Vérifier si l'utilisateur est bien propriétaire du FishingBook
        const fishingBook = await BookPageService.getFishingBookById(fishingBookId);
        if (!fishingBook) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FISHINGBOOK_NOT_FOUND",
                message: "FishingBook non trouvé."
            }, 404);
        }

        if (fishingBook.user_id !== userId) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de ce FishingBook."
            }, 403);
        }

        // Appeler le service pour mettre à jour la page du FishingBook
        BookPageService.updateBookPageForUser(fishingBookId, bookPageId, userId, updatedData)
            .then(response => {
                if (!response || response.affectedRows === 0) {
                    return utils.writeJson(res, {
                        success: false,
                        errorCode: "PAGE_NOT_FOUND",
                        message: "Page non trouvée ou aucune mise à jour effectuée."
                    }, 404);
                }

                utils.writeJson(res, {
                    success: true,
                    message: "Page mise à jour avec succès."
                }, 200);
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour de la page spécifique :", error.message);
                utils.writeJson(res, {
                    success: false,
                    errorCode: "DATABASE_ERROR",
                    message: "Erreur interne du serveur."
                }, 500);
            });

    } catch (error) {
        utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Erreur interne du serveur."
        }, 500);
    }
};


