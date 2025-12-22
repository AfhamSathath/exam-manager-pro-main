// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import paperRoutes from "./src/routes/paperRoutes.js";

dotenv.config();
const app = express();

// ====== Path Setup ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== CORS ======
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
  })
);

// ====== JSON Parser ======
app.use(express.json());

// ====== Serve Uploads Folder ======
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ====== Connect DB ======
connectDB();

// ====== Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

// ====== Base Route ======
app.get("/", (req, res) => {
  res.send("Backend server running...");
});

// ====== 404 Handler ======
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ====== Error Handler ======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ====== Start Server with Socket.IO ======
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:8080" },
});

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
