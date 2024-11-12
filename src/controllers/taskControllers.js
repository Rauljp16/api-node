import express from "express";
import { connection } from "../db/connection.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM tasks";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener las tareas:", err);
      return res.status(500).json({
        error: true,
        message: "Error en el servidor al obtener las tareas.",
      });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !status) {
    return res.status(400).json({
      error: true,
      message: "El título y el estado son obligatorios.",
    });
  }

  const query =
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";

  connection.query(query, [title, description, status], (err, result) => {
    if (err) {
      console.error("Error al crear la tarea:", err);
      return res.status(500).json({
        error: true,
        message: "Error en el servidor al crear la tarea.",
      });
    }

    res.status(201).json({
      message: "Tarea creada exitosamente",
      taskId: result.insertId,
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || !status) {
    return res.status(400).json({
      error: true,
      message: "El título y el estado son obligatorios.",
    });
  }

  const query =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE idTask = ?";

  connection.query(query, [title, description, status, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la tarea:", err);
      return res.status(500).json({
        error: true,
        message: "Error en el servidor al actualizar la tarea.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "Tarea no encontrada.",
      });
    }

    res.json({
      message: "Tarea actualizada exitosamente",
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM tasks WHERE idTask = ?";

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar la tarea:", err);
      return res.status(500).json({
        error: true,
        message: "Error en el servidor al eliminar la tarea.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "Tarea no encontrada.",
      });
    }

    res.json({
      message: "Tarea eliminada exitosamente",
    });
  });
});

export default router;
