const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middlewares/auth');
const {
    createBoat,
    boatDatas,
    getFilteredBoats,
    getBoatsInBoundingBox,
    getBoatsByUserId,
    deleteBoat,
    majBoat,
} = require('../../controllers/Boat');

router.post('/', authenticateUser, (req, res) => { createBoat(req, res); });
router.get('/', authenticateUser, (req, res) => { boatDatas(req, res); });
router.get('/filtered', authenticateUser, (req, res) => { getFilteredBoats(req, res); });
router.get('/in-bbox', authenticateUser, (req, res) => { getBoatsInBoundingBox(req, res); });
router.get('/user', authenticateUser, (req, res) => { getBoatsByUserId(req, res); });
router.delete('/:id', authenticateUser, (req, res) => { deleteBoat(req, res); });
router.put('/:id', authenticateUser, (req, res) => { majBoat(req, res); });

module.exports = router;
