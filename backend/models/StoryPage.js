import mongoose from 'mongoose';

const storyPageSchema = new mongoose.Schema(
  {
    header: {
      eyebrow: { type: String, default: 'HERITAGE & PURITY' },
      heading: { type: String, default: 'THE STORY BEHIND QAMRAH' },
      quote: { type: String, default: '"Born from a reverence for the sacred earth, timeless botanical traditions, and the pursuit of unadulterated nourishment."' }
    },
    philosophy: {
      eyebrow: { type: String, default: 'OUR PHILOSOPHY' },
      heading: { type: String, default: 'Nature, Unaltered & Elevated.' },
      paragraph1: { type: String, default: 'In an era where industrial mass production frequently masks inferior dry fruits with chemical bleaches, excessive salts, and synthetic glazes, QAMRAH was founded on a singular tenet: The true taste of nature requires no embellishment.' },
      paragraph2: { type: String, default: 'From sacred Madinah palm groves cultivating revered Ajwa dates to coastal Indian orchards bearing massive W-180 cashews, our procurement team journeys to geographical origins with deep botanical pedigree. We ensure ethical harvesting, direct farmer compensation, and zero compromises in sorting.' },
      image: { type: String, default: '/images/story_heritage.jpg' },
      stat1Number: { type: String, default: '100%' },
      stat1Label: { type: String, default: 'Pure & Chemical Free' },
      stat2Number: { type: String, default: 'Top 5%' },
      stat2Label: { type: String, default: 'Hand-Selected Caliber' }
    },
    pillars: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'Award' }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('StoryPage', storyPageSchema);
