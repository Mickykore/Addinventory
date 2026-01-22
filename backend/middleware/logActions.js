// middleware/logActions.js
const Log = require('../models/Log');

const logAction = (userId, actionType, actionInfo) => {
  const log = new Log({
    userId,
    actionType,
    actionInfo
  });
  log.save((err) => {
    if (err) {
      console.error('Error logging action:', err);
    }
  });
};

module.exports = logAction;
