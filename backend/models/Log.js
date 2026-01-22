// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true },
  actionInfo: { type: mongoose.Schema.Types.Mixed},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
