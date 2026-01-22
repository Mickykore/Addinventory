const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {updateSecretKey} = require('../controllers/secretKeyController');

router.patch('/', protect, updateSecretKey);

module.exports = router;