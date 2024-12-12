const express = require('express');
const app = express();

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

/** Router du web service */
const router = {
    routes: [
        /** Table user **/
        app?.post('/user', (req, res) => {
              createUser(req, res);
        }),
        app?.get('/user/{id}', (req, res) => {
              userDatas(req, res);
        }),
        app?.put('/user/{id}', (req, res) => {
              majUser(req, res);
        }),
        app?.delete('/user/{id}', (req, res) => {
              deleteUser(req, res);
        }),
        app?.patch('/user/{id}', (req, res) => {
              majDatasUser(req, res);
        }),

        /** Table boat **/
        app?.get('/boat/{Latitude}{Longitude}', (req, res) => {
            boatDatas(req, res);
        }),
        app?.get('/boat', (req, res) => {
            boatDatas(req, res);
        }),
        app?.post('/boat', (req, res) => {
            createBoat(req, res);
        }),
        app?.put('/boat/{id}', (req, res) => {
            majBoat(req, res);
        }),
        app?.delete('/boat/{id}', (req, res) => {
            deleteBoat(req, res);
        }),
        app?.patch('/boat/{id}', (req, res) => {
            majDatasBoat(req, res);
        }),

        /** Table boatTrip **/
        app?.get('/boatTrip', (req, res) => {
            boatTripDatas(req, res);
        }),
        app?.post('/boatTrip', (req, res) => {
            createBoatTrip(req, res);
        }),
        app?.put('/boatTrip/{id}', (req, res) => {
            majBoatTrip(req, res);
        }),
        app?.delete('/boatTrip/{id}', (req, res) => {
            deleteBoatTrip(req, res);
        }),
        app?.patch('/boatTrip/{id}', (req, res) => {
            majDatasBoatTrip(req, res);
        }),

        /** Table reservation **/
        app?.get('/reservation', (req, res) => {
            reservationDatas(req, res);
        }),
        app?.post('/reservation', (req, res) => {
            createReservation(req, res);
        }),
        app?.put('/reservation/{id}', (req, res) => {
            majReservation(req, res);
        }),
        app?.delete('/reservation/{id}', (req, res) => {
            deleteReservation(req, res);
        }),
        app?.patch('/reservation/{id}', (req, res) => {
            majDatasReservation(req, res);
        }),

        /** Table bookPage **/
        app?.post('/fishingBook', (req, res) => {
            createFishingBook(req, res);
        }),
        app?.put('/fishingBook/{id}/{User_id}', (req, res) => {
            updateFishingBookById(req, res);
        }),
        app?.patch('/fishingBook/{id}/{User_id}', (req, res) => {
            updateFishingBookById_1(req, res);
        }),
        app?.put('/fishingBook/{id}', (req, res) => {
            updateFishingBook(req, res);
        }),
        app?.delete('/fishingBook/{id}', (req, res) => {
            deleteFishingBook(req, res);
        }),
        app?.patch('/fishingBook/{id}', (req, res) => {
            majDatasFishingBook(req, res);
        }),
        
    ]
};

exports.router = router;