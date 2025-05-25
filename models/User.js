const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
}));