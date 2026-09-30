import HomePage from '../models/HomePage.js';
import { sendResponse } from '../utils/sendResponse.js';

const defaultHeroSection = {
  enabled: true,
  eyebrow: 'NATURAL GOODNESS',
  headingLine1: 'Start Your Day With Our',
  headingLine2: 'Fresh Dates.',
  description: 'Naturally soft, caramel-rich, and nourishing from royal groves.',
  ctaText: 'Buy Now',
  ctaLink: '/product/dates',
  backgroundImage: '/images/hero_slide_dates.jpg',
  rotationTiming: 5,
  badgeText: 'PREMIUM QUALITY',
  products: [
    {
      name: 'Fresh Dates',
      subName: 'Royal Madinah & Saudi Harvest',
      headline: 'Start Your Day With Our Fresh Dates.',
      headingLine1: 'Start Your Day With Our',
      headingLine2: 'Fresh Dates.',
      image: '/images/hero_slide_dates.jpg',
      pouchImage: '/images/pouch_dates.jpg',
      description: 'Naturally soft, caramel-rich, and nourishing from royal Madinah groves.',
      ctaText: 'Buy Now',
      link: '/product/dates',
      order: 1,
      isActive: true
    },
    {
      name: 'Whole Cashews',
      subName: 'Colossal W-180 • Hand-Selected',
      headline: 'Pure Crunch In Every Bite Colossal Cashews.',
      headingLine1: 'Pure Crunch In Every Bite',
      headingLine2: 'Colossal Cashews.',
      image: '/images/hero_slide_cashews.jpg',
      pouchImage: '/images/pouch_cashew.jpg',
      description: 'Naturally sourced, hand-sorted colossal kernels with an irresistible golden crunch.',
      ctaText: 'Buy Now',
      link: '/product/cashews',
      order: 2,
      isActive: true
    },
    {
      name: 'California Almonds',
      subName: 'Supreme Grade • 100% Raw & Natural',
      headline: 'Sun-Drenched Vitality California Almonds.',
      headingLine1: 'Sun-Drenched Vitality',
      headingLine2: 'California Almonds.',
      image: '/images/hero_slide_almonds.jpg',
      pouchImage: '/images/pouch_almond.jpg',
      description: 'Rich in natural Vitamin E, wholesome plant protein, and revitalizing crispness.',
      ctaText: 'Buy Now',
      link: '/product/almonds',
      order: 3,
      isActive: true
    },
    {
      name: 'Persian Pistachios',
      subName: 'Persian Akbari • Light Pink Salt Roast',
      headline: 'Naturally Opened & Crisp Persian Pistachios.',
      headingLine1: 'Naturally Opened & Crisp',
      headingLine2: 'Persian Pistachios.',
      image: '/images/hero_slide_pistachios.png',
      pouchImage: '/images/pouch_pista.jpg',
      description: 'Jumbo sun-dried kernels slowly dry-roasted with mineral-rich pink rock salt.',
      ctaText: 'Buy Now',
      link: '/product/pistachios',
      order: 4,
      isActive: true
    },
    {
      name: 'Royal Emerald Pistachios',
      subName: 'Emerald Harvest • Rare Caliber',
      headline: 'The True Taste of Royal Luxury Pistachios.',
      headingLine1: 'The True Taste of Royal',
      headingLine2: 'Luxury Pistachios.',
      image: '/images/hero_slide_pista_dark.jpg',
      pouchImage: '/images/pouch_pista.jpg',
      description: 'Vibrant emerald green kernels harvested at peak ripeness for unmatched royal aroma.',
      ctaText: 'Buy Now',
      link: '/product/pistachios',
      order: 5,
      isActive: true
    }
  ]
};

export const getHomePageData = async (_req, res) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create({ heroSection: defaultHeroSection });
    } else if (!home.heroSection || !home.heroSection.products || home.heroSection.products.length === 0) {
      home.heroSection = defaultHeroSection;
      await home.save();
    }
    return sendResponse(res, 200, true, 'Home page data retrieved.', home);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateHomePageData = async (req, res) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create(req.body);
    } else {
      home = await HomePage.findByIdAndUpdate(home._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Changes saved successfully.', home);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to save changes: ' + err.message);
  }
};
