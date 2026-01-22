const {AdminSecretKey, EmployeeSecretKey} = require('../models/secretKeyModel');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const User = require('../models/usermodels');

// Function to update the secret key
const updateSecretKey = asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
    const user = await User.findById(req.user._id);


    if(user && user.userType === 'admin') {

    const {adminSecretKey, employeeSecretKey, password} = req.body;


        if((!adminSecretKey && !employeeSecretKey) || !password) {
            res.status(400)
            throw new Error('Please fill all required fields');
        }
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if(!passwordIsCorrect) {
            res.status(400)
            throw new Error('Invalid Password');
        }
        // save new secrt keys
        const existingEmployeeSecretKey = await EmployeeSecretKey.findOne({});
        const existingAdminSecretKey = await AdminSecretKey.findOne({});

        if(existingEmployeeSecretKey && employeeSecretKey) {
            existingEmployeeSecretKey.employeeSecretKey = employeeSecretKey;
            await existingEmployeeSecretKey.save();
        } else if(employeeSecretKey){
            const newEmployeeSecretKey = new EmployeeSecretKey({
                employeeSecretKey
            });
            await newEmployeeSecretKey.save();
        }

        if(existingAdminSecretKey && adminSecretKey) {
            existingAdminSecretKey.adminSecretKey = adminSecretKey;
            await existingAdminSecretKey.save();
        } else if(adminSecretKey) {
            const newAdminSecretKey = new AdminSecretKey({
                adminSecretKey
            });
            await newAdminSecretKey.save();
        }
    } else {
        res.status(404)
        throw new Error('User not found');
    }
    res.status(200).json({message: 'Secret keys updated successfully'});
} catch (error) {
    console.log(error);
    res.status(400)
    throw new Error(error.message);
}
});

module.exports = {
    updateSecretKey,
};