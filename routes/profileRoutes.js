const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const Teacher = require('../models/teacher.model');
const Student = require('../models/Student');

// ✅ File Upload Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ POST: Create Teacher
router.post('/teachers', upload.single('profilePicture'), async (req, res) => {
  try {
    const teacherData = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    const newTeacher = new Teacher({
      ...teacherData,
      subjects: Array.isArray(teacherData.subjects) ? teacherData.subjects : [teacherData.subjects],
      availability: Array.isArray(teacherData.availability) ? teacherData.availability : [teacherData.availability],
      teachingLevels: Array.isArray(teacherData.teachingLevels) ? teacherData.teachingLevels : [teacherData.teachingLevels],
      profilePicture,
    });

    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (err) {
    console.error('Error saving teacher profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET: Teacher by ID
router.get('/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ GET: Student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
