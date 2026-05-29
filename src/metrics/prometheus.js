const client = require('prom-client');
const express = require('express');

// Enable default metrics (CPU, memory, event loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'nutrihelp_' });

// Custom: HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'nutrihelp_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

// Custom: Total HTTP requests counter
const httpRequestsTotal = new client.Counter({
  name: 'nutrihelp_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Custom: Active connections gauge
const activeConnections = new client.Gauge({
  name: 'nutrihelp_active_connections',
  help: 'Number of active connections',
  registers: [register]
});

// Custom: Recipe search counter
const recipeSearches = new client.Counter({
  name: 'nutrihelp_recipe_searches_total',
  help: 'Total number of recipe search requests',
  labelNames: ['goal', 'dietary_tag'],
  registers: [register]
});

// Custom: Meal plan creations counter
const mealPlanCreations = new client.Counter({
  name: 'nutrihelp_meal_plan_creations_total',
  help: 'Total number of meal plans created',
  labelNames: ['goal'],
  registers: [register]
});

// Middleware to measure request duration
const httpRequestDurationMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  activeConnections.inc();

  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };

    end(labels);
    httpRequestsTotal.inc(labels);
    activeConnections.dec();
  });

  next();
};

// Metrics endpoint router
const metricsRouter = express.Router();

metricsRouter.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = {
  register,
  httpRequestDuration,
  httpRequestsTotal,
  activeConnections,
  recipeSearches,
  mealPlanCreations,
  httpRequestDurationMiddleware,
  metricsRouter
};
