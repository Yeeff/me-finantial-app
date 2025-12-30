const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/people', require('./src/routes/people'));
app.use('/api/loans', require('./src/routes/loans'));

module.exports = app;