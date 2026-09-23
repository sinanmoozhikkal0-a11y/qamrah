import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import PackDesign from '../models/PackDesign.js';
import HomePage from '../models/HomePage.js';
import StoryPage from '../models/StoryPage.js';
import WholesalePage from '../models/WholesalePage.js';
import ContactPage from '../models/ContactPage.js';
import FAQ from '../models/FAQ.js';
import Settings from '../models/Settings.js';

export const seedDatabase = async () => {
  console.log('[Seed] Checking initial QAMRAH database state...');

  // 1. Seed Admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AJMAL SAHIR', salt);
    await Admin.create({
      username: 'QAMRAH',
      password: hashedPassword,
      role: 'superadmin'
    });
    console.log('[Seed] Admin created: Username "QAMRAH"');
  }

  // 2. Seed Categories
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const categories = [
      { name: 'Cashews', slug: 'cashews', image: '/images/pouch_cashew.jpg', description: 'Colossal W-180 & Roasted Cashew Kernels', order: 1 },
      { name: 'Almonds', slug: 'almonds', image: '/images/pouch_almond.jpg', description: 'California Supreme & Kashmiri Mamra Giri', order: 2 },
      { name: 'Dates', slug: 'dates', image: '/images/pouch_dates.jpg', description: 'Royal Ajwa of Madinah & King Medjool', order: 3 },
      { name: 'Pistachios', slug: 'pistachios', image: '/images/pouch_pista.jpg', description: 'Persian Roasted & Raw Green Pastry Kernels', order: 4 },
      { name: 'Mix Nuts', slug: 'mix-nuts', image: '/images/pouch_mixnuts.jpg', description: '7-Nut Signature Blends & Artisanal Keepsake Boxes', order: 5 }
    ];
    await Category.insertMany(categories);
    console.log('[Seed] 5 Categories seeded.');
  }

  // 3. Seed Pack Designs
  const packDesignCount = await PackDesign.countDocuments();
  if (packDesignCount === 0) {
    const packDesigns = [
      {
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
        name: 'Corporate Gift Pack',
        packType: 'Custom Hamper',
        packSize: 'Executive Edition',
        packImage: '/images/gift_hamper_1788328179938.jpg',
        frontImage: '/images/gift_hamper.jpg',
        backImage: '/images/gift_hamper.jpg',
        description: 'Bespoke corporate luxury hamper with customized brass tins and personalized greeting parchment.',
        priceAdjustment: 500,
        status: 'active',
        order: 4
      }
    ];
    await PackDesign.insertMany(packDesigns);
    console.log('[Seed] 4 Pack Designs seeded.');
  }

  // 4. Seed Products (Exactly the 5 products: Cashews, Almonds, Dates, Pistachios, Mix Nuts)
  const products = [
    {
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
      ingredients: '100% Pure Whole Raw Cashew Kernels (Anacardium occidentale)'
    },
    {
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
      ingredients: '100% Pure Raw California Almonds (Prunus dulcis)'
    },
    {
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
      ingredients: '100% Natural Royal Ajwa Dates (Phoenix dactylifera)'
    },
    {
      name: 'Pistachios',
      slug: 'pistachios',
      category: 'pistachios',
      categoryName: 'Pistachios',
      price: 599,
      mrp: 720,
      discount: 16,
      stock: 0,
      inStock: false,
      packSize: '250g',
      rating: 4.9,
      reviewCount: 168,
      badge: 'Bestseller',
      origin: 'Kerman Province, Iran',
      featured: true,
      bestseller: true,
      mainImage: '/images/pouch_pista.jpg',
      backImage: '/images/pouch_pista_back.jpg',
      shortDescription: 'Naturally open-mouthed Iranian pistachios lightly toasted with Himalayan pink salt.',
      description: 'Grown in the high-altitude arid soils of Kerman, these pistachios feature naturally opened ivory shells containing intensely flavored emerald green kernels. Slowly dry-roasted to a golden crisp with a whisper of fine mineral pink salt.',
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
      ingredients: 'Roasted Pistachios in Shell, Pure Himalayan Pink Salt'
    },
    {
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
      ingredients: 'Cashews, Almonds, Pistachios, Chilean Walnuts, Pecans, Macadamia Nuts, Brazil Nuts, Rock Salt'
    }
  ];

  // Completely reset products collection to ONLY these 5 products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('[Seed] Exactly 5 Products (Cashews, Almonds, Dates, Pistachios, Mix Nuts) initialized in database.');

  // 5. Seed HomePage CMS
  await HomePage.deleteMany({});
  await HomePage.create({
    announcement: {
      enabled: true,
      items: [
        { text: 'PREMIUM QUALITY', icon: 'Award' },
        { text: 'NO PRESERVATIVES', icon: 'ShieldCheck' },
        { text: 'FRESHLY PACKED', icon: 'PackageCheck' },
        { text: 'NATURALLY HEALTHY', icon: 'HeartPulse' }
      ],
      trackOrderText: 'Track Order'
    },
    heroSlides: [
      {
        eyebrow: 'PREMIUM NUTS • NATURALLY GOOD',
        line1: 'Premium Goodness,',
        line2: 'Carefully Selected.',
        description: 'Handpicked premium nuts and dry fruits, selected for exceptional taste, freshness and quality.',
        image: '/images/hero_cashew_render.jpg',
        button1Text: 'DISCOVER COLLECTION',
        button1Link: '/shop/cashews',
        button2Text: 'VIEW PRODUCT',
        button2Link: '/product/cashews',
        enabled: true,
        order: 1
      },
      {
        eyebrow: 'SACRED HARVEST • MADINAH GROVES',
        line1: 'Royal Ajwa Dates,',
        line2: 'Holy City Delights.',
        description: 'Authentic Madinah Ajwa dates naturally dried on the palm. Soft, caramel-rich, and packed with essential minerals.',
        image: '/images/hero_dates_render.jpg',
        button1Text: 'DISCOVER COLLECTION',
        button1Link: '/shop/dates',
        button2Text: 'VIEW PRODUCT',
        button2Link: '/product/dates',
        enabled: true,
        order: 2
      },
      {
        eyebrow: 'SUPREME GRADE • CALIFORNIA GROVES',
        line1: 'California Almonds,',
        line2: 'Pure Nutritive Crunch.',
        description: 'Sun-drenched Nonpareil supreme almonds rich in Vitamin E, botanical antioxidants, and sustained daily energy.',
        image: '/images/hero_almond_render.jpg',
        button1Text: 'DISCOVER COLLECTION',
        button1Link: '/shop/almonds',
        button2Text: 'VIEW PRODUCT',
        button2Link: '/product/almonds',
        enabled: true,
        order: 3
      },
      {
        eyebrow: 'PERSIAN ROAST • HIMALAYAN SALT',
        line1: 'Imperial Pistachios,',
        line2: 'Roasted To Perfection.',
        description: 'Naturally opened jumbo Iranian pistachios, dry-roasted with pink salt to accentuate vibrant emerald kernels.',
        image: '/images/hero_pista_render.jpg',
        button1Text: 'DISCOVER COLLECTION',
        button1Link: '/shop/pistachios',
        button2Text: 'VIEW PRODUCT',
        button2Link: '/product/pistachios',
        enabled: true,
        order: 4
      }
    ],
    featureBenefits: [
      { icon: 'Award', title: 'PREMIUM QUALITY', subtitle: 'Handpicked premium selection', enabled: true },
      { icon: 'Leaf', title: 'NO PRESERVATIVES', subtitle: 'Pure natural goodness', enabled: true },
      { icon: 'Package', title: 'FRESHLY PACKED', subtitle: 'Packed for maximum freshness', enabled: true },
      { icon: 'HeartHandshake', title: 'NATURALLY HEALTHY', subtitle: 'Wholesome everyday nutrition', enabled: true }
    ],
    bestsellerSection: {
      enabled: true,
      eyebrow: 'OUR BESTSELLERS',
      title: 'Our Premium Collection',
      subtitle: 'Experience the finest selection of nuts and dates, packed with nutrition, quality and natural goodness.',
      productSlugs: ['cashews', 'almonds', 'dates', 'pistachios', 'mix-nuts']
    },
      shopByCategorySection: {
        enabled: true,
        eyebrow: 'CURATED VARIETIES',
        title: 'Shop By Category',
        subtitle: 'Explore our master grades sorted by botanical origin and flavor profiles.',
        categories: [
          { id: 'cashews', name: 'CASHEWS', subtitle: 'Colossal W-180 & Roasted', image: '/images/pouch_cashew.jpg', link: '/shop/cashews' },
          { id: 'almonds', name: 'ALMONDS', subtitle: 'California Supreme & Mamra', image: '/images/pouch_almond.jpg', link: '/shop/almonds' },
          { id: 'dates', name: 'DATES', subtitle: 'Royal Ajwa & King Medjool', image: '/images/pouch_dates.jpg', link: '/shop/dates' },
          { id: 'pistachios', name: 'PISTACHIOS', subtitle: 'Persian Roasted & Green Kernels', image: '/images/pouch_pista.jpg', link: '/shop/pistachios' }
        ]
      },
      storyPreviewSection: {
        enabled: true,
        eyebrow: 'OUR STORY',
        heading: 'Nature, Carefully Selected.',
        paragraph1: "At QAMRAH, we believe true luxury begins in the soil. Born from an uncompromising passion for purity and botanical excellence, our mission is to deliver the world's most exceptional tree nuts and sacred dates directly from ethical orchards to your dining table.",
        paragraph2: 'Every single cashew, almond, date and pistachio in our collection is hand-graded for caliber, vacuum-sealed at peak freshness, and free from any chemical bleaches, artificial waxes, or preservatives.',
        image: '/images/story_heritage.jpg',
        badgeYear: 'SINCE 2024',
        badgeText: 'Artisanal Grading Standard',
        buttonText: 'DISCOVER OUR STORY',
        buttonLink: '/our-story'
      },
      luxuryCtaSection: {
        enabled: true,
        eyebrow: 'UNCOMPROMISING LUXURY',
        heading: 'GOODNESS YOU CAN TASTE',
        subheading: 'Premium nuts. Natural goodness. Delivered fresh in signature preservation packaging.',
        buttonText: 'SHOP COLLECTION',
        buttonLink: '/shop'
      },
      newsletterSection: {
        enabled: true,
        eyebrow: 'THE CONNOISSEUR CLUB',
        title: 'Receive Royal Privileges',
        description: 'Subscribe to access private seasonal harvest allocations, exclusive gifting curations, and 10% off your inaugural order.'
      }
    });
    console.log('[Seed] HomePage CMS content seeded.');

  // 6. Seed StoryPage CMS
  const storyCount = await StoryPage.countDocuments();
  if (storyCount === 0) {
    await StoryPage.create({
      header: {
        eyebrow: 'HERITAGE & PURITY',
        heading: 'THE STORY BEHIND QAMRAH',
        quote: '"Born from a reverence for the sacred earth, timeless botanical traditions, and the pursuit of unadulterated nourishment."'
      },
      philosophy: {
        eyebrow: 'OUR PHILOSOPHY',
        heading: 'Nature, Unaltered & Elevated.',
        paragraph1: 'In an era where industrial mass production frequently masks inferior dry fruits with chemical bleaches, excessive salts, and synthetic glazes, QAMRAH was founded on a singular tenet: The true taste of nature requires no embellishment.',
        paragraph2: 'From sacred Madinah palm groves cultivating revered Ajwa dates to coastal Indian orchards bearing massive W-180 cashews, our procurement team journeys to geographical origins with deep botanical pedigree. We ensure ethical harvesting, direct farmer compensation, and zero compromises in sorting.',
        image: '/images/story_heritage.jpg',
        stat1Number: '100%',
        stat1Label: 'Pure & Chemical Free',
        stat2Number: 'Top 5%',
        stat2Label: 'Hand-Selected Caliber'
      },
      pillars: [
        {
          title: 'Ethical Global Origins',
          description: 'We partner directly with family orchards in Madinah, California, Kerman, and coastal India where soil care and traditional cultivation span generations.',
          icon: 'Globe'
        },
        {
          title: 'Artisanal Grading Caliber',
          description: 'Every harvest batch undergoes rigorous visual and density grading. Only the top 5% of kernels (like colossal W-180 and jumbo nonpareil) earn the QAMRAH insignia.',
          icon: 'Award'
        },
        {
          title: 'Zero Chemical Processing',
          description: 'We strictly reject chemical bleaching agents, sulphur fumigation, artificial glosses, or synthetic preservatives. What you taste is raw nature.',
          icon: 'ShieldCheck'
        },
        {
          title: 'Oxygen-Barrier Freshness',
          description: 'Delicate tree nut oils degrade quickly with oxygen. Our multi-layer nitrogen-sealed preservation bags protect natural crispness and aroma until you open them.',
          icon: 'Sparkles'
        }
      ]
    });
    console.log('[Seed] StoryPage CMS content seeded.');
  }

  // 7. Seed WholesalePage CMS
  const wholesaleCount = await WholesalePage.countDocuments();
  if (wholesaleCount === 0) {
    await WholesalePage.create({
      header: {
        eyebrow: 'INSTITUTIONAL & B2B PARTNERSHIPS',
        heading: 'QAMRAH WHOLESALE & GIFTING',
        description: 'Direct-from-source wholesale allocations, custom corporate luxury hampers, and premium bulk supplies with guaranteed caliber consistency.'
      },
      corporateBanner: {
        eyebrow: 'SIGNATURE CORPORATE COLLECTION',
        title: 'Bespoke Executive Gift Boxes',
        description: "Elevate your corporate relationships with hand-finished emerald lacquer boxes, brass preserve tins, and your company's gold foil embossed logo.",
        image: '/images/gift_hamper.jpg',
        features: [
          'Custom logo embossing & personalized parchment cards',
          'Multi-city direct doorstep courier distribution',
          'Attractive tier discounts for orders above 25 boxes'
        ]
      },
      b2bSegments: [
        {
          icon: 'Hotel',
          title: 'Luxury Hotels & Resorts',
          description: 'Turn-down amenities, executive lounge snack bars, and presidential welcome dry fruit baskets.'
        },
        {
          icon: 'Gift',
          title: 'Corporate Gifting',
          description: 'Bespoke engraved wooden gift hampers, custom brass canisters, and personalized festive gift packaging.'
        },
        {
          icon: 'UtensilsCrossed',
          title: 'Fine Dining & Patisseries',
          description: 'Pastry-grade raw green pistachio kernels, blanched almonds, and colossal cashews for master chefs.'
        },
        {
          icon: 'Building2',
          title: 'Specialty Retail & Export',
          description: 'Private-label or QAMRAH branded stand-up nitrogen pouches with full export certifications and barcoding.'
        }
      ]
    });
    console.log('[Seed] WholesalePage CMS content seeded.');
  }

  // 8. Seed ContactPage CMS
  const contactCount = await ContactPage.countDocuments();
  if (contactCount === 0) {
    await ContactPage.create({
      header: {
        eyebrow: 'CUSTOMER CONCIERGE',
        heading: 'GET IN TOUCH',
        description: 'Have a question about our harvest grades, custom hampers, or existing orders? Our dedicated team is delighted to assist you.'
      },
      email: 'concierge@qamrahnuts.com',
      phone: '+91 (022) 8940-2200 / +91 98200 44888',
      whatsapp: '+91 62358 20223',
      address: 'QAMRAH Fine Foods Ltd, 4th Floor, Crescent Tower, BKC Commercial Complex, Mumbai 400051, India',
      workingHours: 'Monday – Saturday: 9:00 AM – 8:00 PM IST'
    });
    console.log('[Seed] ContactPage CMS content seeded.');
  }

  // 9. Seed FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    const faqs = [
      {
        question: 'How does QAMRAH ensure nuts stay fresh and crispy?',
        answer: 'All our nuts and dates are nitrogen-flushed and vacuum-sealed immediately after roasting and hand-grading in multi-layer, moisture-resistant oxygen-barrier standup pouches.',
        category: 'Quality & Packaging',
        order: 1
      },
      {
        question: 'What is the standard delivery timeline across India?',
        answer: 'Metro cities receive delivery within 24 to 48 hours via express air cargo. Tier 2 & Tier 3 cities receive delivery within 2 to 4 business days.',
        category: 'Shipping',
        order: 2
      },
      {
        question: 'Do you offer custom corporate gift hampers for Diwali and Eid?',
        answer: 'Yes, we curate custom wooden lacquer boxes with personalized company branding, engraved greeting cards, and bespoke dry fruit selections. Please check our Wholesale page for bulk enquiries.',
        category: 'Gifting',
        order: 3
      },
      {
        question: 'What is your return & freshness guarantee policy?',
        answer: 'We offer a 100% satisfaction guarantee. If your package arrives damaged or you are unsatisfied with freshness, we will issue a replacement or full refund within 7 days.',
        category: 'Orders & Policy',
        order: 4
      }
    ];
    await FAQ.insertMany(faqs);
    console.log('[Seed] FAQs seeded.');
  }

  // 10. Seed Settings
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      storeName: 'QAMRAH',
      storeTagline: 'Royal Dry Fruits & Nuts',
      logo: '/images/logo.png',
      email: 'concierge@qamrahnuts.com',
      phone: '+91 (022) 8940-2200',
      whatsappNumber: '+916235820223',
      address: 'BKC Commercial Complex, Bandra East, Mumbai 400051, India',
      currency: 'INR',
      currencySymbol: '₹',
      shippingCharge: 49,
      freeShippingThreshold: 999,
      socialLinks: {
        instagram: 'https://instagram.com/qamrahnuts',
        facebook: 'https://facebook.com/qamrahnuts',
        youtube: 'https://youtube.com/@qamrahnuts'
      },
      whatsappNotificationEnabled: true
    });
    console.log('[Seed] Settings seeded.');
  }

  console.log('[Seed] Database initialization complete!');
};
