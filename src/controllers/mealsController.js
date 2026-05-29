const { v4: uuidv4 } = require('uuid');
const meals = require('../data/meals');
const recipes = require('../data/recipes');

// In-memory store (simulates database)
let mealPlans = [...meals];

/**
 * Get all meal plans (optionally filter by userId)
 */
const getAllMealPlans = (req, res) => {
  const { userId, goal } = req.query;

  let filtered = [...mealPlans];

  if (userId) {
    filtered = filtered.filter(m => m.userId === userId);
  }

  if (goal) {
    filtered = filtered.filter(m => m.goal === goal);
  }

  res.json({ count: filtered.length, data: filtered });
};

/**
 * Get a single meal plan by ID
 */
const getMealPlanById = (req, res) => {
  const plan = mealPlans.find(m => m.id === req.params.id);

  if (!plan) {
    return res.status(404).json({ error: 'Meal plan not found' });
  }

  // Enrich with recipe details
  const enriched = {
    ...plan,
    days: plan.days.map(day => ({
      ...day,
      meals: day.meals.map(meal => ({
        ...meal,
        recipe: recipes.find(r => r.id === meal.recipeId) || null
      }))
    }))
  };

  res.json({ data: enriched });
};

/**
 * Create a new meal plan
 */
const createMealPlan = (req, res) => {
  const { userId, name, goal, totalCaloriesPerDay, days } = req.body;

  if (!userId || !name || !goal) {
    return res.status(400).json({
      error: 'Missing required fields: userId, name, goal'
    });
  }

  const validGoals = ['weight-loss', 'muscle-gain', 'maintenance', 'energy'];
  if (!validGoals.includes(goal)) {
    return res.status(400).json({
      error: `Invalid goal. Must be one of: ${validGoals.join(', ')}`
    });
  }

  const newPlan = {
    id: uuidv4(),
    userId,
    name,
    goal,
    totalCaloriesPerDay: totalCaloriesPerDay || 2000,
    createdAt: new Date().toISOString(),
    days: days || []
  };

  mealPlans.push(newPlan);

  res.status(201).json({ message: 'Meal plan created', data: newPlan });
};

/**
 * Update a meal plan
 */
const updateMealPlan = (req, res) => {
  const index = mealPlans.findIndex(m => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meal plan not found' });
  }

  const updated = {
    ...mealPlans[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  mealPlans[index] = updated;

  res.json({ message: 'Meal plan updated', data: updated });
};

/**
 * Delete a meal plan
 */
const deleteMealPlan = (req, res) => {
  const index = mealPlans.findIndex(m => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meal plan not found' });
  }

  mealPlans.splice(index, 1);

  res.json({ message: 'Meal plan deleted successfully' });
};

/**
 * Generate an auto meal plan based on goal and calories
 */
const generateMealPlan = (req, res) => {
  const { goal, targetCalories, days: numDays, userId } = req.body;

  if (!goal || !userId) {
    return res.status(400).json({ error: 'goal and userId are required' });
  }

  const target = parseInt(targetCalories, 10) || 2000;
  const daysCount = parseInt(numDays, 10) || 7;

  let suitableRecipes = [...recipes];

  if (goal === 'weight-loss') {
    suitableRecipes = suitableRecipes.filter(r => r.calories <= 400);
  } else if (goal === 'muscle-gain') {
    suitableRecipes = suitableRecipes.filter(r => r.nutrients.protein >= 20);
  }

  const planDays = Array.from({ length: daysCount }, (_, i) => {
    const dayRecipes = [];
    let remainingCalories = target;
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const times = ['07:30', '12:30', '18:30'];

    mealTypes.forEach((type, idx) => {
      const recipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
      if (recipe && remainingCalories > 0) {
        dayRecipes.push({
          type,
          recipeId: recipe.id,
          recipeName: recipe.name,
          calories: recipe.calories,
          time: times[idx]
        });
        remainingCalories -= recipe.calories;
      }
    });

    return { day: i + 1, meals: dayRecipes };
  });

  const generated = {
    id: uuidv4(),
    userId,
    name: `Auto-generated ${goal} plan`,
    goal,
    totalCaloriesPerDay: target,
    createdAt: new Date().toISOString(),
    days: planDays
  };

  mealPlans.push(generated);

  res.status(201).json({ message: 'Meal plan generated', data: generated });
};

module.exports = {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  generateMealPlan
};
