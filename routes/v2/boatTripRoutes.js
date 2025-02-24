const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middlewares/auth');
const {
    createBoatTrip,
    getBoatTrip,
    getBoatTripByParams, 
    deleteBoatTrip, 
    updateBoatTrip
} = require('../../controllers/BoatTrip');

router.post('/', authenticateUser, (req, res) => { createBoatTrip(req, res); });
router.get('/user', authenticateUser, (req, res) => { getBoatTrip(req, res); });
router.get('/filtered', authenticateUser, (req, res) => { getBoatTripByParams(req, res); });
router.delete('/:id', authenticateUser, (req, res) => { deleteBoatTrip(req, res); });
router.put('/:id', authenticateUser, (req, res) => { updateBoatTrip(req, res); });

module.exports = router;
