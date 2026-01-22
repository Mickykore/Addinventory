const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  expenseMethod: {
    type: String,
    required: true,
    default: 'Cash' // Default to 'Cash' if not provided
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
  },
  updatedAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = {
  Expense
};
