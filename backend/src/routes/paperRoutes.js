import express from "express";
import {
  createPaper,
  getAllPapers,
  getPaperById,
  updatePaper,
  deletePaper,
} from "../controllers/paperController.js";

const router = express.Router();

// CRUD routes
router.post("/", createPaper);           // Create
router.get("/", getAllPapers);          // Read all
router.get("/:id", getPaperById);       // Read one
router.put("/:id", updatePaper);        // Update
router.delete("/:id", deletePaper);     // Delete

export default router;      
