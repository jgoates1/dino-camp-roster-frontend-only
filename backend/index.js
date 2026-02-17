import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Dino Camp API is running" });
});

// Get all users (campers)
app.get("/api/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, username, emoji FROM users ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update username
app.patch("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username is required" });
  }
  try {
    const { rows } = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, name, username, emoji",
      [username.trim(), id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already taken" });
    }
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.listen(PORT, () => {
  console.log(`Dino Camp API running on http://localhost:${PORT}`);
});
