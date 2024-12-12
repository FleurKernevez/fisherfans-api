const { app } = require('./app.js');

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
    createBookPage, 
    deleteBookPage, 
    majDatasBookPage, 
    majBookPage, 
    bookPageDatas
} = require('./controllers/BookPage.js');

/** Router du web service */
const router = {
    routes: [
        /** Table user **/
        app.post('/user', (req, res) => {

        }),
        app.get('/user/{id}', (req, res) => {}),
        app.put('/user/{id}', (req, res) => {}),
        app.delete('/user/{id}', (req, res) => {}),
        app.patch('/user/{id}', (req, res) => {}),

        /** Table boat **/
        app.get('/boat/{Latitude}{Longitude}', (req, res) => {}),
        app.get('/boat', (req, res) => {}),
        app.post('/boat', (req, res) => {}),
        app.put('/boat/{id}', (req, res) => {}),
        app.delete('/boat/{id}', (req, res) => {}),
        app.patch('/boat/{id}', (req, res) => {}),

        /** Table boatTrip **/
        app.get('/boatTrip', (req, res) => {}),
        app.post('/boatTrip', (req, res) => {}),
        app.put('/boatTrip/{id}', (req, res) => {}),
        app.delete('/boatTrip/{id}', (req, res) => {}),
        app.patch('/boatTrip/{id}', (req, res) => {}),

        /** Table reservation **/
        app.get('/reservation', (req, res) => {}),
        app.post('/reservation', (req, res) => {}),
        app.put('/reservation/{id}', (req, res) => {}),
        app.delete('/reservation/{id}', (req, res) => {}),
        app.patch('/reservation/{id}', (req, res) => {}),

        /** Table bookPage **/
        app.post('/fishingBook', (req, res) => {}),
        app.put('/fishingBook/{id}/{User_id}', (req, res) => {}),
        app.patch('/fishingBook/{id}/{User_id}', (req, res) => {}),
        app.put('/fishingBook/{id}', (req, res) => {}),
        app.delete('/fishingBook/{id}', (req, res) => {}),
        app.patch('/fishingBook/{id}', (req, res) => {}),
        
    ]
};

exports.router = router;