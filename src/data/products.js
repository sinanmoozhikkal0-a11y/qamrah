export const CATEGORIES = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'cashews', name: 'Cashews', slug: 'cashews', image: '/images/pouch_cashew.jpg', count: 1 },
  { id: 'almonds', name: 'Almonds', slug: 'almonds', image: '/images/pouch_almond.jpg', count: 1 },
  { id: 'dates', name: 'Dates', slug: 'dates', image: '/images/pouch_dates.jpg', count: 1 },
  { id: 'pistachios', name: 'Pistachios', slug: 'pistachios', image: '/images/pouch_pista.jpg', count: 1 },
  { id: 'mix-nuts', name: 'Mix Nuts', slug: 'mix-nuts', image: '/images/pouch_mixnuts.jpg', count: 1 }
];

export const PRODUCTS = [
  {
    id: 'cashews',
    name: 'Cashews',
    slug: 'cashews',
    category: 'cashews',
    categoryName: 'Cashews',
    price: 599,
    originalPrice: 749,
    image: '/images/pouch_cashew.jpg',
    backImage: '/images/pouch_cashew_back.jpg',
    rating: 4.9,
    reviewCount: 184,
    weight: '250g',
    availableWeights: [
      { label: '250g', price: 599, originalPrice: 749 },
      { label: '500g', price: 1149, originalPrice: 1399 },
      { label: '1kg', price: 2199, originalPrice: 2699 }
    ],
    origin: 'Mangalore & Goa, India',
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    tag: 'Bestseller',
    shortDescription: 'Colossal W-180 kernel size with unmatched buttery sweetness and natural crunch.',
    description: 'QAMRAH Cashews are hand-graded for pristine color, uniform curvature, and dense crunch. Sourced from the finest coastal orchards of India and vacuum-sealed to preserve natural oils and crunchiness.',
    highlights: [
      'Grade: W-180 Jumbo Kernels',
      '100% Raw, Unsalted & Naturally Sweet',
      'Zero Preservatives, Bleach or Chemical Treatment',
      'Packed with Magnesium, Copper & Plant Antioxidants'
    ],
    healthBenefits: [
      'Supports healthy cardiovascular function',
      'Boosts immune system through natural zinc & selenium',
      'Promotes bone health and muscular recovery',
      'Provides sustained, low-glycemic energy'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '168 kcal',
      protein: '5.4g',
      totalFat: '13.2g',
      carbohydrates: '8.7g',
      dietaryFiber: '1.2g',
      magnesium: '83mg (20% DV)'
    },
    ingredients: '100% Pure Whole Raw Cashew Kernels (Anacardium occidentale)'
  },
  {
    id: 'almonds',
    name: 'Almonds',
    slug: 'almonds',
    category: 'almonds',
    categoryName: 'Almonds',
    price: 499,
    originalPrice: 620,
    image: '/images/pouch_almond.jpg',
    backImage: '/images/pouch_almond_back.jpg',
    rating: 4.8,
    reviewCount: 210,
    weight: '250g',
    availableWeights: [
      { label: '250g', price: 499, originalPrice: 620 },
      { label: '500g', price: 949, originalPrice: 1199 },
      { label: '1kg', price: 1799, originalPrice: 2299 }
    ],
    origin: 'Central Valley, California, USA',
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    tag: 'Bestseller',
    shortDescription: 'Plump, supreme-grade California almonds bursting with natural vitamin E and crisp nutty flavor.',
    description: 'Selected from the sun-drenched groves of California, our supreme almonds are celebrated for their uniform shape, smooth golden skin, and crisp bite. Rich in monounsaturated fats and antioxidants.',
    highlights: [
      'Supreme Nonpareil Extra No. 1 Grade',
      'High in Alpha-Tocopherol Vitamin E',
      'Clean Nitrogen-Flushed Resealable Pouch',
      'Perfect for soaking, snacking, and milk blending'
    ],
    healthBenefits: [
      'Aids in maintaining optimal cholesterol balance',
      'Supports glowing skin and hair vitality',
      'Enhances cognitive memory and focus',
      'Excellent plant protein source for muscle growth'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '172 kcal',
      protein: '6.3g',
      totalFat: '15.1g',
      carbohydrates: '6.1g',
      dietaryFiber: '3.6g',
      vitaminE: '7.3mg (49% DV)'
    },
    ingredients: '100% Pure Raw California Almonds (Prunus dulcis)'
  },
  {
    id: 'dates',
    name: 'Dates',
    slug: 'dates',
    category: 'dates',
    categoryName: 'Dates',
    price: 449,
    originalPrice: 580,
    image: '/images/pouch_dates.jpg',
    backImage: '/images/pouch_dates_back.jpg',
    rating: 5.0,
    reviewCount: 312,
    weight: '250g',
    availableWeights: [
      { label: '250g', price: 449, originalPrice: 580 },
      { label: '500g', price: 849, originalPrice: 1099 },
      { label: '1kg', price: 1620, originalPrice: 2050 }
    ],
    origin: 'Al-Madinah Al-Munawwarah, Saudi Arabia',
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    tag: 'Holy Origin',
    shortDescription: 'Revered soft black dates directly from Madinah orchards. Tender, melt-in-mouth sweetness.',
    description: 'Our authentic Ajwa dates are ethically harvested from the fertile palm groves of Al-Madinah Al-Munawwarah. Renowned worldwide for their deep ebony color, delicate crinkled texture, and prune-like natural sweetness.',
    highlights: [
      'Certified 100% Authentic Madinah Harvest',
      'Naturally Soft & Low Moisture Processed',
      'Zero Added Sugar, Syrups or Glazing Oils',
      'Rich in Iron, Potassium, and Essential Trace Minerals'
    ],
    healthBenefits: [
      'Traditionally praised for cardiac health & vitality',
      'Gentle on glycemic levels with low GI sugars',
      'Aids healthy digestion and maternal wellness',
      'Instant restorative energy for fasting and workouts'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '85 kcal',
      protein: '1.2g',
      totalFat: '0.2g',
      carbohydrates: '21.5g',
      dietaryFiber: '2.4g',
      potassium: '190mg (4% DV)'
    },
    ingredients: '100% Natural Royal Ajwa Dates (Phoenix dactylifera)'
  },
  {
    id: 'pistachios',
    name: 'Pistachios',
    slug: 'pistachios',
    category: 'pistachios',
    categoryName: 'Pistachios',
    price: 599,
    originalPrice: 720,
    image: '/images/pouch_pista.jpg',
    backImage: '/images/pouch_pista_back.jpg',
    rating: 4.9,
    reviewCount: 168,
    weight: '250g',
    availableWeights: [
      { label: '250g', price: 599, originalPrice: 720 },
      { label: '500g', price: 1149, originalPrice: 1380 },
      { label: '1kg', price: 2199, originalPrice: 2600 }
    ],
    origin: 'Kerman Province, Iran',
    isFeatured: true,
    isBestseller: true,
    inStock: false,
    stock: 0,
    tag: 'Bestseller',
    shortDescription: 'Naturally open-mouthed Iranian pistachios lightly toasted with Himalayan pink salt.',
    description: 'Grown in the high-altitude arid soils of Kerman, these pistachios feature naturally opened ivory shells containing intensely flavored emerald green kernels. Slowly dry-roasted to a golden crisp with a whisper of fine mineral pink salt.',
    highlights: [
      'Jumbo Long Akbari / Fandoghi Variety',
      'Natural Tree-Ripened & Opened Shells',
      'Artisanal Slow Roast with Pink Himalayan Salt',
      'Rich in Lutein and Zeaxanthin Eye Antioxidants'
    ],
    healthBenefits: [
      'Supports ocular macular health and eyesight',
      'High protein-to-calorie ratio for guilt-free snacking',
      'Promotes beneficial gut microbiome flora',
      'Aids in post-exercise electrolyte replenishment'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '165 kcal',
      protein: '6.0g',
      totalFat: '13.0g',
      carbohydrates: '8.2g',
      dietaryFiber: '3.0g',
      potassium: '280mg (6% DV)'
    },
    ingredients: 'Roasted Pistachios in Shell, Pure Himalayan Pink Salt'
  },
  {
    id: 'mix-nuts',
    name: 'Mix Nuts',
    slug: 'mix-nuts',
    category: 'mix-nuts',
    categoryName: 'Mix Nuts',
    price: 549,
    originalPrice: 699,
    image: '/images/pouch_mixnuts.jpg',
    backImage: '/images/pouch_mixnuts_back.jpg',
    rating: 4.9,
    reviewCount: 245,
    weight: '250g',
    availableWeights: [
      { label: '250g', price: 549, originalPrice: 699 },
      { label: '500g', price: 1049, originalPrice: 1320 },
      { label: '1kg', price: 1999, originalPrice: 2490 }
    ],
    origin: 'Global Artisanal Blend',
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    tag: 'Signature Blend',
    shortDescription: 'Master blend of Cashews, Almonds, Pistachios, Chilean Walnuts, Pecans, Macadamias and Brazil Nuts.',
    description: 'The pinnacle of gourmet nut collections. We combine seven of the world’s most prized tree nuts in balanced ratios. Each batch is micro-roasted separately before delicate infusion with pure sea salt crystals.',
    highlights: [
      '7 Grand Gourmet Tree Nuts, No Cheap Fillers or Peanuts',
      'Individually Calibrated Small-Batch Roasting',
      'Abundant Omega-3, Selenium, and Healthy Lipids',
      'The Ultimate Host Gift & Daily Executive Snack'
    ],
    healthBenefits: [
      'Broad-spectrum antioxidant protection',
      'Brain and neurological nourishment from whole walnuts',
      'Thyroid support via organic Brazil nut selenium',
      'Satisfying satiety that curb mid-day cravings'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '185 kcal',
      protein: '5.2g',
      totalFat: '16.8g',
      carbohydrates: '6.5g',
      dietaryFiber: '2.8g',
      omega3: '1.2g'
    },
    ingredients: 'Cashews, Almonds, Pistachios, Chilean Walnuts, Pecans, Macadamia Nuts, Brazil Nuts, Rock Salt'
  }
];
