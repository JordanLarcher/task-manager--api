const {body} = require('express-validator');

exports.taskValidationRules = [
    body('firstName').notEmpty().withMessage('First Name is required'),
    body('lastName').notEmpty().withMessage('Last Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('favoriteColor').notEmpty().withMessage('Favorite Color is required')
];