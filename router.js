const express = require('express');
const router = express.Router();
const db = require('./dbConfig');

router.get('/', (req, res) => {
    db('cars')
    .then(cars => {
        res.status(200).json(cars);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
});

router.get('/:id', validateCarId, (req, res) => {
    const id = req.params.id;
    db('cars')
    .where({ id: id })
    .then(car => {
        res.status(200).json(car);
    })
    .catch(err => res.status(500).json({ error: err }));
})

router.post('/', validateCar, (req, res) => {
    const car = req.body;
    db('cars')
    .insert(car)
    .then(id => {
        db('cars')
        .where({ id: id[0] })
        .then(car => {
            res.status(200).json(car[0]);
        })
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

router.delete('/:id', validateCarId, (req, res) => {
    const id = req.params.id;
    db('cars')
    .where({ id: id })
    .del()
    .then(count => {
        res.status(200).json(`${count} record deleted.`);
    })
    .catch(err => res.status(500).json({ error: err }));
})

router.put('/:id', validateCarId, validateCar, (req, res) => {
    const id = req.params.id;
    const update = req.body;
    db('cars')
    .where({ id: id })
    .update(update)
    .then(count => {
        db('cars')
        .where({ id: id })
        .then(car => {
            res.status(200).json(car);
        })
    })
    .catch(err => res.status(500).json({ error: err }));
})




// CUSTOM MIDDLEWARE
function validateCarId(req, res, next) {
    const id = req.params.id;
    db('cars')
    .where({ id: id })
    .then(car => {
        !car.length && res.status(404).json({ error: "Car with provided id not found." });
        next();
    })
    .catch(err => res.status(500).json({ error: err }));
}

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