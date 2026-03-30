const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
        }

        const user = result.rows[0];

        if (password !== user.password) {
            return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;