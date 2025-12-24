const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const evRoutes = require('./evRoutes');
const calculatorRoutes = require('./calculatorRoutes');
const chargingStationRoutes = require('./chargingStationRoutes');
const caseStudyRoutes = require('./caseStudyRoutes');

/**
 * API Health Check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EV Platform API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

/**
 * Mount all routes
 */
router.use('/auth', authRoutes);
router.use('/ev-models', evRoutes);
router.use('/calculator', calculatorRoutes);
router.use('/charging-stations', chargingStationRoutes);
router.use('/case-studies', caseStudyRoutes);

module.exports = router;
