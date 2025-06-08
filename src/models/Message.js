const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const MentorshipRequest = require('./MentorshipRequest');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mentorshipRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: MentorshipRequest, key: 'id' }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Message;