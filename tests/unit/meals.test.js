const mealsController = require('../../src/controllers/mealsController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Meals Controller - Unit Tests', () => {
  describe('getAllMealPlans', () => {
    test('should return all meal plans', () => {
      const req = { query: {} };
      const res = mockRes();

      mealsController.getAllMealPlans(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should filter by userId', () => {
      const req = { query: { userId: 'user1' } };
      const res = mockRes();

      mealsController.getAllMealPlans(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(plan => {
        expect(plan.userId).toBe('user1');
      });
    });

    test('should filter by goal', () => {
      const req = { query: { goal: 'weight-loss' } };
      const res = mockRes();

      mealsController.getAllMealPlans(req, res);

      const result = res.json.mock.calls[0][0];
      result.data.forEach(plan => {
        expect(plan.goal).toBe('weight-loss');
      });
    });
  });

  describe('getMealPlanById', () => {
    test('should return enriched meal plan for valid ID', () => {
      const req = { params: { id: 'm1' } };
      const res = mockRes();

      mealsController.getMealPlanById(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result).toHaveProperty('data');
      expect(result.data.id).toBe('m1');
    });

    test('should return 404 for unknown ID', () => {
      const req = { params: { id: 'unknown' } };
      const res = mockRes();

      mealsController.getMealPlanById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createMealPlan', () => {
    test('should create a meal plan with valid data', () => {
      const req = {
        body: {
          userId: 'user99',
          name: 'Test Plan',
          goal: 'maintenance',
          totalCaloriesPerDay: 2000
        }
      };
      const res = mockRes();

      mealsController.createMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const result = res.json.mock.calls[0][0];
      expect(result.data.userId).toBe('user99');
      expect(result.data.goal).toBe('maintenance');
      expect(result.data).toHaveProperty('id');
    });

    test('should return 400 when required fields are missing', () => {
      const req = { body: { userId: 'user99' } };
      const res = mockRes();

      mealsController.createMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should return 400 for invalid goal', () => {
      const req = {
        body: { userId: 'user99', name: 'Test', goal: 'invalid-goal' }
      };
      const res = mockRes();

      mealsController.createMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteMealPlan', () => {
    test('should return 404 for unknown plan', () => {
      const req = { params: { id: 'notexist' } };
      const res = mockRes();

      mealsController.deleteMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('generateMealPlan', () => {
    test('should auto-generate a weight-loss plan', () => {
      const req = {
        body: {
          goal: 'weight-loss',
          targetCalories: 1500,
          days: 3,
          userId: 'userGen'
        }
      };
      const res = mockRes();

      mealsController.generateMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const result = res.json.mock.calls[0][0];
      expect(result.data.goal).toBe('weight-loss');
      expect(result.data.days.length).toBe(3);
    });

    test('should return 400 when goal is missing', () => {
      const req = { body: { userId: 'user99', targetCalories: 1500 } };
      const res = mockRes();

      mealsController.generateMealPlan(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
