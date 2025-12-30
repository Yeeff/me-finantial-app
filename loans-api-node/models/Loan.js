const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  personId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'person',
      key: 'id',
    },
  },
  initialCapital: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  currentCapital: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  interestType: {
    type: DataTypes.ENUM('MONTHLY', 'ANNUAL'),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lastConsolidationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAID', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.STRING(1000),
  },
  accessCode: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  accessLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'loan',
  timestamps: true,
});

module.exports = Loan;