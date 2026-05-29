const request = require('supertest');
const app = require('../../src/app');

describe('NutriHelp API - Integration Tests', () => {
  // ===== Health Check =====
  describe('GET /health', () => {
    test('should return 200 with healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    test('should return API info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.service).toBe('NutriHelp API');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  // ===== Recipes Endpoints =====
  describe('Recipes API', () => {
    test('GET /api/recipes - returns all recipes', async () => {
      const res = await request(app).get('/api/recipes');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('GET /api/recipes?category=high-protein - filters correctly', async () => {
      const res = await request(app)
        .get('/api/recipes')
        .query({ category: 'high-protein' });
      expect(res.status).toBe(200);
      res.body.data.forEach(recipe => {
        expect(recipe.category).toBe('high-protein');
      });
    });

    test('GET /api/recipes?maxCalories=300 - filters by calories', async () => {
      const res = await request(app)
        .get('/api/recipes')
        .query({ maxCalories: 300 });
      expect(res.status).toBe(200);
      res.body.data.forEach(recipe => {
        expect(recipe.calories).toBeLessThanOrEqual(300);
      });
    });

    test('GET /api/recipes/:id - returns single recipe', async () => {
      const res = await request(app).get('/api/recipes/1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1');
      expect(res.body.data).toHaveProperty('ingredients');
      expect(res.body.data).toHaveProperty('instructions');
    });

    test('GET /api/recipes/:id - returns 404 for unknown ID', async () => {
      const res = await request(app).get('/api/recipes/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    test('GET /api/recipes/tags - returns dietary tags', async () => {
      const res = await request(app).get('/api/recipes/tags');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/recipes/categories - returns categories', async () => {
      const res = await request(app).get('/api/recipes/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/recipes/recommendations?goal=weight-loss - returns recommendations', async () => {
      const res = await request(app)
        .get('/api/recipes/recommendations')
        .query({ goal: 'weight-loss' });
      expect(res.status).toBe(200);
      expect(res.body.goal).toBe('weight-loss');
    });
  });

  // ===== Meals Endpoints =====
  describe('Meals API', () => {
    test('GET /api/meals - returns all meal plans', async () => {
      const res = await request(app).get('/api/meals');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/meals/:id - returns enriched meal plan', async () => {
      const res = await request(app).get('/api/meals/m1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('m1');
    });

    test('GET /api/meals/:id - returns 404 for unknown ID', async () => {
      const res = await request(app).get('/api/meals/unknown99');
      expect(res.status).toBe(404);
    });

    test('POST /api/meals - creates a new meal plan', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({
          userId: 'testUser',
          name: 'Integration Test Plan',
          goal: 'maintenance',
          totalCaloriesPerDay: 1800
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.userId).toBe('testUser');
    });

    test('POST /api/meals - returns 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({ userId: 'testUser' });
      expect(res.status).toBe(400);
    });

    test('POST /api/meals/generate - auto-generates a plan', async () => {
      const res = await request(app)
        .post('/api/meals/generate')
        .send({
          goal: 'muscle-gain',
          targetCalories: 2500,
          days: 3,
          userId: 'genUser'
        });
      expect(res.status).toBe(201);
      expect(res.body.data.days.length).toBe(3);
    });
  });

  // ===== Nutrients Endpoints =====
  describe('Nutrients API', () => {
    test('GET /api/nutrients - returns all nutrients', async () => {
      const res = await request(app).get('/api/nutrients');
      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('GET /api/nutrients?category=vitamin - filters by category', async () => {
      const res = await request(app)
        .get('/api/nutrients')
        .query({ category: 'vitamin' });
      expect(res.status).toBe(200);
      res.body.data.forEach(n => {
        expect(n.category).toBe('vitamin');
      });
    });

    test('GET /api/nutrients/:id - returns single nutrient', async () => {
      const res = await request(app).get('/api/nutrients/n1');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Vitamin D');
    });

    test('GET /api/nutrients/suggestions/:goal - returns goal-based suggestions', async () => {
      const res = await request(app).get('/api/nutrients/suggestions/weight-loss');
      expect(res.status).toBe(200);
      expect(res.body.goal).toBe('weight-loss');
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('GET /api/nutrients/suggestions/:goal - 400 for invalid goal', async () => {
      const res = await request(app).get('/api/nutrients/suggestions/invalid-goal');
      expect(res.status).toBe(400);
    });

    test('POST /api/nutrients/calculate - calculates intake', async () => {
      const res = await request(app)
        .post('/api/nutrients/calculate')
        .send({ recipeIds: ['1', '2', '3'], gender: 'female' });
      expect(res.status).toBe(200);
      expect(res.body.data.totals.calories).toBeGreaterThan(0);
      expect(res.body.data).toHaveProperty('meetsGoals');
    });

    test('POST /api/nutrients/calculate - 400 without recipeIds', async () => {
      const res = await request(app)
        .post('/api/nutrients/calculate')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  // ===== Error Handling =====
  describe('Error Handling', () => {
    test('GET /unknown-endpoint - returns 404', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  // ===== Metrics =====
  describe('Metrics Endpoint', () => {
    test('GET /metrics - returns prometheus metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.status).toBe(200);
      expect(res.text).toContain('nutrihelp_');
    });
  });
});
