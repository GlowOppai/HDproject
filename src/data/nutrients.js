const nutrients = [
  {
    id: 'n1',
    name: 'Vitamin D',
    category: 'vitamin',
    unit: 'mcg',
    dailyRecommended: { male: 15, female: 15 },
    description: 'Essential for calcium absorption and bone health. Also supports immune function and mood regulation.',
    foodSources: ['Salmon', 'Eggs', 'Fortified milk', 'Mushrooms', 'Tuna'],
    deficiencySymptoms: ['Fatigue', 'Bone pain', 'Muscle weakness', 'Depression'],
    benefits: ['Strong bones', 'Immune support', 'Mood improvement', 'Reduced inflammation']
  },
  {
    id: 'n2',
    name: 'Iron',
    category: 'mineral',
    unit: 'mg',
    dailyRecommended: { male: 8, female: 18 },
    description: 'Critical for oxygen transport in the blood and energy production in cells.',
    foodSources: ['Red meat', 'Spinach', 'Lentils', 'Tofu', 'Chickpeas', 'Fortified cereals'],
    deficiencySymptoms: ['Fatigue', 'Pale skin', 'Shortness of breath', 'Dizziness'],
    benefits: ['Energy production', 'Oxygen transport', 'Cognitive function', 'Immune support']
  },
  {
    id: 'n3',
    name: 'Omega-3 Fatty Acids',
    category: 'fat',
    unit: 'g',
    dailyRecommended: { male: 1.6, female: 1.1 },
    description: 'Essential polyunsaturated fats critical for brain health, heart health, and reducing inflammation.',
    foodSources: ['Salmon', 'Mackerel', 'Walnuts', 'Flaxseeds', 'Chia seeds', 'Sardines'],
    deficiencySymptoms: ['Dry skin', 'Poor memory', 'Joint pain', 'Mood swings'],
    benefits: ['Heart health', 'Brain function', 'Anti-inflammatory', 'Eye health']
  },
  {
    id: 'n4',
    name: 'Calcium',
    category: 'mineral',
    unit: 'mg',
    dailyRecommended: { male: 1000, female: 1000 },
    description: 'The most abundant mineral in the body, essential for bone structure and muscle function.',
    foodSources: ['Milk', 'Cheese', 'Yoghurt', 'Broccoli', 'Almonds', 'Fortified plant milk'],
    deficiencySymptoms: ['Weak bones', 'Muscle cramps', 'Tooth decay', 'Numbness'],
    benefits: ['Bone strength', 'Muscle contraction', 'Blood clotting', 'Nerve transmission']
  },
  {
    id: 'n5',
    name: 'Vitamin C',
    category: 'vitamin',
    unit: 'mg',
    dailyRecommended: { male: 90, female: 75 },
    description: 'A powerful antioxidant that supports immune health and collagen production.',
    foodSources: ['Oranges', 'Kiwi', 'Strawberries', 'Bell peppers', 'Broccoli', 'Tomatoes'],
    deficiencySymptoms: ['Fatigue', 'Bruising easily', 'Joint pain', 'Poor wound healing'],
    benefits: ['Immune boost', 'Skin health', 'Iron absorption', 'Antioxidant protection']
  },
  {
    id: 'n6',
    name: 'Protein',
    category: 'macronutrient',
    unit: 'g',
    dailyRecommended: { male: 56, female: 46 },
    description: 'The building block of muscles, enzymes, hormones, and nearly every tissue in the body.',
    foodSources: ['Chicken', 'Fish', 'Eggs', 'Greek yoghurt', 'Legumes', 'Quinoa'],
    deficiencySymptoms: ['Muscle loss', 'Fatigue', 'Slow healing', 'Hair loss'],
    benefits: ['Muscle growth', 'Tissue repair', 'Enzyme production', 'Satiety']
  },
  {
    id: 'n7',
    name: 'Fibre',
    category: 'carbohydrate',
    unit: 'g',
    dailyRecommended: { male: 38, female: 25 },
    description: 'Indigestible plant material that feeds gut bacteria and regulates digestion.',
    foodSources: ['Oats', 'Lentils', 'Apples', 'Broccoli', 'Chia seeds', 'Whole grains'],
    deficiencySymptoms: ['Constipation', 'Blood sugar spikes', 'High cholesterol', 'Gut imbalance'],
    benefits: ['Digestive health', 'Blood sugar control', 'Cholesterol reduction', 'Weight management']
  }
];

const goalSuggestions = {
  'weight-loss': ['n7', 'n3', 'n6'],
  'muscle-gain': ['n6', 'n1', 'n2'],
  'energy': ['n2', 'n5', 'n1'],
  'general-health': ['n4', 'n5', 'n3', 'n7'],
  'maintenance': ['n1', 'n4', 'n6', 'n7']
};

module.exports = { nutrients, goalSuggestions };
