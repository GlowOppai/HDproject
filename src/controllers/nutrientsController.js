const { nutrients, goalSuggestions } = require('../data/nutrients');

/**
 * Get all nutrients
 */
const getAllNutrients = (req, res) => {
  const { category } = req.query;

  let filtered = [...nutrients];

  if (category) {
    filtered = filtered.filter(n => n.category === category);
  }

  res.json({ count: filtered.length, data: filtered });
};

/**
 * Get a single nutrient by ID
 */
const getNutrientById = (req, res) => {
  const nutrient = nutrients.find(n => n.id === req.params.id);

  if (!nutrient) {
    return res.status(404).json({ error: 'Nutrient not found' });
  }

  res.json({ data: nutrient });
};

/**
 * Get nutrient suggestions based on health goal
 */
const getSuggestionsByGoal = (req, res) => {
  const { goal } = req.params;

  const validGoals = Object.keys(goalSuggestions);

  if (!validGoals.includes(goal)) {
    return res.status(400).json({
      error: `Invalid goal. Valid goals are: ${validGoals.join(', ')}`
    });
  }

  const suggestedIds = goalSuggestions[goal];
  const suggested = nutrients.filter(n => suggestedIds.includes(n.id));

  res.json({
    goal,
    count: suggested.length,
    data: suggested
  });
};

/**
 * Calculate nutrient intake based on a list of recipe IDs
 */
const calculateIntake = (req, res) => {
  const recipes = require('../data/recipes');
  const { recipeIds, gender } = req.body;

  if (!recipeIds || !Array.isArray(recipeIds)) {
    return res.status(400).json({ error: 'recipeIds must be an array' });
  }

  const selectedRecipes = recipes.filter(r => recipeIds.includes(r.id));

  const totals = selectedRecipes.reduce(
    (acc, recipe) => {
      acc.protein += recipe.nutrients.protein || 0;
      acc.carbs += recipe.nutrients.carbs || 0;
      acc.fat += recipe.nutrients.fat || 0;
      acc.fibre += recipe.nutrients.fibre || 0;
      acc.calories += recipe.calories || 0;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0, fibre: 0, calories: 0 }
  );

  const userGender = gender || 'female';
  const recommendations = {
    protein: userGender === 'male' ? 56 : 46,
    fibre: userGender === 'male' ? 38 : 25,
    calories: userGender === 'male' ? 2500 : 2000
  };

  const analysis = {
    totals,
    recommendations,
    meetsGoals: {
      protein: totals.protein >= recommendations.protein,
      fibre: totals.fibre >= recommendations.fibre,
      caloriesInRange: totals.calories <= recommendations.calories
    }
  };

  res.json({ data: analysis });
};

/**
 * Get all nutrient categories
 */
const getCategories = (req, res) => {
  const categories = [...new Set(nutrients.map(n => n.category))].sort();
  res.json({ data: categories });
};

module.exports = {
  getAllNutrients,
  getNutrientById,
  getSuggestionsByGoal,
  calculateIntake,
  getCategories
};
