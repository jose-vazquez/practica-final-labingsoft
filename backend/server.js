'use strict';

const express = require('express');
const path = require('path');
const crypto = require('crypto');

const { initDatabase, run, get } = require('./db');

const app = express();
const port = 8080;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

async function requireToken(req, res, next) {
    try {
        const authorization = req.headers.authorization || '';
        let token = null;

        if (authorization.startsWith('Bearer ')) {
            token = authorization.substring(7);
        }

        if (!token && req.headers['x-session-token']) {
            token = req.headers['x-session-token'];
        }

        if (!token) {
            return res.status(401).json({
                error: 'Token no enviado'
            });
        }

        const session = await get(
            `SELECT 
                s.token,
                s.user_id,
                u.username,
                u.name,
                u.role
             FROM sessions s
             INNER JOIN users u ON u.id = s.user_id
             WHERE s.token = ?`,
            [token]
        );

        if (!session) {
            return res.status(401).json({
                error: 'Token no válido'
            });
        }

        req.token = token;
        req.user = {
            id: session.user_id,
            username: session.username,
            name: session.name,
            role: session.role
        };

        next();
    } catch (error) {
        res.status(500).json({
            error: 'Error validando token'
        });
    }
}

app.post('/login', async (req, res) => {
    try {
        const user = req.body.user;
        const passwd = req.body.passwd;

        if (!user || !passwd) {
            return res.status(400).json({
                error: 'Usuario y contraseña son obligatorios'
            });
        }

        const usuario = await get(
            `SELECT id, username, password, name, role
             FROM users
             WHERE username = ? AND password = ?`,
            [user, passwd]
        );

        if (!usuario) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos'
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        await run(
            'DELETE FROM sessions WHERE user_id = ?',
            [usuario.id]
        );

        await run(
            'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
            [token, usuario.id]
        );

        return res.json({
            token: token,
            user: {
                id: usuario.id,
                username: usuario.username,
                name: usuario.name,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno en login'
        });
    }
});

app.put('/logout', requireToken, async (req, res) => {
    try {
        await run(
            'DELETE FROM sessions WHERE token = ?',
            [req.token]
        );

        res.json({
            message: 'Sesión cerrada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error cerrando sesión'
        });
    }
});

app.get('/api/me', requireToken, (req, res) => {
    res.json({
        user: req.user
    });
});

app.get('/api/ping', requireToken, (req, res) => {
    res.json({
        message: 'API REST funcionando con token válido',
        user: req.user
    });
});

initDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor iniciado en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error iniciando la base de datos:', error.message);
        process.exit(1);
    });
