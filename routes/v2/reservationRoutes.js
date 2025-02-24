const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middlewares/auth');
const {
    createReservation, 
    reservationDatas,
    getReservationsByDate,
    deleteReservation, 
    majReservation, 
} = require('../../controllers/Reservation');

router.post('/', authenticateUser, (req, res) => { createReservation(req, res); });
router.get('/user', authenticateUser, (req, res) => { reservationDatas(req, res); });
router.get('/by-date', authenticateUser, (req, res) => { getReservationsByDate(req, res); });
router.delete('/:id', authenticateUser, (req, res) => { deleteReservation(req, res); });
router.put('/:id', authenticateUser, (req, res) => { majReservation(req, res); });

module.exports = router;
