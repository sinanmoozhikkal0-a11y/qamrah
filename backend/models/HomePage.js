import mongoose from 'mongoose';

const homePageSchema = new mongoose.Schema(
  {
    heroSection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    heroSlides: {
      type: Array,
      default: []
    },
    featureBenefits: {
      type: Array,
      default: []
    },
    bestsellerSection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    shopByCategorySection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    storyPreviewSection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    luxuryCtaSection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    newsletterSection: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'homepages'
  }
);

export default mongoose.models.HomePage || mongoose.model('HomePage', homePageSchema);
