const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
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
}, {
  tableName: 'person',
  timestamps: true,
});

module.exports = Person;