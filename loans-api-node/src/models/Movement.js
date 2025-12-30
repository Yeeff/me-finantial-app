const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'loan',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('INTEREST_CONSOLIDATION', 'PAYMENT', 'PARTIAL_PAYMENT'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  interestAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  capitalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  daysCalculated: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  capitalBefore: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  capitalAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  movementDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.STRING(1000),
  },
}, {
  tableName: 'movement',
  timestamps: false, // Only createdAt, no updatedAt
});

module.exports = Movement;