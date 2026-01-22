const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSecretKeySchema = new mongoose.Schema({
    adminSecretKey: {
        type: String,
    },
});

adminSecretKeySchema.pre('save', async function(next) {
    try {
        if (this.isModified('adminSecretKey') && this.adminSecretKey) { // Check if adminSecretKey is modified and not undefined
            const salt = await bcrypt.genSalt(10);
            this.adminSecretKey = await bcrypt.hash(this.adminSecretKey, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const AdminSecretKey = mongoose.model('AdminSecretKey', adminSecretKeySchema);

const employeeSecretKeySchema = new mongoose.Schema({
    employeeSecretKey: {
        type: String,
    }
});

employeeSecretKeySchema.pre('save', async function(next) {
    try {
        if (this.isModified('employeeSecretKey') && this.employeeSecretKey) { // Check if employeeSecretKey is modified and not undefined
            const salt = await bcrypt.genSalt(10);
            this.employeeSecretKey = await bcrypt.hash(this.employeeSecretKey, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const EmployeeSecretKey = mongoose.model('EmployeeSecretKey', employeeSecretKeySchema);

module.exports = {
    AdminSecretKey,
    EmployeeSecretKey
};
