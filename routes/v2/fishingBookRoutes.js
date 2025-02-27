const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middlewares/auth');
const {
    createFishingBook,
} = require('../../controllers/FishingBook');

const { 
    createBookPage,
    getUserBookPages,
    deleteBookPage,
    updateBookPage,
    updateBookPageForUser
} = require('../../controllers/BookPage');

router.post('/', authenticateUser, (req, res) => { createFishingBook(req, res); });
router.post('/:fishingBookId/page', authenticateUser, (req, res) => { createBookPage(req, res); });
router.get('/:fishingBookId/pages', authenticateUser, (req, res) => { getUserBookPages(req, res); });
router.delete('/:fishingBookId/page/:id', authenticateUser, (req, res) => { deleteBookPage(req, res); });
router.put('/page/:id', authenticateUser, (req, res) => { updateBookPage(req, res); });
router.put('/:fishingBookId/page/:id', authenticateUser, (req, res) => { updateBookPageForUser(req, res); });

module.exports = router;
