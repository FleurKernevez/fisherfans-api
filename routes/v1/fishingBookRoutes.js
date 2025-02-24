const express = require('express');
const router = express.Router();
const {
    createFishingBook,
    deleteFishingBook,
    updateFishingBook,
    updateFishingBookById,
    updateFishingBookById_1
} = require('../../controllers/FishingBook');

router.post('/', (req, res) => { createFishingBook(req, res); });
router.put('/:id/:User_id', (req, res) => { updateFishingBookById(req, res); });
router.patch('/:id/:User_id', (req, res) => { updateFishingBookById_1(req, res); });
router.put('/:id', (req, res) => { updateFishingBook(req, res); });
router.delete('/:id', (req, res) => { deleteFishingBook(req, res); });

module.exports = router;
