const express = require('express');
const router = express.Router();
const {
    createReservation, 
    deleteReservation, 
    majDatasReservation, 
    majReservation, 
    getReservations
} = require('../../controllers/Reservation');

router.get('/', (req, res) => { getReservations(req, res); });
router.post('/', (req, res) => { createReservation(req, res); });
router.put('/:id', (req, res) => { majReservation(req, res); });
router.delete('/:id', (req, res) => { deleteReservation(req, res); });
router.patch('/:id', (req, res) => { majDatasReservation(req, res); });

module.exports = router;
