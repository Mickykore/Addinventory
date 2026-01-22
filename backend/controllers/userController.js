const asyncHandler = require('express-async-handler');
const User = require('../models/usermodels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Token = require('../models/tokenmodel');
const sendEmail = require('../utils/sendemail');
const mongoose = require('mongoose');
const {AdminSecretKey, EmployeeSecretKey} = require('../models/secretKeyModel');
const capitalizeAndClean = require('../utils/stringUtils');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

const registerUser = asyncHandler(async (req, res) => {

    let { firstname, fathername, email, password, userType, adminSecretKey, employeeSecretKey } = req.body;

    firstname = capitalizeAndClean(firstname);
    fathername = capitalizeAndClean(fathername);
    
    if(!firstname || !fathername || !email || !password || (!adminSecretKey && userType === "admin") || 
    (!employeeSecretKey && userType === "employee")) {
        res.status(400)
        throw new Error('Please fill all required fields');
    }

    if(userType === "admin") {
        const existingAdminSecretKey = await AdminSecretKey.findOne({});
        if(existingAdminSecretKey) {
            const adminSecret = existingAdminSecretKey.adminSecretKey;
            const correctAdminSecret = await bcrypt.compare(adminSecretKey, adminSecret);
            if(!correctAdminSecret) {
                res.status(400)
                throw new Error('Invalid secret key');
            }
        } else {
            const correctAdminSecret = (adminSecretKey === process.env.ADMIN_SECRET_KEY);
            if(!correctAdminSecret) {
                res.status(400)
                throw new Error('Invalid secret key');
            }
        }
    }

    if(userType === "employee") {
        const existingEmployeeSecretKey = await EmployeeSecretKey.findOne({});
        if(existingEmployeeSecretKey) {
            const employeeSecret = existingEmployeeSecretKey.employeeSecretKey;
            const correctEmployeeSecret = await bcrypt.compare(employeeSecretKey, employeeSecret);
            if(!correctEmployeeSecret) {
                res.status(400)
                throw new Error('Invalid secret key');
            }
        } else {
            const correctEmployeeSecret = (employeeSecretKey === process.env.EMPLOYEE_SECRET_KEY);
            if(!correctEmployeeSecret) {
                res.status(400)
                throw new Error('Invalid secret key');
            }
        }
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!firstname || !fathername || !email || !password || (userType === "admin" && !adminSecretKey) || (userType === "employee" && !employeeSecretKey)) {
        res.status(400)
        throw new Error('Please fill all required fields');
    }
    if(password.length < 6) { 
        res.status(400)
        throw new Error('Password must be at least 6 characters');
    }
    if(password.length > 32) {
        res.status(400)
        throw new Error('Password must be at most 32 characters');
    }
    if(!req.body.email.match(emailRegex)) {
        res.status(400)
        throw new Error('Please enter a valid email address');
    }
    const userExists = await User.findOne({ email });
    if(userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    

    const user = await User.create({ firstname, fathername, email, password, userType });

    const token = generateToken(user._id);

    // send HTTP only cookie

    res.cookie('token', token, {
       "path": "/login",
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        sameSite: 'none',
        secure: true,
    });

    if(user) {
        const { _id, firstname, fathername, email, userType, photo } = user;
        res.status(201).json({
            message: 'User registered successfully!',
            _id,
            firstname, 
            fathername,
            email,
            photo,
            phone,
            userType,
            bio,
            token,
        });
    } else {
        res.status(400)
        throw new Error('Invalid user data');
    }
    // res.send('register user');
});
 
// login user
    const loginUser = asyncHandler(async (req, res) => {

        const { email, password } = req.body;

        if(!email || !password) {
            res.status(400)
            throw new Error('Please fill all required fields');
        }

        const user = await User.findOne({ email });
        if(!user) {
            res.status(400)
            throw new Error('Invalid email or password');
        }
        
        // check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        
        // generate token
        const token = generateToken(user._id);

        if(passwordIsCorrect) {
             // send HTTP only cookie
            res.cookie('token', token, {
                "path": "/",
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                sameSite: 'none',
                secure: true,
            });
        }
        if(user && passwordIsCorrect) {
        // Set lastLogin to now
        const currentDate = new Date();

        // Only set lastLogin if it's missing (for older users)
        if (!user.lastLogin) {
            user.lastLogin = currentDate;
        } else {
            // Update lastLogin only if already exists
            user.lastLogin = currentDate;
        }

        await user.save();

        const { _id, firstname, fathername, email, photo, phone, userType, bio, lastLogin } = user;
        console.log("lastLogin", user);
        res.status(201).json({
            _id,
            firstname,
            fathername,
            email,
            photo,
            phone,
            userType,
            bio,
            lastLogin,
            token,
            });
        } else {
            res.status(400)
            throw new Error('Invalid email or password');
        }

    });

    const logoutUser = asyncHandler(async (req, res) => {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: 'none',
            secure: true,

        });
        res.status(200).json({
            message: 'Logged out successfully',
        });
    });

    const getUserProfile = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id); 

        if(user) {
            res.json({
                _id: user._id,
                firstname: user.firstname,
                fathername: user.fathername,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                photo: user.photo,
            });
        } else {
            res.status(404)
            throw new Error('User not found');
        }

    });

    const getAllUsersData = asyncHandler(async (req, res) => {
        const users = await User.find({}); 

        if(users) {
            const specificUserData = users.map(user => ({
                _id: user._id,
                firstname: user.firstname,
                fathername: user.fathername,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                lastLogin: user.lastLogin,
              }));
            res.json(specificUserData);
        } else {
            res.status(404)
            throw new Error('no User found');
        }

    });

    const deleteUser = asyncHandler(async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400);
            throw new Error('Invalid sale ID');
        }
        console.log("id", req.params.id);
        const user = await User.findById(req.params.id);  
        // if(user.userType === "admin") {
        //     res.status(400);
        //     throw new Error('You cannot delete an admin');
        // }   
        console.log("user", user);
        if (!user) {
            res.status(404);
            throw new Error('user not found');
        }

        await user.deleteOne();
        res.json(user);
    });

    const loginStatus = asyncHandler(async (req, res) => {
        const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
    });

    const updateUserProfile = asyncHandler(async (req, res) => {

        const user = await User.findById(req.user._id);
        

        if(user) {
            let { firstname, fathername, email, photo, phone, password } = req.body;
            
            firstname = capitalizeAndClean(firstname);
            fathername = capitalizeAndClean(fathername);

            const passwordIsCorrect = await bcrypt.compare(password, user.password);
            console.log("password", passwordIsCorrect)

            if(!passwordIsCorrect) {
                res.status(400)
                throw new Error('Invalid password');
            }

            if (firstname){
                user.firstname = firstname;

            } 
            if (fathername) user.fathername = fathername;
            if (email) user.email = email;
            if (photo) user.photo = photo;
            if (phone) user.phone = phone;

            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                firstname: updatedUser.firstname,
                fathername: updatedUser.fathername,
                email: updatedUser.email,
                photo: updatedUser.photo,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
            });
            
        } else {
            res.status(404)
            throw new Error('User not found');
        }
        // res.send('update user profile');
    });

    const updateUserPassword = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        console.log("req", req.body)

        if(user) {
            // check if old password is correct
            const { oldPassword, newPassword } = req.body;
            if(!oldPassword || !newPassword) {
                res.status(400)
                throw new Error('Please fill all required fields');
            }
            const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
            if(!passwordIsCorrect) {
                res.status(400)
                throw new Error('Invalid Old Password');
            }
            // save new password
            user.password = req.body.newPassword;
            const updatedUser = await user.save();
            res.status(200).send('Password updated successfully');
        } else {
            res.status(404)
            throw new Error('User not found');
        }
    });

    const forgotPassword = asyncHandler(async (req, res) => {

        try {
        console.log("password forgeted")
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(400)
            throw new Error('Invalid email');
        }

        // if user previously requested for password reset delete the token
        let token = await Token.findOne({ userId: user._id });
        if(token) {
            await token.deleteOne();
        }
        // create reset token
        const resetToken = crypto.randomBytes(32).toString('hex') + user._id;

        // hash reset token and save to database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // save reset token and expiry date to database
        await Token.create({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        // construct reset password URL
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        // send email 
        const message = `
            <h1>Hello ${user.firstname} You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <p>The link will expire in 30 minutes</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

            <p>Ignore this email if you did not request a password reset</p>

            <p>Regards..</p>
            <p> Joka Team</p>
        `;

        const subject = 'Password Reset';
        const send_to = user.email;
        const sent_from = process.env.EMAIL_USER;

        try {
            await sendEmail(subject, message, send_to, sent_from);
            res.status(200).json({
                message: 'Password reset link sent to email',
            });
        } catch (error) {
            res.status(500)
            throw new Error('Email could not be sent try again');
        }
    } catch (error) {
        res.status(500)
        throw new Error('Password reset failed');
    }
        // res.send('forgot password');
    });

    const resetPassword = asyncHandler(async (req, res) => {
        const { password } = req.body;
        const { resetToken } = req.params;

        // hash reset token and find user
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const userToken = await Token.findOne({ token: hashedToken, expiresAt: { $gt: Date.now() } });
        if(!userToken) {
            res.status(400)
            throw new Error('Invalid or expired token');
        }

        // find user
        const user = await User.findOne({ _id: userToken.userId });
        if(!user) {
            res.status(404)
            throw new Error('User not found');
        }

        // save new password
        user.password = password;
        await user.save();
        res.status(200).json({message: 'reset password success pleace login'});
    });
 
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    loginStatus,
    updateUserProfile,
    updateUserPassword,
    forgotPassword,
    resetPassword,
    getAllUsersData,
    deleteUser,
    };