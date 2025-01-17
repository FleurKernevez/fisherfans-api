const express = require('express');
const router = express.Router();  // Utilisez express.Router() pour créer un router

/* Importation de controllers pour les associer aux routes du router */
const {
    createUser, 
    deleteUser, 
    majDatasUser, 
    majUser, 
    userDatas
} = require('./controllers/User.js');

const {
    createBoat, 
    deleteBoat, 
    majDatasBoat, 
    majBoat, 
    boatDatas
} = require('./controllers/Boat.js');

const {
    createBoatTrip, 
    deleteBoatTrip, 
    majDatasBoatTrip, 
    majBoatTrip, 
    boatTripDatas
} = require('./controllers/BoatTrip.js');

const {
    createReservation, 
    deleteReservation, 
    majDatasReservation, 
    majReservation, 
    reservationDatas
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
router.get('/user/:id', (req, res) => { userDatas(req, res); });
router.put('/user/:id', (req, res) => { majUser(req, res); });
router.delete('/user/:id', (req, res) => { deleteUser(req, res); });
router.patch('/user/:id', (req, res) => { majDatasUser(req, res); });

/** Routes pour "boat" **/
router.get('/boats', (req, res) => { boatDatas(req, res); });
router.post('/boat', (req, res) => { createBoat(req, res); });
router.put('/boat/:id', (req, res) => { majBoat(req, res); });
router.delete('/boat/:id', (req, res) => { deleteBoat(req, res); });
router.patch('/boat/:id', (req, res) => { majDatasBoat(req, res); });

/** Routes pour "boatTrip" **/
router.get('/boatTrip', (req, res) => { boatTripDatas(req, res); });
router.post('/boatTrip', (req, res) => { createBoatTrip(req, res); });
router.put('/boatTrip/:id', (req, res) => { majBoatTrip(req, res); });
router.delete('/boatTrip/:id', (req, res) => { deleteBoatTrip(req, res); });
router.patch('/boatTrip/:id', (req, res) => { majDatasBoatTrip(req, res); });

/** Routes pour "reservation" **/
// routes privées
router.get('/reservation', (req, res) => { reservationDatas(req, res); });
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
