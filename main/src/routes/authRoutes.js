const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Login Endpoint
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1 AND role = $2', [username, role]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // Compare hashed password
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name } });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            res.status(401).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Registration Endpoint
router.post('/register', async (req, res) => {
    const { username, password, role, fullName } = req.body;

    // Only allow admin registration via this endpoint for now (controlled by frontend logic/hidden button)
    if (role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized registration role' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password_hash, role, full_name) VALUES ($1, $2, $3, $4)', [username, hash, role, fullName]);
        res.json({ success: true, message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;
