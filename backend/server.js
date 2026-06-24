'use strict';

const express = require('express');
const path = require('path');
const crypto = require('crypto');

/*
 * Importo las funciones de acceso a SQLite desde db.js.
 *
 * Con run ejecuto INSERT, UPDATE y DELETE.
 * Con get obtengo un único registro.
 * Con all obtengo listados completos.
 * Con initDatabase preparo la base de datos al arrancar el servidor.
 */
const { initDatabase, run, get, all } = require('./db');

const app = express();
const port = 8080;

/*
 * Activo el parser JSON para que Express pueda leer los cuerpos de las
 * peticiones POST y PUT enviadas desde AngularJS o desde PowerShell.
 */
app.use(express.json());

/*
 * Sirvo la aplicación AngularJS como contenido estático.
 *
 * De esta forma el mismo servidor NodeJS entrega index.html, app.js,
 * las vistas HTML, CSS, iconos y librerías locales de AngularJS.
 */
app.use(express.static(path.join(__dirname, '../frontend')));

/*
 * Valido la sesión antes de permitir el acceso a cualquier ruta protegida.
 *
 * En esta práctica uso un token de sesión generado en el login y almacenado
 * en la tabla sessions. Además, mantengo compatibilidad con el nombre
 * session_id porque el enunciado de la práctica lo utiliza expresamente
 * para identificar la sesión abierta.
 *
 * Acepto la sesión de varias formas:
 * - cabecera Authorization: Bearer <token>, usada por AngularJS;
 * - cabecera x-session-token, como alternativa técnica;
 * - body.session_id, params.session_id o query.session_id, para cumplir
 *   literalmente las rutas indicadas en el enunciado.
 *
 * Si la sesión existe en la base de datos, cargo los datos del usuario
 * autenticado en req.user para que las rutas posteriores puedan saber
 * quién realiza la petición y qué rol tiene.
 */
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

        /*
         * Compatibilidad literal con el enunciado de la práctica:
         * el PDF utiliza session_id como identificador de sesión.
         *
         * Se acepta session_id en el cuerpo, en la URL o como parámetro query,
         * manteniendo también Authorization: Bearer para no romper el cliente actual.
         */
        if (!token && req.body && req.body.session_id) {
            token = req.body.session_id;
        }

        if (!token && req.params && req.params.session_id) {
            token = req.params.session_id;
        }

        if (!token && req.query && req.query.session_id) {
            token = req.query.session_id;
        }

        if (!token) {
            return res.status(401).json({
                error: 'session_id no enviado'
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

/*
 * Realizo el inicio de sesión de la aplicación.
 *
 * Recibo usuario y contraseña desde el cliente AngularJS, compruebo las
 * credenciales contra la tabla users de SQLite y, si son correctas, genero
 * un token aleatorio con crypto.
 *
 * Antes de crear la nueva sesión elimino cualquier sesión anterior del mismo
 * usuario. Así evito dejar varias sesiones abiertas para la misma cuenta.
 *
 * Devuelvo tanto token como session_id. El campo token lo usa el cliente
 * AngularJS mediante Authorization Bearer, y session_id mantiene la
 * compatibilidad literal con el formato del enunciado.
 */
app.post('/login', async (req, res) => {
    try {
        const user = req.body.user;
        const passwd = req.body.passwd;

        /*
         * Compruebo que el usuario haya enviado credenciales.
         * Si falta algún dato, rechazo la petición antes de consultar SQLite.
         */
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

        /*
         * Genero un token aleatorio de 32 bytes.
         * Lo convierto a hexadecimal para almacenarlo y enviarlo como texto.
         */
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
            session_id: token,
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

/*
 * Cierro la sesión del usuario autenticado.
 *
 * Primero paso por requireToken para asegurarme de que la sesión existe.
 * Después elimino el token de la tabla sessions. Esta eliminación es
 * importante porque demuestra que el logout no solo borra datos del navegador,
 * sino que invalida realmente la sesión en el servidor.
 *
 * Tras esta operación, si se intenta reutilizar el mismo session_id, el
 * backend debe responder 401.
 */
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

/*
 * Devuelvo los datos del usuario autenticado.
 *
 * Uso esta ruta como apoyo para que el cliente pueda comprobar qué usuario
 * está asociado al token actual.
 */
app.get('/api/me', requireToken, (req, res) => {
    res.json({
        user: req.user
    });
});

/*
 * Uso esta ruta como prueba rápida de API protegida.
 *
 * Si el token es válido, la ruta responde correctamente. Si no lo es,
 * requireToken corta la petición antes de llegar aquí.
 */
app.get('/api/ping', requireToken, (req, res) => {
    res.json({
        message: 'API REST funcionando con token válido',
        user: req.user
    });
});

/*
 * Middleware para comprobar que el usuario autenticado es administrador.
 *
 * Primero se ejecuta requireToken, que valida el token y carga req.user.
 * Después este middleware comprueba que el rol sea admin.
 */
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Acceso permitido solo a administradores'
        });
    }

    next();
}


/*
 * ============================================================
 * Rutas compatibles con el enunciado de la práctica
 * ============================================================
 *
 * El enunciado de la práctica utiliza session_id como identificador
 * de sesión en las rutas y en el cuerpo de las peticiones.
 *
 * Estas rutas conviven con las rutas modernas /api/users para no romper
 * el panel AngularJS ya implementado.
 *
 * Rutas añadidas:
 *
 * GET    /users/:session_id
 * GET    /user/:session_id/:user_id
 * POST   /user
 * PUT    /user
 * DELETE /user/:session_id/:id
 */

/*
 * GET /users/:session_id
 *
 * Lista todos los usuarios.
 */
app.get('/users/:session_id', requireToken, requireAdmin, async function(req, res) {
    try {
        const users = await all(
            `
            SELECT id, username, name, role
            FROM users
            ORDER BY id
            `
        );

        res.json(users);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({
            error: 'Error al listar usuarios'
        });
    }
});

/*
 * GET /user/:session_id/:user_id
 *
 * Obtiene los datos de un usuario concreto.
 */
app.get('/user/:session_id/:user_id', requireToken, requireAdmin, async function(req, res) {
    try {
        const user = await get(
            `
            SELECT id, username, name, role
            FROM users
            WHERE id = ?
            `,
            [req.params.user_id]
        );

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            error: 'Error al obtener usuario'
        });
    }
});

/*
 * POST /user
 *
 * Crea un usuario nuevo usando session_id en el cuerpo.
 *
 * Formato compatible con el enunciado:
 *
 * {
 *   "session_id": "...",
 *   "name": "pepito",
 *   "email": "pepe.lopez@mycompany.com",
 *   "passwd": "patata"
 * }
 *
 * En esta práctica, username y name se almacenan en SQLite.
 * Si no se envía username, se usa el campo name como username.
 */
app.post('/user', requireToken, requireAdmin, async function(req, res) {
    try {
        const username = req.body.username || req.body.user || req.body.name;
        const password = req.body.password || req.body.passwd;
        const fullName = req.body.fullname || req.body.displayName || req.body.name;
        const role = req.body.role || 'user';

        if (!username || !password || !fullName) {
            return res.status(400).json({
                error: 'username/user/name, passwd/password y name son obligatorios'
            });
        }

        if (role !== 'admin' && role !== 'user') {
            return res.status(400).json({
                error: 'El rol debe ser admin o user'
            });
        }

        const result = await run(
            `
            INSERT INTO users (username, password, name, role)
            VALUES (?, ?, ?, ?)
            `,
            [
                username.trim(),
                password.trim(),
                fullName.trim(),
                role
            ]
        );

        const newUser = await get(
            `
            SELECT id, username, name, role
            FROM users
            WHERE id = ?
            `,
            [result.id]
        );

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            error: 'Error al crear usuario'
        });
    }
});

/*
 * PUT /user
 *
 * Modifica un usuario usando session_id en el cuerpo.
 */
app.put('/user', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.body.id || req.body.user_id;
        const username = req.body.username || req.body.user || req.body.name;
        const password = req.body.password || req.body.passwd;
        const fullName = req.body.fullname || req.body.displayName || req.body.name;
        const role = req.body.role || 'user';

        if (!id || !username || !password || !fullName) {
            return res.status(400).json({
                error: 'id, username/user/name, passwd/password y name son obligatorios'
            });
        }

        if (role !== 'admin' && role !== 'user') {
            return res.status(400).json({
                error: 'El rol debe ser admin o user'
            });
        }

        const result = await run(
            `
            UPDATE users
            SET username = ?, password = ?, name = ?, role = ?
            WHERE id = ?
            `,
            [
                username.trim(),
                password.trim(),
                fullName.trim(),
                role,
                id
            ]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        const updatedUser = await get(
            `
            SELECT id, username, name, role
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        res.status(500).json({
            error: 'Error al modificar usuario'
        });
    }
});

/*
 * DELETE /user/:session_id/:id
 *
 * Elimina un usuario usando session_id en la URL.
 */
app.delete('/user/:session_id/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = Number(req.params.id);

        if (id === req.user.id) {
            return res.status(400).json({
                error: 'No puedes eliminar el usuario con el que estás autenticado'
            });
        }

        const result = await run(
            `
            DELETE FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            error: 'Error al eliminar usuario'
        });
    }
});

/*
 * GET /api/users
 *
 * Devuelve todos los usuarios existentes.
 * Ruta protegida para administradores.
 */
app.get('/api/users', requireToken, requireAdmin, async function(req, res) {
    try {
        const users = await all(
            `
            SELECT id, username, name, role
            FROM users
            ORDER BY id
            `
        );

        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            error: 'Error al obtener usuarios'
        });
    }
});

/*
 * POST /api/users
 *
 * Crea un nuevo usuario.
 * Ruta protegida para administradores.
 */
app.post('/api/users', requireToken, requireAdmin, async function(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const role = req.body.role;

        if (!username || username.trim() === '') {
            return res.status(400).json({
                error: 'El nombre de usuario es obligatorio'
            });
        }

        if (!password || password.trim() === '') {
            return res.status(400).json({
                error: 'La contraseña es obligatoria'
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre completo es obligatorio'
            });
        }

        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({
                error: 'El rol debe ser admin o user'
            });
        }

        const result = await run(
            `
            INSERT INTO users (username, password, name, role)
            VALUES (?, ?, ?, ?)
            `,
            [
                username.trim(),
                password.trim(),
                name.trim(),
                role
            ]
        );

        const user = await get(
            `
            SELECT id, username, name, role
            FROM users
            WHERE id = ?
            `,
            [result.id]
        );

        res.status(201).json(user);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            error: 'Error al crear usuario'
        });
    }
});

/*
 * PUT /api/users/:id
 *
 * Modifica un usuario existente.
 * Ruta protegida para administradores.
 */
app.put('/api/users/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const role = req.body.role;

        if (!username || username.trim() === '') {
            return res.status(400).json({
                error: 'El nombre de usuario es obligatorio'
            });
        }

        if (!password || password.trim() === '') {
            return res.status(400).json({
                error: 'La contraseña es obligatoria'
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre completo es obligatorio'
            });
        }

        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({
                error: 'El rol debe ser admin o user'
            });
        }

        const result = await run(
            `
            UPDATE users
            SET username = ?, password = ?, name = ?, role = ?
            WHERE id = ?
            `,
            [
                username.trim(),
                password.trim(),
                name.trim(),
                role,
                id
            ]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        const user = await get(
            `
            SELECT id, username, name, role
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        res.json(user);
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        res.status(500).json({
            error: 'Error al modificar usuario'
        });
    }
});

/*
 * DELETE /api/users/:id
 *
 * Elimina un usuario existente.
 * Ruta protegida para administradores.
 */
app.delete('/api/users/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;

        if (Number(id) === req.user.id) {
            return res.status(400).json({
                error: 'No puedes eliminar el usuario con el que estás autenticado'
            });
        }

        const result = await run(
            `
            DELETE FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            error: 'Error al eliminar usuario'
        });
    }
});

/*
 * GET /api/categories
 *
 * Devuelve todas las categorías existentes.
 * Ruta protegida: necesita token válido.
 */
app.get('/api/categories', requireToken, async function(req, res) {
    try {
        const categories = await all(
            `
            SELECT id, name
            FROM categories
            ORDER BY id
            `
        );

        res.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            error: 'Error al obtener categorías'
        });
    }
});

/*
 * POST /api/categories
 *
 * Crea una nueva categoría.
 * Ruta protegida para administradores.
 */
app.post('/api/categories', requireToken, requireAdmin, async function(req, res) {
    try {
        const name = req.body.name;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre de la categoría es obligatorio'
            });
        }

        const result = await run(
            `
            INSERT INTO categories (name)
            VALUES (?)
            `,
            [name.trim()]
        );

        const category = await get(
            `
            SELECT id, name
            FROM categories
            WHERE id = ?
            `,
            [result.id]
        );

        res.status(201).json(category);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            error: 'Error al crear categoría'
        });
    }
});

/*
 * PUT /api/categories/:id
 *
 * Modifica una categoría existente.
 * Ruta protegida para administradores.
 */
app.put('/api/categories/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre de la categoría es obligatorio'
            });
        }

        const result = await run(
            `
            UPDATE categories
            SET name = ?
            WHERE id = ?
            `,
            [name.trim(), id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Categoría no encontrada'
            });
        }

        const category = await get(
            `
            SELECT id, name
            FROM categories
            WHERE id = ?
            `,
            [id]
        );

        res.json(category);
    } catch (error) {
        console.error('Error al modificar categoría:', error);
        res.status(500).json({
            error: 'Error al modificar categoría'
        });
    }
});

/*
 * DELETE /api/categories/:id
 *
 * Elimina una categoría existente.
 * Como la tabla videos tiene ON DELETE CASCADE,
 * si una categoría tiene vídeos asociados, esos vídeos también se eliminan.
 */
app.delete('/api/categories/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;

        const result = await run(
            `
            DELETE FROM categories
            WHERE id = ?
            `,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Categoría no encontrada'
            });
        }

        res.json({
            message: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            error: 'Error al eliminar categoría'
        });
    }
});

/*
 * GET /api/videos
 *
 * Devuelve todos los vídeos junto con el nombre de su categoría.
 * Ruta protegida: necesita token válido.
 */
app.get('/api/videos', requireToken, async function(req, res) {
    try {
        const videos = await all(
            `
            SELECT
                videos.id,
                videos.name,
                videos.url,
                videos.category_id,
                categories.name AS category_name
            FROM videos
            INNER JOIN categories ON categories.id = videos.category_id
            ORDER BY videos.id
            `
        );

        res.json(videos);
    } catch (error) {
        console.error('Error al obtener vídeos:', error);
        res.status(500).json({
            error: 'Error al obtener vídeos'
        });
    }
});

/*
 * POST /api/videos
 *
 * Crea un nuevo vídeo asociado a una categoría.
 * Ruta protegida para administradores.
 */
app.post('/api/videos', requireToken, requireAdmin, async function(req, res) {
    try {
        const name = req.body.name;
        const url = req.body.url;
        const categoryId = req.body.category_id;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre del vídeo es obligatorio'
            });
        }

        if (!url || url.trim() === '') {
            return res.status(400).json({
                error: 'La URL del vídeo es obligatoria'
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                error: 'La categoría del vídeo es obligatoria'
            });
        }

        const result = await run(
            `
            INSERT INTO videos (name, url, category_id)
            VALUES (?, ?, ?)
            `,
            [name.trim(), url.trim(), categoryId]
        );

        const video = await get(
            `
            SELECT
                videos.id,
                videos.name,
                videos.url,
                videos.category_id,
                categories.name AS category_name
            FROM videos
            INNER JOIN categories ON categories.id = videos.category_id
            WHERE videos.id = ?
            `,
            [result.id]
        );

        res.status(201).json(video);
    } catch (error) {
        console.error('Error al crear vídeo:', error);
        res.status(500).json({
            error: 'Error al crear vídeo'
        });
    }
});

/*
 * PUT /api/videos/:id
 *
 * Modifica un vídeo existente.
 * Ruta protegida para administradores.
 */
app.put('/api/videos/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const url = req.body.url;
        const categoryId = req.body.category_id;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: 'El nombre del vídeo es obligatorio'
            });
        }

        if (!url || url.trim() === '') {
            return res.status(400).json({
                error: 'La URL del vídeo es obligatoria'
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                error: 'La categoría del vídeo es obligatoria'
            });
        }

        const result = await run(
            `
            UPDATE videos
            SET name = ?, url = ?, category_id = ?
            WHERE id = ?
            `,
            [name.trim(), url.trim(), categoryId, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Vídeo no encontrado'
            });
        }

        const video = await get(
            `
            SELECT
                videos.id,
                videos.name,
                videos.url,
                videos.category_id,
                categories.name AS category_name
            FROM videos
            INNER JOIN categories ON categories.id = videos.category_id
            WHERE videos.id = ?
            `,
            [id]
        );

        res.json(video);
    } catch (error) {
        console.error('Error al modificar vídeo:', error);
        res.status(500).json({
            error: 'Error al modificar vídeo'
        });
    }
});

/*
 * DELETE /api/videos/:id
 *
 * Elimina un vídeo existente.
 * Ruta protegida para administradores.
 */
app.delete('/api/videos/:id', requireToken, requireAdmin, async function(req, res) {
    try {
        const id = req.params.id;

        const result = await run(
            `
            DELETE FROM videos
            WHERE id = ?
            `,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Vídeo no encontrado'
            });
        }

        res.json({
            message: 'Vídeo eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar vídeo:', error);
        res.status(500).json({
            error: 'Error al eliminar vídeo'
        });
    }
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
