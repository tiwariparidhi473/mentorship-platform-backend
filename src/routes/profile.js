const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update current user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, skills, department, availability, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'user not found' });

    user.name = name || user.name;
    user.skills = skills || user.skills;
    user.department = department || user.department;
    user.availability = availability || user.availability;
    user.bio = bio || user.bio;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search mentors by skill or department
router.get('/mentors', async (req, res) => {
  try {
    const { skill, department } = req.query;
    const where = { role: 'mentor' };

    if (skill) {
      where.skills = { [Op.like]: `%${skill}%` };
    }
    if (department) {
      where.department = department;
    }

    const mentors = await ser.findAll({
      where,
      attributes: { exclude: ['password'] }
    });

    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;