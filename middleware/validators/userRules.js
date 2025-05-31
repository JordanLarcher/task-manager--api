const {body} = require('express-validator');

exports.userValidationRules = [
    body('email').notEmpty().withMessage('Email is required and cannot be empty or null')
        .isEmail().withMessage('Invalid email format'),

    body('password').notEmpty().withMessage('Password is required and cannot be empty or null')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long'),

    body('role').notEmpty().withMessage('Role is required and cannot be empty or null')
        .isIn(['ADMIN','USER']).withMessage('The user must have a role either ADMIN or USER')
];