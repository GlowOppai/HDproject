const express = require('express');
const router = express.Router();
const {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  generateMealPlan
} = require('../controllers/mealsController');

// GET  /api/meals           - Get all meal plans
router.get('/', getAllMealPlans);

// POST /api/meals/generate  - Auto-generate a meal plan
router.post('/generate', generateMealPlan);

// GET  /api/meals/:id       - Get single meal plan
router.get('/:id', getMealPlanById);

// POST /api/meals           - Create a meal plan
router.post('/', createMealPlan);

// PUT  /api/meals/:id       - Update a meal plan
router.put('/:id', updateMealPlan);

// DELETE /api/meals/:id     - Delete a meal plan
router.delete('/:id', deleteMealPlan);

module.exports = router;
