const Task = require('../models/Task');

exports.getAllTask = async (req, res, next) => {
    try{
        const tasks = await Task.find().populate('assignee');
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ message: err.message});
    }
};

exports.getTaskById = async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found'});
        res.status(200).json(task);
    }catch (err) {
        next(err);
    }
}

exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, assignee } = req.body;
        const task = new Task({ title, description, status, assignee });
        const savedTask = await task.save();
        return res.status(201).json(savedTask);
    }  catch (err) {
        return res.status(400).json({ message: err.message});
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, status, assignee } = req.body;
        const updated = await Task.replaceOne({_id: req.params.id}, { title, description, status, assignee });
        if (updated.modifiedCount > 0) return res.status(204).send();
        else return res.status(404).json({ message: 'Task not found'});
    } catch (err) {
        return res.status(400).json({ message: err.message});
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const result = await Task.deleteOne({_id: req.params.id});
        if(result.deletedCount > 0) res.status(204).send();
        else return res.status(404).json({ message: 'Task not found'});
    }catch (err) {
        return res.status(500).json({ message: err.message});
    }
}