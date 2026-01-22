const { getsales, CreateSales, getsaleById, 
        getCumulativesales, deletesale, Updatesale} = require('../controllers/salesController');
const {getReports} = require('../controllers/reportsController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {upload, fileSizeFormatter} = require('../utils/fileUpload');

router.get('/cumulativesale', protect, getCumulativesales);
router.get('/', protect, getsales);
router.get('/:id', protect, getsaleById);
router.post('/createsales', protect, CreateSales);
router.delete('/:id', protect, deletesale);
router.patch('/:id', protect, upload.single("image"), Updatesale)
router.post('/reports', protect, getReports)
module.exports = router;