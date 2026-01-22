const asyncHandler = require('express-async-handler');
const User = require('../models/usermodels');
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(401)
            throw new Error('Not authorized');
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // get user from token
        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
        next();
    } catch (error) {
        res.status(401)
        throw new Error('Not authorized, token failed');
    }
});

module.exports = protect;