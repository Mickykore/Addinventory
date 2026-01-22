const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Object, default: {} },
    category: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    orderBy: {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    }
}, {
    timestamps: {
        currentTime: () => new Date().getTime() + (3 * 60 * 60 * 1000) // Adjust for GMT+3 (3 hours ahead of UTC)
      }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
