const mongoose = require('mongoose');


module.exports = mongoose.model('Task', new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum:['PENDING', 'DONE', 'CANCELLED', 'OPEN'], default: 'PENDING'},
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}));