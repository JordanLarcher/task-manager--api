const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    // Status can be PENDING, DONE, CANCELLED, or OPEN
    status: { type: String, enum:['PENDING', 'DONE', 'CANCELLED', 'OPEN'], default: 'PENDING'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // Reference to the User model for the assignee
    color: { type: String, default: '#FFFFFF' }, // Default color for the task
    tags: [{ type: String }], // Array of tags for the task
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;