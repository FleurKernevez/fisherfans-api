const express = require('express');
const router = express.Router();  // Utilisez express.Router() pour créer un router
const authenticateUser = require('./middlewares/auth.js');


/* Importation de controllers pour les associer aux routes du router */
const {
    createUser, 
    login,
    getUserById,
    getAllUsers,      
    getAllUsersByFilter,
    deleteUser,
    majUser,
    getUserReservations
} = require('./controllers/User.js');

const {
    createBoat,
    boatDatas,
    getFilteredBoats,
    getBoatsInBoundingBox,
    getBoatsByUserId,
    deleteBoat,
    majBoat,
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
    reservationDatas,
    deleteReservation, 
    majReservation, 
} = require('./controllers/Reservation.js');

const {
    createFishingBook,
} = require('./controllers/FishingBook.js');

const { 
    createBookPage,
    getUserBookPages,
    deleteBookPage,
    updateBookPage,
    updateBookPageForUser
} = require('./controllers/BookPage.js');



/** Routes pour "user" **/
router.post('/user', (req, res) => { createUser(req, res); });
router.post('/login', (req, res) => { login(req, res); });
router.get('/user/infos', authenticateUser, (req, res) => { getUserById(req, res); }); 
router.get('/users', (req, res) => { getAllUsers(req, res); });
router.get('/usersFiltered', (req, res) => { getAllUsersByFilter(req, res); });
router.delete('/user', authenticateUser, (req, res) => { deleteUser(req, res); });
router.put('/user', authenticateUser, (req, res) => { majUser(req, res); }); 
router.get('/user/reservations', authenticateUser, (req, res) => { getUserReservations(req, res); });


/** Routes pour "boat" **/
router.post('/boat', authenticateUser, (req, res) => { createBoat(req, res); });
router.get('/boats', authenticateUser, (req, res) => { boatDatas(req, res); });
router.get('/boatsFiltered', authenticateUser, (req, res) => { getFilteredBoats(req, res); });
router.get('/boats/in-bbox', authenticateUser, (req, res) => { getBoatsInBoundingBox(req, res); });
router.get('/boats/user/:userId', authenticateUser, (req, res) => { getBoatsByUserId(req, res); });
router.delete('/boat/:id', authenticateUser, (req, res) => { deleteBoat(req, res); });
router.put('/boat/:id', authenticateUser, (req, res) => { majBoat(req, res); });


// MANQUE AUTHENTICATE
/** Routes pour "boatTrip" **/
router.get('/boatTrip/:id', (req, res, next) => { getBoatTrip(req, res, next, parseInt(req.params.id)); });
//BF22 L’API FF devra renvoyer une liste de sorties en filtrant sur un sous- ensemble quelconque des caractéristiques d’une sortie 
router.get('/boatTrip', (req, res) => { getBoatTripByParams(req, res); });
router.post('/boatTrip', (req, res) => { createBoatTrip(req, res); });
router.put('/boatTrip/:id', (req, res, next) => { updateBoatTrip(req, res, next, parseInt(req.params.id)); });
router.delete('/boatTrip/:id', (req, res, next) => { deleteBoatTrip(req, res, next, parseInt(req.params.id)); });
router.patch('/boatTrip/:id', (req, res, next) => { updateBoatTrip_1(req, res, next, parseInt(req.params.id)); });



/** Routes pour "reservation" **/
// routes privées
router.post('/reservation', authenticateUser, (req, res) => { createReservation(req, res); });
router.get('/reservations', authenticateUser, (req, res) => { reservationDatas(req, res); });
router.delete('/reservation/:id', authenticateUser, (req, res) => { deleteReservation(req, res); });
router.put('/reservation/:id', authenticateUser, (req, res) => { majReservation(req, res); });



/** Routes pour "fishingBook" **/
// routes privées
router.post('/fishingBook', authenticateUser, (req, res) => { createFishingBook(req, res); });
router.post('/fishingBook/page', authenticateUser, (req, res) => { createBookPage(req, res); });
router.get('/fishingBook/:fishingBookId/pages', authenticateUser, (req, res) => { getUserBookPages(req, res); });
router.delete('/fishingBook/:fishingBookId/page/:id', authenticateUser, (req, res) => { deleteBookPage(req, res); });
router.put('/fishingBook/page/:id', authenticateUser, (req, res) => { updateBookPage(req, res); });
router.put('/fishingBook/:fishingBookId/page/:id', authenticateUser, (req, res) => { updateBookPageForUser(req, res); });

/** Exporter le router **/
module.exports = router;

