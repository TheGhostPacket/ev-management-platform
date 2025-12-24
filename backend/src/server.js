require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { globalLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/validator');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ====================================
// SECURITY MIDDLEWARE
// ====================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ====================================
// CORS CONFIGURATION
// ====================================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ====================================
// GENERAL MIDDLEWARE
// ====================================
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use(globalLimiter);

// ====================================
// API ROUTES
// ====================================
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EV Management Platform API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/v1/health'
  });
});

// ====================================
// ERROR HANDLING
// ====================================
app.use(notFoundHandler);
app.use(errorHandler);

// ====================================
// START SERVER
// ====================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   EV Management Platform API          ║
║   Environment: ${process.env.NODE_ENV || 'development'}               ║
║   Port: ${PORT}                           ║
║   Version: ${process.env.API_VERSION || 'v1'}                        ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

module.exports = app;
