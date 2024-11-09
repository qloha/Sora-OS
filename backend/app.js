const express = require('express');
const path = require('path');
const session = require('express-session');
const userRoutes = require('./routes/users');

const app = express();

// Middleware for handling JSON data
app.use(express.json());

app.use(session({
    secret: 'qlohasillyhehehe',
    resave: false,
    saveUninitialized: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.loggedIn) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/desktop', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/desktop.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/relogin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/relogin.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));