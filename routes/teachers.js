const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Teacher Model (make sure your schema uses timestamps: true)
const Teacher = require('../models/profile.model');

/**
 * POST: Create teacher profile
 */
router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      profilePicture: req.file ? `uploads/${req.file.filename}` : null
    };
    const newProfile = new Teacher(profileData);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    res.status(500).json({ error: 'Failed to create profile', message: error.message });
  }
});

/**
 * GET: All teachers (sorted by newest first)
 */
router.get('/', async (req, res) => {
  try {
    // Sort by createdAt descending for newest first
    const profiles = await Teacher.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching all teacher profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles', message: error.message });
  }
});

/**
 * GET: Single teacher by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher by ID:', error);
    res.status(500).json({ error: 'Failed to fetch teacher profile', message: error.message });
  }
});

/**
 * PUT: Update teacher profile (general update)
 */
router.put('/:id', async (req, res) => {
  const teacherId = req.params.id;
  const { isActive, ...otherUpdates } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        ...otherUpdates,
        isActive,
        lastUpdated: new Date()
      },
      { new: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher', message: error.message });
  }
});

/**
 * PUT: Update teacher status (Active/Inactive)
 */
router.put('/:id/status', async (req, res) => {
  const teacherId = req.params.id;
  const { isActive } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { isActive },
      { new: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

module.exports = router;
