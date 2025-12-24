const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  description: String,
  subjects: [String],
  noOfRequiredTutors: String,
  travelDistance: String,
  meetingOptions: Object,
  genderPreference: String,
  association: String,
  isPublicStudent: String,
  jobType: String,
  getTutorFrom: String,
  interactionLanguages: [String],
  profilePicture: String,
  files: [String], // Optional
});

module.exports = mongoose.model('Student', studentSchema);
