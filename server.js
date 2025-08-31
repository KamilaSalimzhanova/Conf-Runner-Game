const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// Проверка API
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Получение топ-10 игроков
app.get("/leaders", (req, res) => {
  db.all("SELECT name, best FROM scores ORDER BY best DESC LIMIT 10", (err, rows) => {
    if (err) {
      console.error("Ошибка получения лидеров:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Сохранение результата
app.post("/score", (req, res) => {
  const { userId, name, score } = req.body;

  if (!userId || !name || !score) {
    return res.status(400).json({ error: "Не хватает данных" });
  }

  db.get("SELECT * FROM scores WHERE userId = ?", [userId], (err, row) => {
    if (err) {
      console.error("Ошибка поиска пользователя:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (!row || score > row.best) {
      db.run(
        "INSERT OR REPLACE INTO scores (userId, name, best) VALUES (?, ?, ?)",
        [userId, name, score],
        (err2) => {
          if (err2) {
            console.error("Ошибка записи:", err2.message);
            return res.status(500).json({ error: err2.message });
          }
          res.json({ ok: true, newBest: score });
        }
      );
    } else {
      res.json({ ok: true, newBest: row.best });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
