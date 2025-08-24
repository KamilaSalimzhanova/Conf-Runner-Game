// db.js
const Database = require('better-sqlite3');

// создаём или открываем базу в файле scores.db
const db = new Database('scores.db');

// создаём таблицу, если её нет
db.prepare(`
  CREATE TABLE IF NOT EXISTS scores (
    userId INTEGER PRIMARY KEY,
    name TEXT,
    best INTEGER
  )
`).run();

module.exports = db;
