const express = require('express');
const router = express.Router();
const { registerUser, 
        loginUser, 
        logoutUser, 
        getUserProfile, 
        loginStatus, 
        updateUserProfile, 
        updateUserPassword,
        forgotPassword,
        resetPassword,
        getAllUsersData,
        deleteUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/loggedin', loginStatus);
router.patch('/updateprofile', protect, updateUserProfile);
router.patch('/updatepassword', protect, updateUserPassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/', protect, getAllUsersData);
router.delete('/:id', protect, deleteUser);


module.exports = router;