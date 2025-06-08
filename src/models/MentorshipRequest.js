const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const MentorshipRequest = sequelize.define('MentorshipRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menteeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Completed'),
    defaultValue: 'Pending'
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
});

module.exports = MentorshipRequest;