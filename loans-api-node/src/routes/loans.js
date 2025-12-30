const express = require('express');
const loanController = require('../controllers/LoanController');

const router = express.Router();

router.post('/', loanController.create.bind(loanController));
router.get('/', loanController.getAll.bind(loanController));
router.get('/:id', loanController.getById.bind(loanController));
router.post('/:id/payment', loanController.makePayment.bind(loanController));
router.post('/:id/partial-payment', loanController.makePartialPayment.bind(loanController));
router.get('/:id/movements', loanController.getMovements.bind(loanController));

module.exports = router;