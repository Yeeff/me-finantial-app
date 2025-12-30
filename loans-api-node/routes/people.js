const express = require('express');
const { Op } = require('sequelize');
const { Person, Loan } = require('../models');
const loanService = require('../services/loanService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const persons = await Person.findAll({ include: [{ model: Loan, as: 'loans' }] });
    const result = persons.map(person => {
      const activeLoans = person.loans.filter(loan => loan.status === 'ACTIVE');
      const totalOwed = activeLoans.reduce((sum, loan) => sum + loanService.getTotalDebt(loan), 0);

      return {
        id: person.id,
        name: person.name,
        identification: person.identification,
        phone: person.phone,
        email: person.email,
        createdAt: person.createdAt,
        activeLoansCount: activeLoans.length,
        totalOwed,
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const { search } = req.query;
  if (!search) return res.status(400).json({ error: 'Search parameter required' });
  try {
    const persons = await Person.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { identification: { [Op.like]: `%${search}%` } }
        ]
      },
      include: [{ model: Loan, as: 'loans' }],
      limit: 5
    });
    const result = persons.map(person => {
      const activeLoans = person.loans.filter(loan => loan.status === 'ACTIVE');
      return {
        id: person.id,
        name: person.name,
        identification: person.identification,
        phone: person.phone,
        email: person.email,
        createdAt: person.createdAt,
        activeLoansCount: activeLoans.length,
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const persons = await Person.findAll({
      include: [{ model: Loan, as: 'loans' }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    const result = persons.map(person => {
      const activeLoans = person.loans.filter(loan => loan.status === 'ACTIVE');
      return {
        id: person.id,
        name: person.name,
        identification: person.identification,
        phone: person.phone,
        email: person.email,
        createdAt: person.createdAt,
        activeLoansCount: activeLoans.length,
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/loans', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id, { include: [{ model: Loan, as: 'loans' }] });
    if (!person) return res.status(404).json({ error: 'Person not found' });

    const activeLoans = person.loans
      .filter(loan => loan.status === 'ACTIVE')
      .map(loan => {
        const days = Math.floor((new Date() - new Date(loan.lastConsolidationDate)) / (1000 * 60 * 60 * 24));
        const accruedInterest = loanService.calculateAccruedInterest(loan, new Date());
        return {
          id: loan.id,
          currentCapital: loan.currentCapital,
          interestRate: loan.interestRate,
          interestType: loan.interestType,
          startDate: loan.startDate,
          lastConsolidationDate: loan.lastConsolidationDate,
          status: loan.status,
          daysAccrued: days,
          accruedInterest,
          totalOwed: parseFloat(loan.currentCapital) + accruedInterest,
        };
      });

    const paidLoans = person.loans
      .filter(loan => loan.status === 'PAID')
      .map(loan => ({
        id: loan.id,
        initialCapital: loan.initialCapital,
        status: loan.status,
        paidDate: loan.updatedAt,
      }));

    res.json({ activeLoans, paidLoans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;