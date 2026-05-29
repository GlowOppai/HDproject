const nutrientsController = require('../../src/controllers/nutrientsController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Nutrients Controller - Unit Tests', () => {
  describe('getAllNutrients', () => {
    test('should return all nutrients', () => {
      const req = { query: {} };
      const res = mockRes();

      nutrientsController.getAllNutrients(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.count).toBeGreaterThan(0);
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should filter by category', () => {
      const req = { query: { category: 'vitamin' } };
      const res = mockRes();

      nutrientsController.getAllNutrients(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(n => {
        expect(n.category).toBe('vitamin');
      });
    });
  });

  describe('getNutrientById', () => {
    test('should return nutrient for valid ID', () => {
      const req = { params: { id: 'n1' } };
      const res = mockRes();

      nutrientsController.getNutrientById(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.data.id).toBe('n1');
      expect(result.data.name).toBe('Vitamin D');
    });

    test('should return 404 for unknown ID', () => {
      const req = { params: { id: 'unknown' } };
      const res = mockRes();

      nutrientsController.getNutrientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getSuggestionsByGoal', () => {
    test('should return suggestions for weight-loss', () => {
      const req = { params: { goal: 'weight-loss' } };
      const res = mockRes();

      nutrientsController.getSuggestionsByGoal(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.goal).toBe('weight-loss');
      expect(result.count).toBeGreaterThan(0);
    });

    test('should return suggestions for muscle-gain', () => {
      const req = { params: { goal: 'muscle-gain' } };
      const res = mockRes();

      nutrientsController.getSuggestionsByGoal(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.goal).toBe('muscle-gain');
    });

    test('should return 400 for invalid goal', () => {
      const req = { params: { goal: 'invalid-goal' } };
      const res = mockRes();

      nutrientsController.getSuggestionsByGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('calculateIntake', () => {
    test('should calculate nutrients for given recipe IDs', () => {
      const req = {
        body: { recipeIds: ['1', '2'], gender: 'female' }
      };
      const res = mockRes();

      nutrientsController.calculateIntake(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.data).toHaveProperty('totals');
      expect(result.data).toHaveProperty('recommendations');
      expect(result.data).toHaveProperty('meetsGoals');
      expect(result.data.totals.protein).toBeGreaterThan(0);
      expect(result.data.totals.calories).toBeGreaterThan(0);
    });

    test('should return 400 when recipeIds is not an array', () => {
      const req = { body: { recipeIds: 'not-array' } };
      const res = mockRes();

      nutrientsController.calculateIntake(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should return 400 when recipeIds is missing', () => {
      const req = { body: {} };
      const res = mockRes();

      nutrientsController.calculateIntake(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should handle male gender recommendations', () => {
      const req = {
        body: { recipeIds: ['1', '4'], gender: 'male' }
      };
      const res = mockRes();

      nutrientsController.calculateIntake(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.data.recommendations.protein).toBe(56);
      expect(result.data.recommendations.fibre).toBe(38);
    });
  });

  describe('getCategories', () => {
    test('should return all nutrient categories', () => {
      const req = {};
      const res = mockRes();

      nutrientsController.getCategories(req, res);

      const result = res.json.mock.calls[0][0];
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toContain('vitamin');
      expect(result.data).toContain('mineral');
    });
  });
});
