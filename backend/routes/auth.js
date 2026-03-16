const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticateToken } = require("../middleware/auth");

const pool = require("../db");

/**
 * POST /login
 * Realiza login do usuário
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    console.log("User found:", result.rows.length > 0);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = result.rows[0];
    console.log("User password:", user.password ? "exists" : "missing");

    // Proteção contra usuário sem senha cadastrada
    if (!user.password) {
      console.log("Usuário sem senha cadastrada:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "kuid_secret_key_2024",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor: " + err.message });
  }
});

/**
 * GET /me
 * Retorna os dados do usuário autenticado
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        email,
        role,
        name,
        surname,
        profile_image,
        whatsapp,
        city,
        state,
        trial_ends_at,
        subscription_status,
        plan_type,
        subscription_ends_at,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Erro em /me:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
