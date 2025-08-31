const sqlite3 = require('sqlite3').verbose();

// создаём или открываем базу в файле scores.db
const db = new sqlite3.Database('scores.db');

// создаём таблицу, если её нет
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      userId INTEGER PRIMARY KEY,
      name TEXT,
      best INTEGER
    )
  `);
});

module.exports = db;
