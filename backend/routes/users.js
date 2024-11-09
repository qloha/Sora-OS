// routes/users.js

const express = require('express');
const router = express.Router();

const users = [
    { username: 'Chewaboo Pimlebean', password: '123' },
    { username: 'Gumberry Bubbleyeti', password: '321' },
];

const userPreferences = {
    'Chewaboo Pimlebean': { username: 'Chewaboo Pimlebean', password: '123', background: '/assets/img/background.png' },
    'Gumberry Bubbleyeti': { username: 'Gumberry Bubbleyeti', password: '321', background: '/assets/img/background.png' }
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Username not found' });
    }

    if (user.password === password) {
        req.session.user = { loggedIn: true, username: user.username };
        res.json({ success: true });
    } else {
        res.status(401).json({ message: 'Incorrect password' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.json({ success: true });
    });
});

router.get('/current', (req, res) => {
    if (req.session.user && req.session.user.loggedIn) {
        res.json({ username: req.session.user.username });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

router.post('/savePreferences', (req, res) => {
    if (!req.session.user || !req.session.user.loggedIn) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const username = req.session.user.username;
    userPreferences[username] = { ...userPreferences[username], ...req.body }; // Update only provided fields
    res.json({ success: true });
});

router.get('/getPreferences', (req, res) => {
    if (!req.session.user || !req.session.user.loggedIn) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const username = req.session.user.username;
    const preferences = userPreferences[username] || { background: '', taskbarApps: [] };
    res.json(preferences);
});

router.post('/verifyPassword', (req, res) => {
    if (!req.session.user || !req.session.user.loggedIn) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const { password } = req.body;
    const user = users.find((user) => user.username === req.session.user.username);

    if (user && user.password === password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ message: 'Incorrect password' });
    }
});

module.exports = router;