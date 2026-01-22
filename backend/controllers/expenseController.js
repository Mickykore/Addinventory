const asyncHandler = require('express-async-handler');
const { Expense } = require('../models/expenseModel');
const capitalizeAndClean = require('../utils/stringUtils');

// Create expense
const createExpense = asyncHandler(async (req, res, next) => {
  try {
  let { type, amount, description, date, expenseMethod } = req.body;
  console.log("ll", type)

  type = capitalizeAndClean(type);
  expenseMethod = capitalizeAndClean(expenseMethod);

  console.log("ok expense");
  if (!type || !amount || !expenseMethod) {
    res.status(400);
    throw new Error('Please fill all fields');
  }
  const expense = await Expense.create({ 
    type, 
    amount, 
    description,
    expenseMethod,
    ...(date && {
            createdAt: new Date(
                new Date(`${date}T${new Date().toISOString().split('T')[1]}`).getTime() + 3 * 60 * 60 * 1000
            )
        }),
   });
  res.status(201).json(expense);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update expense
const updateExpense = asyncHandler(async (req, res, next) => {
  try {
  const { id } = req.params;
  let { type, amount, description, date, expenseMethod } = req.body;

  console.log("ok expensegg", date);

  type = capitalizeAndClean(type);
  expenseMethod = capitalizeAndClean(expenseMethod);
  console.log("ok expenseddddd");


  if (!type || !amount || !expenseMethod) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const expense = await Expense.findByIdAndUpdate(
    id, 
    { type, amount, description, expenseMethod,
      ...(date && {
        createdAt: date,
      })
    }, 
    { new: true });

  if (!expense) {
    return res.status(404).json('Expense not found');
  }
  res.status(201).json(expense);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses
const getAllExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  console.log("ok expense");

  // Format createdAt to date only
  const formattedExpenses = expenses.map(expense => ({
    ...expense.toObject(),
    createdAt: new Date(expense.createdAt).toISOString().slice(0, 10)
  }));
  res.status(200).json(formattedExpenses);
});

// Get expense by ID
const getExpenseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  console.log("ok expense");
  if (!expense) {
    return res.status(404).json('Expense not found');
  }
  res.status(200).json(expense);
});

// Delete expense
const deleteExpense = asyncHandler(async (req, res, next) => {
  try {
  const { id } = req.params;
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    return res.status(404).json('Expense not found');
  }
  res.status(200).json('Expense deleted successfully');
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createExpense,
  updateExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense
};
