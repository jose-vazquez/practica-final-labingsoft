'use strict';

const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 8080;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const usuarios = [
    {
        id: 1,
        user: 'joseva',
        passwd: 'joseva_password',
        name: 'José Vázquez Avilés',
        role: 'admin'
    }
];

app.post('/login', (req, res) => {
    const user = req.body.user;
    const passwd = req.body.passwd;

    const usuario = usuarios.find((item) => {
        return item.user === user && item.passwd === passwd;
    });

    if (!usuario) {
        return res.status(401).json({
            error: 'Usuario o contraseña incorrectos'
        });
    }

    const token = crypto.randomBytes(16).toString('hex');

    return res.json({
        token: token,
        user: {
            id: usuario.id,
            username: usuario.user,
            name: usuario.name,
            role: usuario.role
        }
    });
});

app.get('/api/ping', (req, res) => {
    res.json({
        message: 'API REST funcionando correctamente'
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
