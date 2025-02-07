const express = require('express');
const router = express.Router();  // Utilisez express.Router() pour créer un router

/* Importation de controllers pour les associer aux routes du router */
const {
    createUser, 
    getUserById,
    getAllUsers,      
    getAllUsersByFilter,
    deleteUser, 
    majUser, 
} = require('./controllers/User.js');

const {
    getFilteredBoats,
    createBoat, 
    createBoatIfLicence,
    deleteBoat, 
    majBoat, 
    boatDatas,
    getBoatsInBoundingBox
} = require('./controllers/Boat.js');

const {
    createBoatTrip, 
    deleteBoatTrip, 
    updateBoatTrip, 
    updateBoatTrip_1,
    getBoatTrip,
    getBoatTripByParams
} = require('./controllers/BoatTrip.js');

const {
    createReservation, 
    deleteReservation, 
    majDatasReservation, 
    majReservation, 
    getReservations
} = require('./controllers/Reservation.js');

const {
    createFishingBook,
    deleteFishingBook,
    updateFishingBook,
    updateFishingBookById,
    updateFishingBookById_1
} = require('./controllers/FishingBook.js');

/** Définir les routes avec express.Router() **/

/** Routes pour "user" **/
// routes privées
router.post('/user', (req, res) => { createUser(req, res); });
router.get('/user/:id', (req, res) => { getUserById(req, res); });
router.get('/users', (req, res) => { getAllUsers(req, res); });
router.get('/usersFiltered', (req, res) => { getAllUsersByFilter(req, res); });
router.delete('/user/:id', (req, res) => { deleteUser(req, res); });
router.put('/user/:id', (req, res) => { majUser(req, res); });

/** Routes pour "boat" **/
router.get('/boats', (req, res) => { boatDatas(req, res); });
router.get('/boatsFiltered', (req, res) => { getFilteredBoats(req, res); });
router.post('/boat', (req, res) => { createBoat(req, res); });
router.post('/boatIfLicence', (req, res) => { createBoatIfLicence(req, res); });
router.put('/boat/:id', (req, res) => { majBoat(req, res); });
router.delete('/boat/:id', (req, res) => { deleteBoat(req, res); });
router.get('/boats/in-bbox', (req, res) => { getBoatsInBoundingBox(req, res); });

/** Routes pour "boatTrip" **/
router.get('/boatTrip/:id', (req, res, next) => {
    getBoatTrip(req, res, next, parseInt(req.params.id)); 
});

// BF22 
// L’API FF devra renvoyer une liste de sorties en filtrant sur un sous- ensemble quelconque des caractéristiques d’une sortie 
router.get('/boatTrip', (req, res) => {
    getBoatTripByParams(req, res); 
});
router.post('/boatTrip', (req, res) => {
    createBoatTrip(req, res);
});
router.put('/boatTrip/:id', (req, res, next) => {
    updateBoatTrip(req, res, next, parseInt(req.params.id)); 
});
router.delete('/boatTrip/:id', (req, res, next) => {
    deleteBoatTrip(req, res, next, parseInt(req.params.id)); 
});
router.patch('/boatTrip/:id', (req, res, next) => {
    updateBoatTrip_1(req, res, next, parseInt(req.params.id)); 
});

/** Routes pour "reservation" **/
// routes privées
router.get('/reservations', (req, res) => { getReservations(req, res); });
router.post('/reservation', (req, res) => { createReservation(req, res); });
router.put('/reservation/:id', (req, res) => { majReservation(req, res); });
router.delete('/reservation/:id', (req, res) => { deleteReservation(req, res); });
router.patch('/reservation/:id', (req, res) => { majDatasReservation(req, res); });


/** Routes pour "fishingBook" **/
// routes privées
router.post('/fishingBook', (req, res) => { createFishingBook(req, res); });
router.put('/fishingBook/:id/:User_id', (req, res) => { updateFishingBookById(req, res); });
router.patch('/fishingBook/:id/:User_id', (req, res) => { updateFishingBookById_1(req, res); });
router.put('/fishingBook/:id', (req, res) => { updateFishingBook(req, res); });
router.delete('/fishingBook/:id', (req, res) => { deleteFishingBook(req, res); });
router.patch('/fishingBook/:id', (req, res) => { majDatasFishingBook(req, res); });

/** Exporter le router **/
module.exports = router;
