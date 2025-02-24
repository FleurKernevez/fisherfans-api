const express = require('express');
const router = express.Router();

// Importation des fichiers de routes de la V2
const userRoutes = require('./userRoutes');
const boatRoutes = require('./boatRoutes');
const boatTripRoutes = require('./boatTripRoutes');
const reservationRoutes = require('./reservationRoutes');
const fishingBookRoutes = require('./fishingBookRoutes');

// Associer les routes V2 à leur préfixe respectif
router.use('/user', userRoutes);
router.use('/boats', boatRoutes);
router.use('/boatTrips', boatTripRoutes);
router.use('/reservations', reservationRoutes);
router.use('/fishingBook', fishingBookRoutes);

module.exports = router;
