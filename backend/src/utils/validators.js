const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array(),
      },
    });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['citizen', 'policymaker']),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors,
];

const proposalValidation = [
  body('title').trim().notEmpty().isLength({ min: 5 }),
  body('description').trim().notEmpty().isLength({ min: 20 }),
  body('category').isIn(['education', 'healthcare', 'infrastructure', 'environment', 'economy', 'social', 'other']),
  handleValidationErrors,
];

const feedbackValidation = [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty().isLength({ min: 10 }),
  body('category').isIn(['suggestion', 'concern', 'question', 'support', 'opposition']),
  handleValidationErrors,
];

const commentValidation = [
  body('content').trim().notEmpty().isLength({ min: 1 }),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  proposalValidation,
  feedbackValidation,
  commentValidation,
};
