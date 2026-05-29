const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  getRecommendations,
  getDietaryTags,
  getCategories
} = require('../controllers/recipesController');

// GET /api/recipes          - List all recipes (with optional filters)
router.get('/', getAllRecipes);

// GET /api/recipes/tags     - Get all dietary tags
router.get('/tags', getDietaryTags);

// GET /api/recipes/categories - Get all categories
router.get('/categories', getCategories);

// GET /api/recipes/recommendations - Get personalised recommendations
router.get('/recommendations', getRecommendations);

// GET /api/recipes/:id      - Get single recipe
router.get('/:id', getRecipeById);

module.exports = router;
