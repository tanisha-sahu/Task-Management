const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/view', protect, getTasks);
router.post('/create', protect, createTask);
router.get('/view/:id', protect, getTaskById);
router.put('/edit/:id', protect, updateTask);
router.delete('/delete/:id', protect, deleteTask);

module.exports = router;