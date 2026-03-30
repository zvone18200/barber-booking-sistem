const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { sendBookingPending, sendBookingConfirmed, sendBookingCancelled } = require('./email');

// Dohvati sve rezervacije
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, s.name as service_name, s.duration, s.price 
             FROM bookings b 
             JOIN services s ON b.service_id = s.id 
             ORDER BY b.booking_date DESC, b.booking_time DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/taken', async (req, res) => {
    const { date } = req.query;
    try {
        const result = await pool.query(
            `SELECT booking_time FROM bookings 
             WHERE DATE(booking_date) = DATE($1) AND status != 'cancelled'`,
            [date]
        );
        const times = result.rows.map(r => r.booking_time.slice(0, 5));
        console.log('Taken slots za', date, ':', times);
        res.json(times);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



http://localhost:5000/api/bookings/taken?date=2026-03-30

// Kreiraj rezervaciju
router.post('/', async (req, res) => {
    const { service_id, client_name, client_email, client_phone, booking_date, booking_time, notes } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO bookings (service_id, client_name, client_email, client_phone, booking_date, booking_time, notes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [service_id, client_name, client_email, client_phone, booking_date, booking_time, notes]
        );

        const booking = result.rows[0];

        const serviceResult = await pool.query('SELECT name FROM services WHERE id = $1', [service_id]);
        const serviceName = serviceResult.rows[0]?.name || '';

        try {
            await sendBookingPending(client_email, {
                service: serviceName,
                date: booking_date.slice(0, 10).split('-').reverse().join('.'),
                time: booking_time
            });
        } catch (emailErr) {
            console.error('Email greška:', emailErr.message);
        }

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Promijeni status rezervacije
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log('Status update:', id, status);
    try {
        const result = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        const booking = result.rows[0];

        const serviceResult = await pool.query(
            `SELECT s.name FROM services s JOIN bookings b ON b.service_id = s.id WHERE b.id = $1`,
            [id]
        );
        const serviceName = serviceResult.rows[0]?.name || '';

        const emailData = {
            service: serviceName,
            date: new Date(booking.booking_date).toISOString().slice(0, 10).split('-').reverse().join('.'),
            time: booking.booking_time.slice(0, 5)
        };

        try {
            if (status === 'confirmed') {
                await sendBookingConfirmed(booking.client_email, emailData);
            } else if (status === 'cancelled') {
                await sendBookingCancelled(booking.client_email, emailData);
            }
        } catch (emailErr) {
            console.error('Email greška:', emailErr.message);
        }

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obriši rezervaciju
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
        res.json({ message: 'Rezervacija obrisana' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;