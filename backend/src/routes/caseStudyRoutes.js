const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const caseStudyController = require('../controllers/caseStudyController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');

router.get('/', apiLimiter, caseStudyController.getAll);
router.get('/:id', apiLimiter, caseStudyController.getById);

router.post('/',
  authenticateToken,
  authorize('admin', 'editor'),
  [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('country').notEmpty().trim().withMessage('Country is required'),
    body('industry').notEmpty().trim().withMessage('Industry is required'),
    body('problem_statement').notEmpty().withMessage('Problem statement is required'),
    body('findings').notEmpty().withMessage('Findings are required'),
    body('pros').isArray().withMessage('Pros must be an array'),
    body('cons').isArray().withMessage('Cons must be an array'),
    body('recommendations').notEmpty().withMessage('Recommendations are required')
  ],
  validate,
  caseStudyController.create
);

router.put('/:id', authenticateToken, authorize('admin', 'editor'), caseStudyController.update);
router.delete('/:id', authenticateToken, authorize('admin'), caseStudyController.delete);

module.exports = router;
