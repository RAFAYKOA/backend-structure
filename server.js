const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // ✅ MUST be before anything else

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // ✅ allow deployed frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const teacherRoutes = require("./routes/teachers");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running successfully 🚀");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
