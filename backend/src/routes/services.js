const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Dohvati sve usluge
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM services ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dodaj uslugu
router.post('/', async (req, res) => {
    const { name, duration, price, description } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO services (name, duration, price, description) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, duration, price, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Uredi uslugu
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, duration, price, description, active } = req.body;
    try {
        const result = await pool.query(
            `UPDATE services SET name=$1, duration=$2, price=$3, description=$4, active=$5 
             WHERE id=$6 RETURNING *`,
            [name, duration, price, description, active, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obriši uslugu
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM services WHERE id=$1', [id]);
        res.json({ message: 'Usluga obrisana' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Zauzeti termini za datum
router.get('/taken', async (req, res) => {
    const { date } = req.query;
    try {
        const result = await pool.query(
            `SELECT booking_time FROM bookings 
             WHERE booking_date = $1 AND status != 'cancelled'`,
            [date]
        );
        const times = result.rows.map(r => r.booking_time.slice(0, 5));
        res.json(times);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;