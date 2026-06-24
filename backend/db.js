'use strict';

/*
 * Centralizo en este fichero toda la conexión con SQLite.
 *
 * De esta forma separo la lógica de acceso a datos del servidor Express.
 * server.js no necesita saber cómo se abre la base de datos ni cómo se
 * envuelven las consultas; solo usa las funciones run, get y all.
 */

const fs = require('fs');
const path = require('path');
/*
 * Cargo sqlite3 en modo verbose para tener mensajes de diagnóstico más claros
 * durante el desarrollo de la práctica.
 */
const sqlite3 = require('sqlite3').verbose();

/*
 * Defino la ruta física de la base de datos dentro de la carpeta backend.
 *
 * Mantengo el fichero database.db separado del código fuente para que SQLite
 * pueda persistir los datos entre reinicios del servidor.
 */
const dbPath = path.join(__dirname, 'database.db');
const schemaPath = path.join(__dirname, 'schema.sql');

/*
 * Abro una única conexión SQLite reutilizada por todas las operaciones.
 *
 * Esta conexión se usa desde las funciones auxiliares que exporto al resto
 * de la aplicación.
 */
const db = new sqlite3.Database(dbPath);

function exec(sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

/*
 * Envuelvo db.run en una Promise.
 *
 * Lo hago para poder usar async/await en server.js y mantener el código de
 * las rutas REST más limpio y fácil de defender.
 */
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(error) {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                id: this.lastID,
                changes: this.changes
            });
        });
    });
}

/*
 * Envuelvo db.get en una Promise.
 *
 * Uso esta función cuando espero un único registro, por ejemplo en login,
 * en la validación de sesión o al recuperar un elemento recién creado.
 */
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(row);
        });
    });
}

/*
 * Envuelvo db.all en una Promise.
 *
 * Uso esta función cuando necesito devolver listados completos, como usuarios,
 * categorías o vídeos.
 */
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(rows);
        });
    });
}

/*
 * Inicializo la base de datos.
 *
 * En esta función leo schema.sql y ejecuto las sentencias necesarias para
 * crear las tablas y datos mínimos si aún no existen. Así puedo arrancar la
 * práctica desde cero sin crear la base de datos manualmente.
 */
async function initDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await exec('PRAGMA foreign_keys = ON;');
    await exec(schema);
}

/*
 * Exporto únicamente las funciones que necesita server.js.
 *
 * Con esto mantengo una interfaz sencilla de acceso a datos y evito que el
 * resto de la aplicación manipule directamente la conexión SQLite.
 */
module.exports = {
    db,
    initDatabase,
    run,
    get,
    all
};
