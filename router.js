const express = require('express');
const router = express.Router();
const db = require('./dbConfig');

router.get('/', (req, res) => {
    db('cars')
    .then(cars => {
        res.status(200).json(cars);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

router.post('/', validateCar, (req, res) => {
    const car = req.body;
    db('cars')
    .insert(car)
    .then(response => {
        res.status(200).json(`Car created with id ${response}.`);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

function validateCar(req, res, next) {
    const car = req.body;
    !car && res.status(400).json({ error: "Must include car object." });
    !car.vin && res.status(400).json({ error: "VIN is required." });
    !car.make && res.status(400).json({ error: "Car make is required." });
    !car.model && res.status(400).json({ error: "Car model is required." });
    !car.mileage && res.status(400).json({ error: "Car mileage is required." });
    next();
}


module.exports = router;