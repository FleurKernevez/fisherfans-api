'use strict';

const utils = require('../utils/writer.js');
const BoatTrip = require('../service/BoatTripService.js');
const User = require('../service/UserService.js')

//Fonction pour créer un voyage en bateau 
// L’API FF devra interdire la création d’une sortie pêche aux utilisateursne possédant pas de bateau
module.exports.createBoatTrip = function createBoatTrip(req, res) {
    const user_id = req.user.id; // Récupération de l'ID de l'utilisateur authentifié

    const { title, practicalInformation, type, priceType, startDate, endDate, passengersNumber, price, boat_id } = req.body;

    // Vérifier si l'utilisateur possède un permis bateau
    User.getUserById(user_id)
        .then(user => {
            if (!user) {
                return utils.writeJson(res, { success: false, errorCode: "USER_NOT_FOUND", message: "Utilisateur non trouvé." }, 404);
            }

            if (!user.boatLicenceNumber) {
                return utils.writeJson(res, { success: false, errorCode: "NO_BOAT_LICENSE", message: "L'utilisateur ne possède pas de permis pour créer un voyage en bateau." }, 403);
            }

            // Créer le voyage en bateau
            BoatTrip.createBoatTrip({
                title, practicalInformation, type, priceType, startDate, endDate, passengersNumber, price, user_id, boat_id
            })
                .then(createdBoatTrip => utils.writeJson(res, createdBoatTrip, 201))
                .catch(error => {
                    console.error("Erreur lors de la création du voyage en bateau :", error);
                    utils.writeJson(res, { success: false, errorCode: "DATABASE_ERROR", message: "Erreur interne du serveur." }, 500);
                });
        })
        .catch(error => {
            console.error("Erreur lors de la vérification du permis utilisateur :", error);
            utils.writeJson(res, { success: false, errorCode: "DATABASE_ERROR", message: "Erreur interne du serveur." }, 500);
        });
};


// Récupérer les données d'un voyage en bateau d'un user
module.exports.getBoatTrip = function getBoatTrip(req, res) {
    const user_id = req.user.id; // Récupération du user_id via le token

    if (!user_id) {
        return utils.writeJson(res, {
            success: false,
            errorCode: "MISSING_USER_ID",
            message: "L'ID utilisateur est introuvable dans le token d'authentification."
        }, 400);
    }

    BoatTrip.getBoatTripByUserId(user_id)
        .then(boatTrips => {
            if (!boatTrips || boatTrips.length === 0) {
                return utils.writeJson(res, {
                    success: false,
                    errorCode: "NO_TRIPS_FOUND",
                    message: "Aucun voyage en bateau trouvé pour cet utilisateur."
                }, 404);
            }

            utils.writeJson(res, {
                success: true,
                data: boatTrips
            }, 200);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des voyages :", error);
            utils.writeJson(res, {
                success: false,
                errorCode: "DATABASE_ERROR",
                message: "Erreur interne du serveur lors de la récupération des voyages."
            }, 500);
        });
};



/**
 * BF22 L’API FF devra renvoyer une liste de sorties en filtrant sur un sous- ensemble quelconque des caractéristiques d’une sortie 
 * getBoatTripByParams
 * @param {*} req 
 * @param {*} res 
 * @param {*} 
 * @returns 
 */
module.exports.getBoatTripByParams = function getBoatTripByParams(req, res) {
    const filters = req.query; // Récupération des filtres depuis la requête

    BoatTrip.getFilteredBoatTrips(filters)
        .then(boatTrips => {
            if (!boatTrips || boatTrips.length === 0) {
                return utils.writeJson(res, {
                    success: false,
                    errorCode: "NO_RESULTS",
                    message: "Aucune sortie de pêche ne correspond aux filtres fournis.",
                    filters: filters
                }, 404);
            }

            utils.writeJson(res, {
                success: true,
                message: "Liste des sorties de pêche récupérée avec succès.",
                data: boatTrips
            }, 200);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des sorties de pêche :", error);
            utils.writeJson(res, {
                success: false,
                errorCode: "DATABASE_ERROR",
                message: "Erreur interne du serveur lors de la récupération des sorties de pêche."
            }, 500);
        });
};


// Supprimer un voyage en bateau
module.exports.deleteBoatTrip = async function deleteBoatTrip(req, res) {
    try {
        const user_id = req.user.id; // ID de l'utilisateur authentifié via le token
        const { id } = req.params; // ID du voyage en bateau à supprimer

        // Vérifier que l'ID est valide
        if (!id || isNaN(id)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_BOATTRIP_ID",
                message: "L'identifiant du voyage en bateau est requis et doit être un nombre valide."
            }, 400);
        }

        // Récupérer le voyage et vérifier qu'il appartient bien à l'utilisateur
        const boatTrip = await BoatTrip.getBoatTripById(id);
        if (!boatTrip) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "BOATTRIP_NOT_FOUND",
                message: "Voyage en bateau non trouvé."
            }, 404);
        }

        if (boatTrip.user_id !== user_id) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de ce voyage en bateau."
            }, 403);
        }

        // Suppression du voyage (pas de await ici)
        BoatTrip.deleteBoatTrip(id)
            .then(response => {
                if (!response || response.affectedRows === 0) {
                    return utils.writeJson(res, {
                        success: false,
                        errorCode: "BOATTRIP_NOT_FOUND",
                        message: `Aucun voyage trouvé avec l'identifiant ${id}.`
                    }, 404);
                }

                return utils.writeJson(res, {
                    success: true,
                    message: `Le voyage en bateau avec l'identifiant ${id} a été supprimé avec succès.`
                }, 200);
            })
            .catch(error => {
                console.error("Erreur lors de la suppression du voyage en bateau :", error);
                utils.writeJson(res, {
                    success: false,
                    errorCode: "DATABASE_ERROR",
                    message: "Une erreur est survenue lors de la suppression du voyage en bateau."
                }, 500);
            });

    } catch (error) {
        console.error("Erreur lors de la suppression du voyage en bateau :", error);
        utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Une erreur interne s'est produite."
        }, 500);
    }
};


// Mettre à jour les données d'un voyage en bateau 
module.exports.updateBoatTrip = async function updateBoatTrip(req, res) {
    try {
        const user_id = req.user.id; // ID de l'utilisateur authentifié via le token
        const { id } = req.params; // ID du voyage en bateau à modifier
        const updates = req.body; // Données de mise à jour

        // Vérifier que l'ID est valide et que des données sont fournies
        if (!id || isNaN(id)) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "INVALID_BOATTRIP_ID",
                message: "L'identifiant du voyage en bateau est requis et doit être un nombre valide."
            }, 400);
        }

        if (!updates || Object.keys(updates).length === 0) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "MISSING_UPDATE_DATA",
                message: "Aucune donnée de mise à jour n'a été fournie."
            }, 400);
        }

        // Récupérer le voyage et vérifier qu'il appartient bien à l'utilisateur
        const boatTrip = await BoatTrip.getBoatTripById(id);
        if (!boatTrip) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "BOATTRIP_NOT_FOUND",
                message: "Voyage en bateau non trouvé."
            }, 404);
        }

        if (boatTrip.user_id !== user_id) {
            return utils.writeJson(res, {
                success: false,
                errorCode: "FORBIDDEN",
                message: "Accès interdit : vous n'êtes pas le propriétaire de ce voyage en bateau."
            }, 403);
        }

        // Appel au service pour mettre à jour le voyage en bateau
        BoatTrip.updateBoatTrip(id, updates)
            .then(response => {
                if (!response || response.affectedRows === 0) {
                    return utils.writeJson(res, {
                        success: false,
                        errorCode: "BOATTRIP_NOT_FOUND",
                        message: `Aucun voyage trouvé avec l'identifiant ${id}.`
                    }, 404);
                }

                return utils.writeJson(res, {
                    success: true,
                    message: `Le voyage en bateau avec l'identifiant ${id} a été mis à jour avec succès.`
                }, 200);
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour du voyage en bateau :", error);
                utils.writeJson(res, {
                    success: false,
                    errorCode: "DATABASE_ERROR",
                    message: "Une erreur est survenue lors de la mise à jour du voyage en bateau."
                }, 500);
            });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du voyage en bateau :", error);
        utils.writeJson(res, {
            success: false,
            errorCode: "SERVER_ERROR",
            message: "Une erreur interne s'est produite."
        }, 500);
    }
};


