const Task = require('../models/task.model');

const getTasks = async (req, res) => {
    const { search, status, page = 1, limit = 10, sortBy = 'createdAt_desc' } = req.query;
    let query = { user: req.user._id };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    const [sortField, sortOrder] = sortBy.split('_');
    const sortObject = {};
    sortObject[sortField] = sortOrder === 'asc' ? 1 : -1;

    try {
        const tasks = await Task.find(query)
            .sort(sortObject) 
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const count = await Task.countDocuments(query);

        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, status } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Please add a title and description' });
    }

    try {
        const task = new Task({
            title,
            description,
            status,
            user: req.user._id,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask 
};
