const express = require('express');
const router = express.Router();
const {
    createBoatTrip, 
    deleteBoatTrip, 
    updateBoatTrip, 
    updateBoatTrip_1,
    getBoatTrip,
    getBoatTripByParams
} = require('../../controllers/BoatTrip');

router.get('/:id', (req, res, next) => { getBoatTrip(req, res, next, parseInt(req.params.id)); });
router.get('/', (req, res) => { getBoatTripByParams(req, res); });
router.post('/', (req, res) => { createBoatTrip(req, res); });
router.put('/:id', (req, res, next) => { updateBoatTrip(req, res, next, parseInt(req.params.id)); });
router.delete('/:id', (req, res, next) => { deleteBoatTrip(req, res, next, parseInt(req.params.id)); });
router.patch('/:id', (req, res, next) => { updateBoatTrip_1(req, res, next, parseInt(req.params.id)); });

module.exports = router;
