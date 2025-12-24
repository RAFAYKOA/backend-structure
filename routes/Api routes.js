// server/routes/teacherProfile.js
const express = require('express');
const router = express.Router();
const TeacherProfilePage = require('../models/TeacherProfilePage');

// Save profile
router.post('/api/teacher-profile', async (req, res) => {
  try {
    const profileData = req.body;
    const newProfile = new TeacherProfilePage(profileData);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get('/teachers', (req, res) => {
  res.json(teachers); // 👉 sending array, not object
});


// Get profile
router.get('/api/teacher-profile/:id', async (req, res) => {
  try {
    const profile = await TeacherProfilePage.findById(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ message: 'Profile not found' });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  console.log('Student ID:', req.params.id)
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Failed to fetch student' });
  }
});

module.exports = router;