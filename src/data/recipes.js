const recipes = [
  {
    id: '1',
    name: 'Grilled Chicken & Quinoa Bowl',
    category: 'high-protein',
    cuisineType: 'Mediterranean',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 480,
    dietaryTags: ['gluten-free', 'high-protein', 'dairy-free'],
    ingredients: [
      { item: 'chicken breast', quantity: '200g' },
      { item: 'quinoa', quantity: '100g' },
      { item: 'cherry tomatoes', quantity: '150g' },
      { item: 'cucumber', quantity: '1 medium' },
      { item: 'olive oil', quantity: '2 tbsp' },
      { item: 'lemon juice', quantity: '1 tbsp' }
    ],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Season chicken breast with salt, pepper, and olive oil.',
      'Grill chicken for 6-7 minutes per side until internal temp reaches 74°C.',
      'Dice cucumber and halve cherry tomatoes.',
      'Assemble bowl with quinoa base, sliced chicken, and vegetables.',
      'Drizzle with lemon juice and serve.'
    ],
    nutrients: { protein: 42, carbs: 38, fat: 14, fibre: 5 }
  },
  {
    id: '2',
    name: 'Avocado Toast with Poached Eggs',
    category: 'balanced',
    cuisineType: 'Modern Australian',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 380,
    dietaryTags: ['vegetarian', 'high-protein'],
    ingredients: [
      { item: 'sourdough bread', quantity: '2 slices' },
      { item: 'avocado', quantity: '1 large' },
      { item: 'eggs', quantity: '2' },
      { item: 'cherry tomatoes', quantity: '80g' },
      { item: 'feta cheese', quantity: '30g' },
      { item: 'chilli flakes', quantity: '1 tsp' }
    ],
    instructions: [
      'Toast sourdough until golden.',
      'Mash avocado with salt and pepper.',
      'Bring water to a gentle simmer and poach eggs for 3 minutes.',
      'Spread avocado on toast, top with poached eggs.',
      'Garnish with feta, tomatoes, and chilli flakes.'
    ],
    nutrients: { protein: 22, carbs: 32, fat: 24, fibre: 8 }
  },
  {
    id: '3',
    name: 'Lentil & Vegetable Curry',
    category: 'low-calorie',
    cuisineType: 'Indian',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    calories: 290,
    dietaryTags: ['vegan', 'gluten-free', 'high-fibre'],
    ingredients: [
      { item: 'red lentils', quantity: '250g' },
      { item: 'coconut milk', quantity: '400ml' },
      { item: 'spinach', quantity: '200g' },
      { item: 'onion', quantity: '1 large' },
      { item: 'garlic', quantity: '3 cloves' },
      { item: 'curry powder', quantity: '2 tbsp' },
      { item: 'diced tomatoes', quantity: '400g' }
    ],
    instructions: [
      'Sauté onion and garlic until softened.',
      'Add curry powder and cook for 1 minute.',
      'Stir in lentils, tomatoes, and coconut milk.',
      'Simmer for 20 minutes until lentils are tender.',
      'Fold in spinach and cook for 2 more minutes.',
      'Serve with basmati rice.'
    ],
    nutrients: { protein: 16, carbs: 38, fat: 8, fibre: 14 }
  },
  {
    id: '4',
    name: 'Salmon & Sweet Potato',
    category: 'high-protein',
    cuisineType: 'Fusion',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 520,
    dietaryTags: ['gluten-free', 'high-protein', 'omega-3'],
    ingredients: [
      { item: 'salmon fillet', quantity: '300g' },
      { item: 'sweet potato', quantity: '2 medium' },
      { item: 'broccoli', quantity: '200g' },
      { item: 'olive oil', quantity: '2 tbsp' },
      { item: 'garlic powder', quantity: '1 tsp' },
      { item: 'paprika', quantity: '1 tsp' }
    ],
    instructions: [
      'Preheat oven to 200°C.',
      'Cube sweet potato, toss with oil and paprika, roast for 15 min.',
      'Season salmon with garlic powder, salt and pepper.',
      'Pan-sear salmon for 4 minutes each side.',
      'Steam broccoli until tender-crisp.',
      'Plate and serve immediately.'
    ],
    nutrients: { protein: 38, carbs: 42, fat: 18, fibre: 7 }
  },
  {
    id: '5',
    name: 'Greek Yoghurt Parfait',
    category: 'low-calorie',
    cuisineType: 'Greek',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 210,
    dietaryTags: ['vegetarian', 'high-protein', 'low-fat'],
    ingredients: [
      { item: 'Greek yoghurt', quantity: '200g' },
      { item: 'mixed berries', quantity: '100g' },
      { item: 'granola', quantity: '30g' },
      { item: 'honey', quantity: '1 tsp' },
      { item: 'chia seeds', quantity: '1 tbsp' }
    ],
    instructions: [
      'Layer yoghurt at the bottom of a glass.',
      'Add mixed berries.',
      'Top with granola and chia seeds.',
      'Drizzle with honey and serve.'
    ],
    nutrients: { protein: 18, carbs: 28, fat: 4, fibre: 5 }
  }
];

module.exports = recipes;
