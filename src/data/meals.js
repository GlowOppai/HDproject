const meals = [
  {
    id: 'm1',
    userId: 'user1',
    name: '7-Day Weight Loss Plan',
    goal: 'weight-loss',
    totalCaloriesPerDay: 1500,
    createdAt: '2024-01-15T08:00:00.000Z',
    days: [
      {
        day: 1,
        meals: [
          { type: 'breakfast', recipeId: '5', time: '07:30' },
          { type: 'lunch', recipeId: '3', time: '12:30' },
          { type: 'dinner', recipeId: '1', time: '18:30' }
        ]
      },
      {
        day: 2,
        meals: [
          { type: 'breakfast', recipeId: '2', time: '07:30' },
          { type: 'lunch', recipeId: '5', time: '12:30' },
          { type: 'dinner', recipeId: '3', time: '18:30' }
        ]
      }
    ]
  },
  {
    id: 'm2',
    userId: 'user2',
    name: 'High Protein Muscle Building',
    goal: 'muscle-gain',
    totalCaloriesPerDay: 2500,
    createdAt: '2024-01-16T08:00:00.000Z',
    days: [
      {
        day: 1,
        meals: [
          { type: 'breakfast', recipeId: '2', time: '07:00' },
          { type: 'lunch', recipeId: '4', time: '12:00' },
          { type: 'snack', recipeId: '5', time: '15:00' },
          { type: 'dinner', recipeId: '1', time: '18:00' }
        ]
      }
    ]
  },
  {
    id: 'm3',
    userId: 'user3',
    name: 'Vegan Wellness Plan',
    goal: 'maintenance',
    totalCaloriesPerDay: 1800,
    createdAt: '2024-01-17T08:00:00.000Z',
    days: [
      {
        day: 1,
        meals: [
          { type: 'breakfast', recipeId: '5', time: '08:00' },
          { type: 'lunch', recipeId: '3', time: '13:00' },
          { type: 'dinner', recipeId: '3', time: '19:00' }
        ]
      }
    ]
  }
];

module.exports = meals;
