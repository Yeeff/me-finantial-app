const express = require('express');
const loanService = require('../services/loanService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { personId, initialCapital, interestRate, interestType, startDate, notes } = req.body;
    const loan = await loanService.createLoan(personId, initialCapital, interestRate, interestType, startDate, notes);
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const loan = await loanService.getLoan(req.params.id);
    const totalDebt = loanService.getTotalDebt(loan);
    res.json({ loan, totalDebt });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, date } = req.query;
    await loanService.makePayment(req.params.id, amount, date);
    res.json({ message: 'Payment processed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/partial-payment', async (req, res) => {
  try {
    const { amount, date } = req.query;
    await loanService.makePartialPayment(req.params.id, amount, date);
    res.json({ message: 'Partial payment processed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/movements', async (req, res) => {
  try {
    const movements = await loanService.getMovements(req.params.id);
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;