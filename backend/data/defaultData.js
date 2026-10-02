export const defaultCategories = [
  { _id: 'cat_cashews', name: 'Cashews', slug: 'cashews', image: '/images/pouch_cashew.jpg', description: 'Colossal W-180 & Roasted Cashew Kernels', order: 1, status: 'active' },
  { _id: 'cat_almonds', name: 'Almonds', slug: 'almonds', image: '/images/pouch_almond.jpg', description: 'California Supreme & Kashmiri Mamra Giri', order: 2, status: 'active' },
  { _id: 'cat_dates', name: 'Dates', slug: 'dates', image: '/images/pouch_dates.jpg', description: 'Royal Ajwa of Madinah & King Medjool', order: 3, status: 'active' },
  { _id: 'cat_pistachios', name: 'Pistachios', slug: 'pistachios', image: '/images/pouch_pista.jpg', description: 'Persian Roasted & Raw Green Pastry Kernels', order: 4, status: 'active' },
  { _id: 'cat_mixnuts', name: 'Mix Nuts', slug: 'mix-nuts', image: '/images/pouch_mixnuts.jpg', description: '7-Nut Signature Blends & Artisanal Keepsake Boxes', order: 5, status: 'active' }
];

export const defaultPackDesigns = [
  {
    _id: 'pack_classic',
    name: 'Classic QAMRAH Pack',
    packType: 'Resealable Standup Pouch',
    packSize: 'Standard',
    packImage: '/images/pouch_cashew.jpg',
    frontImage: '/images/pouch_cashew.jpg',
    backImage: '/images/pouch_cashew_back.jpg',
    description: 'Multi-layer nitrogen-sealed preservation bag protecting natural crispness and virgin oils.',
    priceAdjustment: 0,
    status: 'active',
    order: 1
  },
  {
    _id: 'pack_gold',
    name: 'Premium Gold Pack',
    packType: 'Gold Foil Embossed Pouch',
    packSize: 'Luxury 250g/500g',
    packImage: '/images/pouch_almond.jpg',
    frontImage: '/images/pouch_almond.jpg',
    backImage: '/images/pouch_almond_back.jpg',
    description: 'Sleek matte gold finish with airtight zip-lock and metallic QAMRAH royal emblem.',
    priceAdjustment: 150,
    status: 'active',
    order: 2
  },
  {
    _id: 'pack_royal',
    name: 'Royal Gift Box',
    packType: 'Emerald Lacquer Keepsake Box',
    packSize: 'Grand Gift Edition',
    packImage: '/images/gift_hamper.jpg',
    frontImage: '/images/gift_hamper.jpg',
    backImage: '/images/gift_hamper.jpg',
    description: 'Handcrafted pine wood coated in emerald lacquer with reusable brass-finish preservation canister.',
    priceAdjustment: 350,
    status: 'active',
    order: 3
  },
  {
    _id: 'pack_corporate',
    name: 'Corporate Gift Pack',
    packType: 'Custom Hamper',
    packSize: 'Executive Edition',
    packImage: '/images/gift_hamper.jpg',
    frontImage: '/images/gift_hamper.jpg',
    backImage: '/images/gift_hamper.jpg',
    description: 'Bespoke corporate luxury hamper with customized brass tins and personalized greeting parchment.',
    priceAdjustment: 500,
    status: 'active',
    order: 4
  }
];

export const defaultProducts = [
  {
    _id: '6abcc4f6910e513826dd52e8',
    id: 'cashews',
    name: 'Cashews',
    slug: 'cashews',
    category: 'cashews',
    categoryName: 'Cashews',
    price: 599,
    mrp: 749,
    discount: 20,
    stock: 80,
    inStock: true,
    packSize: '250g',
    rating: 4.9,
    reviewCount: 184,
    badge: 'Bestseller',
    origin: 'Mangalore & Goa, India',
    featured: true,
    bestseller: true,
    mainImage: '/images/pouch_cashew.jpg',
    image: '/images/pouch_cashew.jpg',
    backImage: '/images/pouch_cashew_back.jpg',
    shortDescription: 'Colossal W-180 kernel size with unmatched buttery sweetness and natural crunch.',
    description: 'QAMRAH Cashews are hand-graded for pristine color, uniform curvature, and dense crunch. Sourced from the finest coastal orchards of India and vacuum-sealed to preserve natural oils and crunchiness.',
    availableWeights: [
      { label: '250g', price: 599, originalPrice: 749 },
      { label: '500g', price: 1149, originalPrice: 1399 },
      { label: '1kg', price: 2199, originalPrice: 2699 }
    ],
    highlights: [
      'Grade: W-180 Jumbo Kernels',
      '100% Raw, Unsalted & Naturally Sweet',
      'Zero Preservatives, Bleach or Chemical Treatment',
      'Packed with Magnesium, Copper & Plant Antioxidants'
    ],
    healthBenefits: [
      'Supports healthy cardiovascular function',
      'Boosts immune system through natural zinc & selenium',
      'Promotes bone health and muscular recovery'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '168 kcal',
      protein: '5.4g',
      totalFat: '13.2g',
      carbohydrates: '8.7g',
      dietaryFiber: '1.2g'
    },
    ingredients: '100% Pure Whole Raw Cashew Kernels (Anacardium occidentale)',
    status: 'active'
  },
  {
    _id: '6abcc4f6910e513826dd52ec',
    id: 'almonds',
    name: 'Almonds',
    slug: 'almonds',
    category: 'almonds',
    categoryName: 'Almonds',
    price: 499,
    mrp: 620,
    discount: 19,
    stock: 95,
    inStock: true,
    packSize: '250g',
    rating: 4.8,
    reviewCount: 210,
    badge: 'Bestseller',
    origin: 'Central Valley, California, USA',
    featured: true,
    bestseller: true,
    mainImage: '/images/pouch_almond.jpg',
    image: '/images/pouch_almond.jpg',
    backImage: '/images/pouch_almond_back.jpg',
    shortDescription: 'Plump, supreme-grade California almonds bursting with natural vitamin E and crisp nutty flavor.',
    description: 'Selected from the sun-drenched groves of California, our supreme almonds are celebrated for their uniform shape, smooth golden skin, and crisp bite. Rich in monounsaturated fats and antioxidants.',
    availableWeights: [
      { label: '250g', price: 499, originalPrice: 620 },
      { label: '500g', price: 949, originalPrice: 1199 },
      { label: '1kg', price: 1799, originalPrice: 2299 }
    ],
    highlights: [
      'Supreme Nonpareil Extra No. 1 Grade',
      'High in Alpha-Tocopherol Vitamin E',
      'Clean Nitrogen-Flushed Resealable Pouch',
      'Perfect for soaking, snacking, and milk blending'
    ],
    healthBenefits: [
      'Aids in maintaining optimal cholesterol balance',
      'Supports glowing skin and hair vitality',
      'Enhances cognitive memory and focus'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '172 kcal',
      protein: '6.3g',
      totalFat: '15.1g',
      carbohydrates: '6.1g',
      dietaryFiber: '3.6g'
    },
    ingredients: '100% Pure Raw California Almonds (Prunus dulcis)',
    status: 'active'
  },
  {
    _id: '6abcc4f6910e513826dd52f0',
    id: 'dates',
    name: 'Dates',
    slug: 'dates',
    category: 'dates',
    categoryName: 'Dates',
    price: 449,
    mrp: 580,
    discount: 22,
    stock: 120,
    inStock: true,
    packSize: '250g',
    rating: 5.0,
    reviewCount: 312,
    badge: 'Holy Origin',
    origin: 'Al-Madinah Al-Munawwarah, Saudi Arabia',
    featured: true,
    bestseller: true,
    mainImage: '/images/pouch_dates.jpg',
    image: '/images/pouch_dates.jpg',
    backImage: '/images/pouch_dates_back.jpg',
    shortDescription: 'Revered soft black dates directly from Madinah orchards. Tender, melt-in-mouth sweetness.',
    description: 'Our authentic Ajwa dates are ethically harvested from the fertile palm groves of Al-Madinah Al-Munawwarah. Renowned worldwide for their deep ebony color, delicate crinkled texture, and prune-like natural sweetness.',
    availableWeights: [
      { label: '250g', price: 449, originalPrice: 580 },
      { label: '500g', price: 849, originalPrice: 1099 },
      { label: '1kg', price: 1620, originalPrice: 2050 }
    ],
    highlights: [
      'Certified 100% Authentic Madinah Harvest',
      'Naturally Soft & Low Moisture Processed',
      'Zero Added Sugar, Syrups or Glazing Oils',
      'Rich in Iron, Potassium, and Essential Trace Minerals'
    ],
    healthBenefits: [
      'Traditionally praised for cardiac health & vitality',
      'Gentle on glycemic levels with low GI sugars',
      'Instant restorative energy for fasting and workouts'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '85 kcal',
      protein: '1.2g',
      totalFat: '0.2g',
      carbohydrates: '21.5g',
      dietaryFiber: '2.4g'
    },
    ingredients: '100% Natural Royal Ajwa Dates (Phoenix dactylifera)',
    status: 'active'
  },
  {
    _id: '6abcc4f6910e513826dd52f4',
    id: 'pistachios',
    name: 'Pistachios',
    slug: 'pistachios',
    category: 'pistachios',
    categoryName: 'Pistachios',
    price: 599,
    mrp: 720,
    discount: 17,
    stock: 70,
    inStock: true,
    packSize: '250g',
    rating: 4.9,
    reviewCount: 168,
    badge: 'Bestseller',
    origin: 'Kerman Province, Iran',
    featured: true,
    bestseller: true,
    mainImage: '/images/pouch_pista.jpg',
    image: '/images/pouch_pista.jpg',
    backImage: '/images/pouch_pista_back.jpg',
    shortDescription: 'Naturally opened jumbo Persian pistachios, masterfully dry roasted with Himalayan pink salt.',
    description: 'Sourced from the arid, high-altitude orchards of Kerman, our Persian pistachios are allowed to naturally burst open under the autumn sun. Slowly roasted without added oil, enhancing their rich buttery flavor and vibrant purple-green hue.',
    availableWeights: [
      { label: '250g', price: 599, originalPrice: 720 },
      { label: '500g', price: 1149, originalPrice: 1380 },
      { label: '1kg', price: 2199, originalPrice: 2600 }
    ],
    highlights: [
      'Jumbo Long Akbari / Fandoghi Variety',
      'Natural Tree-Ripened & Opened Shells',
      'Artisanal Slow Roast with Pink Himalayan Salt',
      'Rich in Lutein and Zeaxanthin Eye Antioxidants'
    ],
    healthBenefits: [
      'Supports ocular macular health and eyesight',
      'High protein-to-calorie ratio for guilt-free snacking',
      'Aids in post-exercise electrolyte replenishment'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '165 kcal',
      protein: '6.0g',
      totalFat: '13.0g',
      carbohydrates: '8.2g',
      dietaryFiber: '3.0g'
    },
    ingredients: 'Roasted Pistachios in Shell, Pure Himalayan Pink Salt',
    status: 'active'
  },
  {
    _id: '6abcc4f6910e513826dd52f8',
    id: 'mix-nuts',
    name: 'Mix Nuts',
    slug: 'mix-nuts',
    category: 'mix-nuts',
    categoryName: 'Mix Nuts',
    price: 549,
    mrp: 699,
    discount: 21,
    stock: 85,
    inStock: true,
    packSize: '250g',
    rating: 4.9,
    reviewCount: 245,
    badge: 'Signature Blend',
    origin: 'Global Artisanal Blend',
    featured: true,
    bestseller: true,
    mainImage: '/images/pouch_mixnuts.jpg',
    image: '/images/pouch_mixnuts.jpg',
    backImage: '/images/pouch_mixnuts_back.jpg',
    shortDescription: 'Master blend of Cashews, Almonds, Pistachios, Chilean Walnuts, Pecans, Macadamias and Brazil Nuts.',
    description: 'The pinnacle of gourmet nut collections. We combine seven of the world’s most prized tree nuts in balanced ratios. Each batch is micro-roasted separately before delicate infusion with pure sea salt crystals.',
    availableWeights: [
      { label: '250g', price: 549, originalPrice: 699 },
      { label: '500g', price: 1049, originalPrice: 1320 },
      { label: '1kg', price: 1999, originalPrice: 2490 }
    ],
    highlights: [
      '7 Grand Gourmet Tree Nuts, No Cheap Fillers or Peanuts',
      'Individually Calibrated Small-Batch Roasting',
      'Abundant Omega-3, Selenium, and Healthy Lipids',
      'The Ultimate Host Gift & Daily Executive Snack'
    ],
    healthBenefits: [
      'Broad-spectrum antioxidant protection',
      'Brain and neurological nourishment from whole walnuts',
      'Satisfying satiety that curb mid-day cravings'
    ],
    nutritionalFacts: {
      servingSize: '30g',
      calories: '185 kcal',
      protein: '5.2g',
      totalFat: '16.8g',
      carbohydrates: '6.5g',
      dietaryFiber: '2.8g'
    },
    ingredients: 'Cashews, Almonds, Pistachios, Chilean Walnuts, Pecans, Macadamia Nuts, Brazil Nuts, Rock Salt',
    status: 'active'
  }
];
