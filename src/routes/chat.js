const express = require('express');
const Message = require('../models/Message');
const MentorshipRequest = require('../models/MentorshipRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Send a message in a mentorship request
router.post('/:requestId/message', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const mentorshipRequestId = req.params.requestId;
    const senderId = req.user.id;

    // Check if the user is part of the mentorship request
    const mentorship = await MentorshipRequest.findByPk(mentorshipRequestId);
    if (!mentorship || (mentorship.menteeId !== senderId && mentorship.mentorId !== senderId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      mentorshipRequestId,
      senderId,
      content
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all messages for a mentorship request
router.get('/:requestId/messages', auth, async (req, res) => {
  try {
    const mentorshipRequestId = req.params.requestId;
    const userId = req.user.id;

    // Check if the user is part of the mentorship request
    const mentorship = await MentorshipRequest.findByPk(mentorshipRequestId);
    if (!mentorship || (mentorship.menteeId !== userId && mentorship.mentorId !== userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.findAll({
      where: { mentorshipRequestId },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;