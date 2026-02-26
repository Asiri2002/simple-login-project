import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();
const SECRET = "secretkey"; 

// ===== REGISTER =====
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, hashed],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User registered" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== LOGIN =====
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
  );
});

export default router;