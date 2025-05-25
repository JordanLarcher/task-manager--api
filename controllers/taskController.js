const Task = require('../models/Task');

exports.getAllTask = async (req, res, next) => {
    try{
        const tasks = await Task.find().populate('assignee');
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ message: err.message});
    }
};


exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, assignee } = req.body;
        const task = new Task({ title, description, status, assignee });
        await task.save();
        return res.status(201).json(task);
    }  catch (err) {
        return res.status(400).json({ message: err.message});
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const update = (({ title, description, status, assignee }) =>
            ({ title, description, status, assignee }))(req.body);
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            update,
            {new: true, runValidators: true},
        );
        if(!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        return res.status(200).json(task);
    } catch (err) {
        return res.status(400).json({ message: err.message});
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if(!result) return res.status(404).json({ message: 'Task not found'});
    }catch (err) {
        return res.status(500).json({ message: err.message});
    }
}