const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    createExpense,
    updateExpense,
    getAllExpenses,
    getExpenseById,
    deleteExpense
} = require('../controllers/expenseController');

// Routes for expenses
router.post('/createExpense', protect, createExpense);
router.get('/', protect, getAllExpenses);
router.get('/:id', protect, getExpenseById);
router.patch('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;