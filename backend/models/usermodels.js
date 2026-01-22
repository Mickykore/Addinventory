const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userSchema = new Schema({
    firstname: { type: String, required: [true, 'username is required'] },
    fathername: { type: String, required: [true, 'username is required'] },
    password: { 
        type: String, required: [true, 'password is required'], minlength: [6, 'password must be at least 6 characters'],
        // maxlength: [32, 'password must be at most 32 characters'] 
    },
    email: { 
        type: String, required: [true, 'email is required'], 
        unique: true, match: [emailRegex, 'Please enter a valid email address'] 
    },
    date: { type: Date, default: Date.now },
    userType: { type: String, default: "employee" },
    photo: { type: String, default: 'https://i.ibb.co/4pDNDk1/avatar.png' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: [200, 'bio must be at most 200 characters'] },
    lastLogin: { type: Date, default: null }    

}, { timestamps: true });

// decrypt password before saving user to database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const User = mongoose.model('user', userSchema);
module.exports = User;