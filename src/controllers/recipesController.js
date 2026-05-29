const recipes = require('../data/recipes');

/**
 * Get all recipes with optional filtering
 */
const getAllRecipes = (req, res) => {
  const { category, dietaryTag, maxCalories, minProtein, cuisine } = req.query;

  let filtered = [...recipes];

  if (category) {
    filtered = filtered.filter(r => r.category === category);
  }

  if (dietaryTag) {
    filtered = filtered.filter(r => r.dietaryTags.includes(dietaryTag));
  }

  if (maxCalories) {
    const max = parseInt(maxCalories, 10);
    if (!isNaN(max)) {
      filtered = filtered.filter(r => r.calories <= max);
    }
  }

  if (minProtein) {
    const min = parseInt(minProtein, 10);
    if (!isNaN(min)) {
      filtered = filtered.filter(r => r.nutrients.protein >= min);
    }
  }

  if (cuisine) {
    filtered = filtered.filter(r =>
      r.cuisineType.toLowerCase().includes(cuisine.toLowerCase())
    );
  }

  res.json({
    count: filtered.length,
    data: filtered
  });
};

/**
 * Get a single recipe by ID
 */
const getRecipeById = (req, res) => {
  const recipe = recipes.find(r => r.id === req.params.id);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  res.json({ data: recipe });
};

/**
 * Get personalised recipe recommendations based on user profile
 */
const getRecommendations = (req, res) => {
  const { goal, calories, dietaryPreferences } = req.query;

  let recommended = [...recipes];

  if (goal === 'weight-loss') {
    recommended = recommended
      .filter(r => r.calories <= 400)
      .sort((a, b) => a.calories - b.calories);
  } else if (goal === 'muscle-gain') {
    recommended = recommended
      .filter(r => r.nutrients.protein >= 25)
      .sort((a, b) => b.nutrients.protein - a.nutrients.protein);
  } else if (goal === 'high-fibre') {
    recommended = recommended
      .sort((a, b) => b.nutrients.fibre - a.nutrients.fibre);
  }

  if (calories) {
    const max = parseInt(calories, 10);
    if (!isNaN(max)) {
      recommended = recommended.filter(r => r.calories <= max);
    }
  }

  if (dietaryPreferences) {
    const prefs = dietaryPreferences.split(',').map(p => p.trim());
    recommended = recommended.filter(r =>
      prefs.every(pref => r.dietaryTags.includes(pref))
    );
  }

  res.json({
    goal: goal || 'general',
    count: recommended.length,
    data: recommended.slice(0, 5)
  });
};

/**
 * Get all unique dietary tags
 */
const getDietaryTags = (req, res) => {
  const tags = [...new Set(recipes.flatMap(r => r.dietaryTags))].sort();
  res.json({ data: tags });
};

/**
 * Get all categories
 */
const getCategories = (req, res) => {
  const categories = [...new Set(recipes.map(r => r.category))].sort();
  res.json({ data: categories });
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecommendations,
  getDietaryTags,
  getCategories
};
