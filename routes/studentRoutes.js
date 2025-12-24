const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST - Create Student Profile (Change from '/students' to '/')
router.post('/', upload.single('profilePicture'), async (req, res) => {
  console.log('Received request:', req.body);
  try {
    const meetingOptions = JSON.parse(req.body.meetingOptions || '{}');
    const subjects = JSON.parse(req.body.subjects || '[]');
    const interactionLanguages = JSON.parse(req.body.interactionLanguages || '[]');

    const studentData = {
      ...req.body,
      meetingOptions,
      subjects,
      interactionLanguages,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null
    };

    const newStudent = new Student(studentData);
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      student: newStudent
    });
  } catch (error) {
    console.error('Error creating student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student profile',
      error: error.message
    });
  }
});

// GET - Retrieve All Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

module.exports = router;
