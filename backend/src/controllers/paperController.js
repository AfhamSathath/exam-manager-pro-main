import Paper from "../models/paperModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// -----------------------------
// Multer setup for PDF uploads
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/papers";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// -----------------------------
// Create a new paper
// -----------------------------
export const createPaper = async (req, res) => {
  try {
    const { year, semester, courseCode, courseName, paperType, department, lecturerId, lecturerName, status } = req.body;

    if (!year || !semester || !courseCode || !courseName || !paperType || !lecturerId || !req.file) {
      return res.status(400).json({ message: "Missing required fields or PDF file" });
    }

    const paper = new Paper({
      year,
      semester,
      courseCode,
      courseName,
      paperType,
      department,
      lecturerId,
      lecturerName,
      status,
      currentVersion: 1,
      signatures: [],
      pdfPath: req.file.path, // store file path
    });

    await paper.save();
    res.status(201).json(paper);
  } catch (error) {
    console.error("Error creating paper:", error);
    res.status(500).json({ message: "Failed to create paper", error: error.message });
  }
};

// -----------------------------
// Get all papers
// Optional: filter by lecturerId
// -----------------------------
export const getAllPapers = async (req, res) => {
  try {
    const { lecturerId } = req.query;
    let query = {};

    if (lecturerId) query.lecturerId = lecturerId;

    const papers = await Paper.find(query).sort({ createdAt: -1 });
    res.status(200).json(papers);
  } catch (error) {
    console.error("Error fetching papers:", error);
    res.status(500).json({ message: "Failed to fetch papers", error: error.message });
  }
};

// -----------------------------
// Get a single paper by ID
// -----------------------------
export const getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json(paper);
  } catch (error) {
    console.error("Error fetching paper:", error);
    res.status(500).json({ message: "Failed to fetch paper", error: error.message });
  }
};

// -----------------------------
// Update a paper by ID
// -----------------------------
export const updatePaper = async (req, res) => {
  try {
    const updatedPaper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPaper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json(updatedPaper);
  } catch (error) {
    console.error("Error updating paper:", error);
    res.status(400).json({ message: "Failed to update paper", error: error.message });
  }
};

// -----------------------------
// Delete a paper by ID
// -----------------------------
export const deletePaper = async (req, res) => {
  try {
    const deletedPaper = await Paper.findByIdAndDelete(req.params.id);
    if (!deletedPaper) return res.status(404).json({ message: "Paper not found" });

    // Remove PDF file from server
    if (deletedPaper.pdfPath && fs.existsSync(deletedPaper.pdfPath)) {
      fs.unlinkSync(deletedPaper.pdfPath);
    }

    res.status(200).json({ message: "Paper deleted successfully" });
  } catch (error) {
    console.error("Error deleting paper:", error);
    res.status(500).json({ message: "Failed to delete paper", error: error.message });
  }
};

// -----------------------------
// Get papers by lecturer ID
// -----------------------------
export const getPapersByLecturer = async (req, res) => {
  const { id } = req.params;
  try {
    const papers = await Paper.find({ lecturerId: id }).sort({ createdAt: -1 });
    res.status(200).json(papers);
  } catch (error) {
    console.error("Error fetching lecturer papers:", error);
    res.status(500).json({ message: "Failed to fetch papers", error: error.message });
  }
};
