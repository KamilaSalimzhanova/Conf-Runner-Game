const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
app.use(express.json());

// Отдаём статику из папки public/
app.use(express.static(path.join(__dirname, "public")));

// Проверка API
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// API для топа (пока пусто)
app.get("/leaders", (req, res) => {
  const leaders = db.prepare("SELECT name, best FROM scores ORDER BY best DESC LIMIT 10").all();
  res.json(leaders);
});

app.listen(3000, () => console.log("✅ Server started on http://localhost:3000"));
