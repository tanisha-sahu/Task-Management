const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'done'],
        default: 'pending',
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;