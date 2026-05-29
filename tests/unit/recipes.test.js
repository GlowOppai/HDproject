const recipesController = require('../../src/controllers/recipesController');

// Mock request/response helpers
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Recipes Controller - Unit Tests', () => {
  describe('getAllRecipes', () => {
    test('should return all recipes without filters', () => {
      const req = { query: {} };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      expect(res.json).toHaveBeenCalled();
      const result = res.json.mock.calls[0][0];
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('data');
      expect(result.count).toBeGreaterThan(0);
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should filter by category', () => {
      const req = { query: { category: 'high-protein' } };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(recipe => {
        expect(recipe.category).toBe('high-protein');
      });
    });

    test('should filter by dietary tag', () => {
      const req = { query: { dietaryTag: 'vegan' } };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(recipe => {
        expect(recipe.dietaryTags).toContain('vegan');
      });
    });

    test('should filter by maxCalories', () => {
      const req = { query: { maxCalories: '300' } };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(recipe => {
        expect(recipe.calories).toBeLessThanOrEqual(300);
      });
    });

    test('should filter by minProtein', () => {
      const req = { query: { minProtein: '30' } };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(recipe => {
        expect(recipe.nutrients.protein).toBeGreaterThanOrEqual(30);
      });
    });

    test('should ignore invalid maxCalories value', () => {
      const req = { query: { maxCalories: 'notANumber' } };
      const res = mockRes();

      recipesController.getAllRecipes(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.count).toBeGreaterThan(0);
    });
  });

  describe('getRecipeById', () => {
    test('should return a recipe for a valid ID', () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      recipesController.getRecipeById(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result).toHaveProperty('data');
      expect(result.data.id).toBe('1');
    });

    test('should return 404 for invalid ID', () => {
      const req = { params: { id: 'nonexistent' } };
      const res = mockRes();

      recipesController.getRecipeById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('getRecommendations', () => {
    test('should return weight-loss recipes', () => {
      const req = { query: { goal: 'weight-loss' } };
      const res = mockRes();

      recipesController.getRecommendations(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.goal).toBe('weight-loss');
      expect(result.data.length).toBeGreaterThanOrEqual(0);
    });

    test('should return muscle-gain recipes', () => {
      const req = { query: { goal: 'muscle-gain' } };
      const res = mockRes();

      recipesController.getRecommendations(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.goal).toBe('muscle-gain');
    });

    test('should return general goal when no goal specified', () => {
      const req = { query: {} };
      const res = mockRes();

      recipesController.getRecommendations(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.goal).toBe('general');
    });
  });

  describe('getDietaryTags', () => {
    test('should return an array of dietary tags', () => {
      const req = {};
      const res = mockRes();

      recipesController.getDietaryTags(req, res);

      const result = res.json.mock.calls[0][0];
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    test('should return unique tags only', () => {
      const req = {};
      const res = mockRes();

      recipesController.getDietaryTags(req, res);

      const result = res.json.mock.calls[0][0];
      const uniqueTags = [...new Set(result.data)];
      expect(result.data.length).toBe(uniqueTags.length);
    });
  });

  describe('getCategories', () => {
    test('should return all recipe categories', () => {
      const req = {};
      const res = mockRes();

      recipesController.getCategories(req, res);

      const result = res.json.mock.calls[0][0];
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toContain('high-protein');
    });
  });
});
