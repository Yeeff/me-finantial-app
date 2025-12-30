const personRepository = require('../repositories/PersonRepository');
const loanRepository = require('../repositories/LoanRepository');
const { Movement } = require('../models');
const { Op } = require('sequelize');

function generateAccessCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) code += letters[Math.floor(Math.random() * letters.length)];
  code += '-';
  for (let i = 0; i < 3; i++) code += numbers[Math.floor(Math.random() * numbers.length)];
  code += '-';
  for (let i = 0; i < 3; i++) code += letters[Math.floor(Math.random() * letters.length)];
  return code;
}

class LoanService {
  async createLoan(personId, initialCapital, interestRate, interestType, startDate, notes) {
    const person = await personRepository.findById(personId);
    if (!person) throw new Error('Person not found');

    const loan = await loanRepository.create({
      personId,
      initialCapital,
      currentCapital: initialCapital,
      interestRate,
      interestType,
      startDate,
      lastConsolidationDate: startDate,
      status: 'ACTIVE',
    });

    // Generate unique access code
    let accessCode;
    let existingLoan;
    do {
      accessCode = generateAccessCode();
      existingLoan = await loanRepository.findByAccessCode(accessCode);
    } while (existingLoan);

    const updatedLoan = await loanRepository.update(loan.id, {
      accessCode,
      accessLink: `https://tuapp.com/loan/${loan.id}`
    });

    return updatedLoan;
  }

  async getLoan(id) {
    const loan = await loanRepository.findById(id);
    if (!loan) throw new Error('Loan not found');
    return loan;
  }

  calculateAccruedInterest(loan, toDate) {
    const days = Math.floor((new Date(toDate) - new Date(loan.lastConsolidationDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 0;

    let dailyRate;
    if (loan.interestType === 'MONTHLY') {
      dailyRate = parseFloat(loan.interestRate) / 30;
    } else { // ANNUAL
      dailyRate = parseFloat(loan.interestRate) / 365;
    }

    return parseFloat(loan.currentCapital) * dailyRate * days;
  }

  getTotalDebt(loan) {
    const interest = this.calculateAccruedInterest(loan, new Date());
    return parseFloat(loan.currentCapital) + interest;
  }

  async makePayment(loanId, paymentAmount, paymentDate) {
    const loan = await this.getLoan(loanId);
    if (loan.status !== 'ACTIVE') throw new Error('Loan is not active');

    const capitalBefore = parseFloat(loan.currentCapital);
    const accruedInterest = this.calculateAccruedInterest(loan, paymentDate);
    const daysCalculated = Math.floor((new Date(paymentDate) - new Date(loan.lastConsolidationDate)) / (1000 * 60 * 60 * 24));

    // Record interest consolidation
    await Movement.create({
      loanId,
      type: 'INTEREST_CONSOLIDATION',
      amount: accruedInterest,
      interestAmount: accruedInterest,
      capitalAmount: 0,
      daysCalculated,
      capitalBefore,
      capitalAfter: capitalBefore,
      movementDate: paymentDate,
      notes: 'Interest consolidation on payment',
    });

    // Apply payment: first to interest, then to capital
    let remainingPayment = parseFloat(paymentAmount);
    let interestPaid = 0;
    let capitalPaid = 0;

    if (accruedInterest > 0) {
      interestPaid = Math.min(accruedInterest, remainingPayment);
      remainingPayment -= interestPaid;
    }

    if (remainingPayment > 0) {
      capitalPaid = Math.min(parseFloat(loan.currentCapital), remainingPayment);
      loan.currentCapital = parseFloat(loan.currentCapital) - capitalPaid;
    }

    const capitalAfter = parseFloat(loan.currentCapital);

    // Record payment movement
    await Movement.create({
      loanId,
      type: 'PAYMENT',
      amount: parseFloat(paymentAmount),
      interestAmount: interestPaid,
      capitalAmount: capitalPaid,
      daysCalculated,
      capitalBefore,
      capitalAfter,
      movementDate: paymentDate,
      notes: 'Payment received',
    });

    // Update last consolidation date
    loan.lastConsolidationDate = paymentDate;

    // Check if paid off
    if (parseFloat(loan.currentCapital) === 0) {
      loan.status = 'PAID';
      await Movement.create({
        loanId,
        type: 'INTEREST_CONSOLIDATION',
        amount: 0,
        interestAmount: 0,
        capitalAmount: 0,
        daysCalculated: 0,
        capitalBefore: capitalAfter,
        capitalAfter: capitalAfter,
        movementDate: paymentDate,
        notes: 'Loan fully paid',
      });
    }

    await loan.save();
  }

  async makePartialPayment(loanId, abonoAmount, abonoDate) {
    await this.makePayment(loanId, abonoAmount, abonoDate);
  }

  async getMovements(loanId) {
    const loan = await this.getLoan(loanId);
    return await Movement.findAll({ where: { loanId } });
  }

  async getAllLoans() {
    return await loanRepository.findWithPerson();
  }
}

module.exports = new LoanService();