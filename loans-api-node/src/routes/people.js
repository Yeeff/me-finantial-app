const express = require('express');
const personController = require('../controllers/PersonController');

const router = express.Router();

router.post('/', personController.create.bind(personController));
router.get('/', personController.getAll.bind(personController));
router.get('/search', personController.search.bind(personController));
router.get('/recent', personController.getRecent.bind(personController));
router.get('/:id', personController.getById.bind(personController));
router.get('/:id/loans', personController.getLoans.bind(personController));

module.exports = router;