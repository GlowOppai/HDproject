const express = require('express');
const router = express.Router();
const {
  getAllNutrients,
  getNutrientById,
  getSuggestionsByGoal,
  calculateIntake,
  getCategories
} = require('../controllers/nutrientsController');

// GET  /api/nutrients           - List all nutrients
router.get('/', getAllNutrients);

// GET  /api/nutrients/categories - Get nutrient categories
router.get('/categories', getCategories);

// GET  /api/nutrients/suggestions/:goal - Goal-based suggestions
router.get('/suggestions/:goal', getSuggestionsByGoal);

// POST /api/nutrients/calculate - Calculate intake from recipes
router.post('/calculate', calculateIntake);

// GET  /api/nutrients/:id       - Get single nutrient
router.get('/:id', getNutrientById);

module.exports = router;
