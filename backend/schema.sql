PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO users (username, password, name, role)
VALUES ('joseva', 'joseva_password', 'José Vázquez Avilés', 'admin');

INSERT OR IGNORE INTO users (username, password, name, role)
VALUES ('usuario', 'usuario_password', 'Usuario de prueba', 'user');

INSERT OR IGNORE INTO categories (name)
VALUES ('Redes');

INSERT OR IGNORE INTO categories (name)
VALUES ('Programación');

INSERT OR IGNORE INTO videos (name, url, category_id)
VALUES (
    'Introducción a AngularJS',
    'https://www.youtube.com/watch?v=angularjs',
    (SELECT id FROM categories WHERE name = 'Programación')
);

INSERT OR IGNORE INTO videos (name, url, category_id)
VALUES (
    'Conceptos básicos de NodeJS',
    'https://www.youtube.com/watch?v=nodejs',
    (SELECT id FROM categories WHERE name = 'Programación')
);
