const express = require('express');
const router = express.Router();
const { 
    createUser, 
    getUserById,
    getAllUsers,
    getAllUsersByFilter,
    deleteUser,
    majUser
} = require('../../controllers/User');

router.post('/', (req, res) => { createUser(req, res); });
router.get('/:id', (req, res) => { getUserById(req, res); });
router.get('/', (req, res) => { getAllUsers(req, res); });
router.get('/Filtered', (req, res) => { getAllUsersByFilter(req, res); });
router.delete('/:id', (req, res) => { deleteUser(req, res); });
router.put('/:id', (req, res) => { majUser(req, res); });

module.exports = router;
