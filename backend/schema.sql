-- Defino el esquema SQLite de la práctica final.
-- En este fichero creo las tablas necesarias para usuarios, sesiones, categorías y vídeos.
-- Mantengo el esquema separado del código NodeJS para que la inicialización de la base de datos sea clara y repetible.

PRAGMA foreign_keys = ON;

-- Creo la tabla de usuarios de la aplicación.
-- Aquí guardo administradores y usuarios normales con su rol correspondiente.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
);

-- Creo la tabla de sesiones.
-- Guardo aquí los tokens generados en el login para poder validarlos e invalidarlos en logout.
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Creo la tabla de categorías del catálogo multimedia.
-- Cada vídeo debe pertenecer a una de estas categorías.
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Creo la tabla de vídeos.
-- Relaciono cada vídeo con una categoría mediante category_id.
CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(name, url, category_id)
);

-- Inserto usuarios iniciales de prueba.
-- Uso INSERT OR IGNORE para no duplicarlos si reinicio la base de datos varias veces.
INSERT OR IGNORE INTO users (username, password, name, role)
VALUES ('joseva', 'joseva_password', 'José Vázquez Avilés', 'admin');

-- Inserto usuarios iniciales de prueba.
-- Uso INSERT OR IGNORE para no duplicarlos si reinicio la base de datos varias veces.
INSERT OR IGNORE INTO users (username, password, name, role)
VALUES ('usuario', 'usuario_password', 'Usuario de prueba', 'user');

-- Inserto categorías iniciales de prueba.
-- Uso INSERT OR IGNORE para que la inicialización sea idempotente.
INSERT OR IGNORE INTO categories (name)
VALUES ('Redes');

-- Inserto categorías iniciales de prueba.
-- Uso INSERT OR IGNORE para que la inicialización sea idempotente.
INSERT OR IGNORE INTO categories (name)
VALUES ('Programación');

-- Inserto vídeos iniciales de prueba.
-- Cada vídeo queda asociado a una categoría existente mediante su identificador.
INSERT OR IGNORE INTO videos (name, url, category_id)
VALUES (
    'Introducción a AngularJS',
    'https://www.youtube.com/watch?v=angularjs',
    (SELECT id FROM categories WHERE name = 'Programación')
);

-- Inserto vídeos iniciales de prueba.
-- Cada vídeo queda asociado a una categoría existente mediante su identificador.
INSERT OR IGNORE INTO videos (name, url, category_id)
VALUES (
    'Conceptos básicos de NodeJS',
    'https://www.youtube.com/watch?v=nodejs',
    (SELECT id FROM categories WHERE name = 'Programación')
);
