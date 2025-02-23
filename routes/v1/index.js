const express = require('express');
const router = express.Router();

// Importation des différentes routes de la V1
const userRoutes = require('./user');
const boatRoutes = require('./boat');
const boatTripRoutes = require('./boatTrip');
const reservationRoutes = require('./reservation');
const fishingBookRoutes = require('./fishingBook');

// Utilisation des routes pour la V1
router.use('/user', userRoutes);
router.use('/boat', boatRoutes);
router.use('/boatTrip', boatTripRoutes);
router.use('/reservation', reservationRoutes);
router.use('/fishingBook', fishingBookRoutes);

// Exportation du routeur de la V1
module.exports = router;
