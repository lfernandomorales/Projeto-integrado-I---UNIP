const sqlite3 = require("sqlite3").verbose();

const db =  new sqlite3.Database("../database.db");

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        email TEXT UNIQUE,
        senha TEXT,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS descartes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        tipo TEXT,
        quantidade INTEGER,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);
});

module.exports = db;


/*
    db.run(`CREATE TABLE IF NOT EXISTS descartes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tipo TEXT,
        quantidade REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREING KEY(user_id) REFERENCES usuarios(id)
        )
    `);*/