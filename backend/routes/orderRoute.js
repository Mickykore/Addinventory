const {getOrders, createOrder, getOrderById, deleteOrder, updateOrder} = require('../controllers/orderController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {upload, fileSizeFormatter} = require('../utils/fileUpload');


router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/createOrders', protect, upload.single("image"), createOrder);
router.delete('/:id', protect, deleteOrder);
router.patch('/:id', protect, upload.single("image"), updateOrder)

module.exports = router;
