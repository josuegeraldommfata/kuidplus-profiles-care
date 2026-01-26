const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validation rules for user registration
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .isIn(['contratante', 'profissional'])
    .withMessage('Role deve ser contratante ou profissional'),
  handleValidationErrors
];

// Validation rules for professional creation
const validateProfessionalCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('profession')
    .trim()
    .notEmpty()
    .withMessage('Profissão é obrigatória'),
  body('whatsapp')
    .matches(/^\d{10,15}$/)
    .withMessage('WhatsApp deve conter apenas números (10-15 dígitos)'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateProfessionalCreation,
  handleValidationErrors
};
