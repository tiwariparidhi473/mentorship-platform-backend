const express = require('express');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Mentee sends a mentorship request
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, scheduledDate } = req.body;
    const menteeId = req.user.id;
    const mentor = await User.findByPk(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(400).json({ message: 'Invalid mentor' });
    }
    const request = await MentorshipRequest.create({
      menteeId,
      mentorId,
      scheduledDate,
      status: 'Pending'
    });
    res.status(201).json({ message: 'Request sent', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mentor accepts or rejects a request
router.put('/respond/:id', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const request = await MentorshipRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (req.user.id !== request.mentorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    request.status = status;
    await request.save();
    res.json({ message: `Request ${status.toLowerCase()}`, request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List requests for the logged-in user (as mentee or mentor)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await MentorshipRequest.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { menteeId: req.user.id },
          { mentorId: req.user.id }
        ]
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;