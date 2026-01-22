const mongoose = require('mongoose');
// const User = require('./usermodels');


const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cumulativeProducts',
    },
    description: { type: String },
    singleSalePrice: { type: Number, required: true },
    totalPrice: { type: Number },
    singleProfit: { type: Number },
    totalProfit: { type: Number },
    quantity: { type: Number, required: true },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    includeVAT: { type: Boolean },
    SingleVATamount: { type: Number, default: 0},
    totalVATamount: { type: Number},
    buyer: {
        buyerName: { type: String },
        phoneNumber: { type: String },
        tinNumber: { type: String },
    },
    paymentMethod: {
        type: String,
        enum: ['bank', 'cash'],
        required: true,
    },
    itemIdentification: { type: String },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
    },
    updatedAt: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
  }}
);

const cumulativesalesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cumulativeProducts',
    },
    minimumSalePrice: { type: Number},
    maximumSalePrice: { type: Number},
    totalSalePrice: { type: Number },
    minimumProfit: { type: Number },
    maximumProfit: { type: Number },
    totalProfit: { type: Number },
    totalVATamount: { type: Number },
    quantity: { type: Number, required: true },
}, {
    timestamps: {
        currentTime: () => new Date().getTime() + (3 * 60 * 60 * 1000) // Adjust for GMT+3 (3 hours ahead of UTC)
      }
});

const Sale = mongoose.model('Sale', saleSchema);
const Cumulativesales = mongoose.model('cumulativesales', cumulativesalesSchema);
module.exports = {
    Sale,
    Cumulativesales,
};
