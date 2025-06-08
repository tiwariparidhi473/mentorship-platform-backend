const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Profile routes (add these lines)
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Add mentorship routes here:
const mentorshipRoutes = require('./routes/mentorship');
app.use('/api/mentorship', mentorshipRoutes);

// Add chat routes here:
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Mentorship Platform Backend Running');
});

const sequelize = require('./models');
sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync Sequelize models
const User = require('./models/User');
const MentorshipRequest = require('./models/mentorshipRequest');
const Message = require('./models/message');
sequelize.sync();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});