const { createCategory, getCategories, deleteCategory, getCategoryById, UpdateCategory} = require('../controllers/productController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getCategories);
router.post('/createCategory', protect, createCategory);
router.delete('/deleteCategory/:id', protect, deleteCategory);
router.patch('/updateCategory/:id', protect, UpdateCategory);
router.get('/:id', protect, getCategoryById);

module.exports = router;