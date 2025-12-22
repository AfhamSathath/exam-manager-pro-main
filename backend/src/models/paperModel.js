import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    year: String,
    semester: String,
    courseCode: String,
    courseName: String,
    paperType: { type: String, enum: ["exam", "assessment"] },
    department: String,
    lecturerId: String,
    lecturerName: String,
    status: { type: String, enum: ["draft", "pending_moderation", "approved"], default: "draft" },
    pdfUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Paper", paperSchema);
