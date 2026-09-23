import mongoose from 'mongoose';

const homePageSchema = new mongoose.Schema(
  {
    announcement: {
      enabled: { type: Boolean, default: true },
      items: [
        {
          text: { type: String, default: '' },
          icon: { type: String, default: 'Award' }
        }
      ],
      trackOrderText: { type: String, default: 'Track Order' }
    },
    heroSlides: [
      {
        eyebrow: { type: String, default: '' },
        line1: { type: String, default: '' },
        line2: { type: String, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        button1Text: { type: String, default: 'DISCOVER COLLECTION' },
        button1Link: { type: String, default: '/shop' },
        button2Text: { type: String, default: 'VIEW PRODUCT' },
        button2Link: { type: String, default: '/shop' },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
      }
    ],
    featureBenefits: [
      {
        icon: { type: String, default: 'Award' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        enabled: { type: Boolean, default: true }
      }
    ],
    bestsellerSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'OUR BESTSELLERS' },
      title: { type: String, default: 'Our Premium Collection' },
      subtitle: { type: String, default: 'Experience the finest selection of nuts and dates, packed with nutrition, quality and natural goodness.' },
      productSlugs: [{ type: String }]
    },
    shopByCategorySection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'CURATED VARIETIES' },
      title: { type: String, default: 'Shop By Category' },
      subtitle: { type: String, default: 'Explore our master grades sorted by botanical origin and flavor profiles.' },
      categories: [
        {
          id: { type: String },
          name: { type: String },
          subtitle: { type: String },
          image: { type: String },
          link: { type: String }
        }
      ]
    },
    storyPreviewSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'OUR STORY' },
      heading: { type: String, default: 'Nature, Carefully Selected.' },
      paragraph1: { type: String, default: "At QAMRAH, we believe true luxury begins in the soil. Born from an uncompromising passion for purity and botanical excellence, our mission is to deliver the world's most exceptional tree nuts and sacred dates directly from ethical orchards to your dining table." },
      paragraph2: { type: String, default: 'Every single cashew, almond, date and pistachio in our collection is hand-graded for caliber, vacuum-sealed at peak freshness, and free from any chemical bleaches, artificial waxes, or preservatives.' },
      image: { type: String, default: '/images/story_heritage.jpg' },
      badgeYear: { type: String, default: 'SINCE 2024' },
      badgeText: { type: String, default: 'Artisanal Grading Standard' },
      buttonText: { type: String, default: 'DISCOVER OUR STORY' },
      buttonLink: { type: String, default: '/our-story' }
    },
    luxuryCtaSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'UNCOMPROMISING LUXURY' },
      heading: { type: String, default: 'GOODNESS YOU CAN TASTE' },
      subheading: { type: String, default: 'Premium nuts. Natural goodness. Delivered fresh in signature preservation packaging.' },
      buttonText: { type: String, default: 'SHOP COLLECTION' },
      buttonLink: { type: String, default: '/shop' }
    },
    newsletterSection: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: 'THE CONNOISSEUR CLUB' },
      title: { type: String, default: 'Receive Royal Privileges' },
      description: { type: String, default: 'Subscribe to access private seasonal harvest allocations, exclusive gifting curations, and 10% off your inaugural order.' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('HomePage', homePageSchema);
