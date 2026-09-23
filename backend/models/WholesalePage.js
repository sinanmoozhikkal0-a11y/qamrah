import mongoose from 'mongoose';

const wholesalePageSchema = new mongoose.Schema(
  {
    header: {
      eyebrow: { type: String, default: 'INSTITUTIONAL & B2B PARTNERSHIPS' },
      heading: { type: String, default: 'QAMRAH WHOLESALE & GIFTING' },
      description: { type: String, default: 'Direct-from-source wholesale allocations, custom corporate luxury hampers, and premium bulk supplies with guaranteed caliber consistency.' }
    },
    corporateBanner: {
      eyebrow: { type: String, default: 'SIGNATURE CORPORATE COLLECTION' },
      title: { type: String, default: 'Bespoke Executive Gift Boxes' },
      description: { type: String, default: "Elevate your corporate relationships with hand-finished emerald lacquer boxes, brass preserve tins, and your company's gold foil embossed logo." },
      image: { type: String, default: '/images/gift_hamper.jpg' },
      features: [{ type: String }]
    },
    b2bSegments: [
      {
        icon: { type: String, default: 'Hotel' },
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('WholesalePage', wholesalePageSchema);
