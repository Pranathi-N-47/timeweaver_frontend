const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Create User (Student/Faculty) Endpoint
router.post('/create-user', async (req, res) => {
    const { name, role, dob } = req.body;

    if (!name || !role || !dob) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // Generate credentials
    // Username: lowercase name, remove spaces
    const username = name.toLowerCase().replace(/\s+/g, '');
    // Password: DOB (YYYY-MM-DD)
    const password = dob;

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password_hash, role, full_name) VALUES ($1, $2, $3, $4)', [username, hash, role, name]);

        res.json({
            success: true,
            message: 'User created',
            credentials: { username, password }
        });
    } catch (err) {
        console.error(err);
        // Handle duplicate username error potentially
        if (err.code === '23505') { // Postgres unique violation
            return res.status(400).json({ error: 'Username already exists. Please use a unique name or specific ID.' });
        }
        res.status(500).json({ error: 'Creation failed' });
    }
});

module.exports = router;
