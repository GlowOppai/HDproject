const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const recipesRouter = require('./routes/recipes');
const mealsRouter = require('./routes/meals');
const nutrientsRouter = require('./routes/nutrients');
const { errorHandler } = require('./middleware/errorHandler');
const { metricsRouter, httpRequestDurationMiddleware } = require('./metrics/prometheus');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Request parsing & logging
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'test' ? 'silent' : 'combined'));

// Prometheus metrics middleware
app.use(httpRequestDurationMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'nutrihelp-api',
    version: process.env.APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/recipes', recipesRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/nutrients', nutrientsRouter);

// Prometheus metrics endpoint
app.use('/metrics', metricsRouter);

// Root info
app.get('/', (req, res) => {
  res.json({
    service: 'NutriHelp API',
    version: process.env.APP_VERSION || '1.0.0',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      recipes: '/api/recipes',
      meals: '/api/meals',
      nutrients: '/api/nutrients'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
