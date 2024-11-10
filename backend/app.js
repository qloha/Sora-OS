const express = require('express');
const path = require('path');
const session = require('express-session');
const userRoutes = require('./routes/users');

(async () => {
    const chalk = (await import('chalk')).default;

    const app = express();

    app.use(express.json());

    app.use(session({
        secret: 'qlohasillyhehehe',
        resave: false,
        saveUninitialized: true,
    }));

    app.use(express.static(path.join(__dirname, '../public')));

    function isAuthenticated(req, res, next) {
        if (req.session.user && req.session.user.loggedIn) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

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
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.use('/api/users', userRoutes);

    app.listen(3000, () => {
        console.log(chalk.greenBright("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
        console.log(chalk.greenBright("┃                                                              ┃"));
        console.log(chalk.greenBright("┃     🚀 Server is up and running on http://localhost:3000     ┃"));
        console.log(chalk.greenBright("┃                                                              ┃"));
        console.log(chalk.greenBright("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫"));
        console.log(chalk.greenBright("┃                                                              ┃"));
        console.log(chalk.greenBright("┃                    👋 Welcome to Sora OS!                    ┃"));
        console.log(chalk.greenBright("┃  🔌 Powered by Express.js with session handling and routes.  ┃"));
        console.log(chalk.greenBright("┃ Feel free to contribute at https://github.com/qloha/Sora-OS  ┃"));
        console.log(chalk.greenBright("┃                                                              ┃"));
        console.log(chalk.greenBright("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));
    });
})();
