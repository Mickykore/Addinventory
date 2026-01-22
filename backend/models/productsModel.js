const mongoose = require('mongoose');
// const User = require('./usermodels');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Object, default: {} },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true },
    description: { type: String },
    purchasedPrice: { type: Number, required: true },
    sellingPriceRange: {
        minSellingPrice: { type: Number, required: true },
        maxSellingPrice: { type: Number, required: true },
    },
    includeVAT: { type: Boolean },
    VATamount: { type: Number, default: 0},
    quantity: { type: Number, required: true },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    createdAt: {
            type: Date,
            default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
        },
        updatedAt: {
            type: Date,
            default: () => new Date(Date.now() + 3 * 60 * 60 * 1000) // GMT+3
    }}
);

// const cumulativeProducts = productSchema.clone();
const cumulativeProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Object, default: {} },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true },
    description: { type: String },
    purchasedPrice: { type: Number, required: true },
    sellingPriceRange: {
        minSellingPrice: { type: Number, required: true },
        maxSellingPrice: { type: Number, required: true },
    },
    totalVATamount: { type: Number, default: 0},
    quantity: { type: Number, required: true },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
}, {
    timestamps: true,
});


const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Products', productSchema);
const CumulativeProducts = mongoose.model('cumulativeProducts', cumulativeProductSchema);
module.exports = {
    Category,
    Product,
    CumulativeProducts,
};