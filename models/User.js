const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
}));