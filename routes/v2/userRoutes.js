const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middlewares/auth');
const { 
    createUser, 
    login,
    getUserById,
    getAllUsers,
    getAllUsersByFilter,
    deleteUser,
    majUser
} = require('../../controllers/User');

router.post('/', (req, res) => { createUser(req, res); });
router.post('/login', (req, res) => { login(req, res); });
router.get('/infos', authenticateUser, (req, res) => { getUserById(req, res); });
router.get('/', authenticateUser, (req, res) => { getAllUsers(req, res); });
router.get('/filtered', authenticateUser, (req, res) => { getAllUsersByFilter(req, res); });
router.delete('/', authenticateUser, (req, res) => { deleteUser(req, res); });
router.put('/', authenticateUser, (req, res) => { majUser(req, res); });

module.exports = router;
