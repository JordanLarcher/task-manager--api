const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema =  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password') || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);