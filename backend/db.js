'use strict';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');
const schemaPath = path.join(__dirname, 'schema.sql');

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

async function initDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await exec('PRAGMA foreign_keys = ON;');
    await exec(schema);
}

module.exports = {
    db,
    initDatabase,
    run,
    get,
    all
};
