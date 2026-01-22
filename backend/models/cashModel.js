const mongoose = require('mongoose');

const cashSchema = new mongoose.Schema({
    cashInShop: { type: Number},
    cashInBank: { type: Number},
    bankDepositsAmount: { type: Number},
    bankName: { type: String},
}, {
    timestamps: {
        currentTime: () => new Date().getTime() + (3 * 60 * 60 * 1000) // Adjust for GMT+3 (3 hours ahead of UTC)
      }
});

const Cash = mongoose.model('Order', cashSchema);

module.exports = Cash;
