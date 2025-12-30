const express = require('express');
const cors = require('cors');
const { Person, Loan, Movement } = require('./models');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/people', require('./routes/people'));
app.use('/api/loans', require('./routes/loans'));

module.exports = app;