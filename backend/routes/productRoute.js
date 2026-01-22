const { createCategory, getCategories, getProducts, CreateProduct, getProductById, 
        getCumulativeProducts, deleteProduct, UpdateProduct, deleteCumulativeProduct} = require('../controllers/productController');
const {CreateBulkProduct, updateBulkProduct } = require('../controllers/bulkProductController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {upload, fileSizeFormatter} = require('../utils/fileUpload');

router.get('/cumulativeProduct', protect, getCumulativeProducts);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/createProducts', protect, upload.single("image"), CreateProduct);
// router.post('/createCategory', protect, createCategory);
// router.get('/createCategory/getCategories', protect, getCategories);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id', protect, upload.single("image"), UpdateProduct)
router.post('/createBulkProduct', protect, CreateBulkProduct);
router.post('/updateBulkProduct', protect, updateBulkProduct);
router.delete('/deleteCumulativeProduct/:id', protect, deleteCumulativeProduct);
module.exports = router;