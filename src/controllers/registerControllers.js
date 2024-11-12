import express from "express";
import { connection } from "../db/connection.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "El email y la contraseña son obligatorios.",
    });
  }

  const query = "INSERT INTO users (email, password) VALUES (?, ?)";

  connection.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error al insertar el usuario:", err);
      return res.status(500).json({
        error: true,
        message: "Error en el servidor al crear el usuario.",
      });
    }

    res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: result.insertId,
    });
  });
});

export default router;
