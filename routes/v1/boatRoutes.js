const express = require('express');
const router = express.Router();
const {
    getFilteredBoats,
    createBoat, 
    createBoatIfLicence,
    deleteBoat, 
    majBoat, 
    boatDatas,
    getBoatsInBoundingBox
} = require('../../controllers/Boat');

router.get('/', (req, res) => { boatDatas(req, res); });
router.get('/Filtered', (req, res) => { getFilteredBoats(req, res); });
router.post('/', (req, res) => { createBoat(req, res); });
router.post('/IfLicence', (req, res) => { createBoatIfLicence(req, res); });
router.put('/:id', (req, res) => { majBoat(req, res); });
router.delete('/:id', (req, res) => { deleteBoat(req, res); });
router.get('/in-bbox', (req, res) => { getBoatsInBoundingBox(req, res); });

module.exports = router;
