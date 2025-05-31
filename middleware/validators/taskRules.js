const {body} = require('express-validator');

exports.taskValidationRules = [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Description is required'),
    body('status')
        .isIn(['PENDING', 'DONE', 'CANCELLED', 'OPEN'])
        .withMessage('Status must be OPEN, PENDING, CANCELLED, or DONE'),
    body('assignee')
        .isMongoId()
        .withMessage('A valid assignee ID is required for a task')
];