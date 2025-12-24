const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subjects: [String],
  education: String,
  experience: Number,
  hourlyRate: Number,
  availability: [String],
  teachingLevels: [String],
  bio: String,
  location: String,
  phone: String,
  profilePicture: { type: String }, // Relative URL to uploaded image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeacherProfiles', teacherSchema);
