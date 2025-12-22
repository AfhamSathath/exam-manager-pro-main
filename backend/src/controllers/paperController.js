import Paper from "../models/paperModel.js";
// Create a new paper
export const createPaper = async (req, res) => {
  try {
    const paper = new Paper(req.body);
    await paper.save();
    res.status(201).json(paper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all papers
export const getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single paper by ID
export const getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a paper by ID
export const updatePaper = async (req, res) => {
  try {
    const updatedPaper = await Paper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPaper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json(updatedPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a paper by ID
export const deletePaper = async (req, res) => {
  try {
    const deletedPaper = await Paper.findByIdAndDelete(req.params.id);
    if (!deletedPaper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json({ message: "Paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
