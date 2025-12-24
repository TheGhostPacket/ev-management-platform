const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const chargingStationController = require('../controllers/chargingStationController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');

router.get('/', apiLimiter, chargingStationController.getAll);
router.get('/:id', apiLimiter, chargingStationController.getById);

router.post('/',
  authenticateToken,
  authorize('admin'),
  [
    body('station_name').notEmpty().trim().withMessage('Station name is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
    body('charger_type').notEmpty().withMessage('Charger type is required'),
    body('power_output_kw').isFloat({ min: 0 }).withMessage('Valid power output is required')
  ],
  validate,
  chargingStationController.create
);

router.put('/:id', authenticateToken, authorize('admin', 'editor'), chargingStationController.update);
router.delete('/:id', authenticateToken, authorize('admin'), chargingStationController.delete);

module.exports = router;
