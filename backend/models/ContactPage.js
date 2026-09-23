import mongoose from 'mongoose';

const contactPageSchema = new mongoose.Schema(
  {
    header: {
      eyebrow: { type: String, default: 'CUSTOMER CONCIERGE' },
      heading: { type: String, default: 'GET IN TOUCH' },
      description: { type: String, default: 'Have a question about our harvest grades, custom hampers, or existing orders? Our dedicated team is delighted to assist you.' }
    },
    email: {
      type: String,
      default: 'concierge@qamrahnuts.com'
    },
    phone: {
      type: String,
      default: '+91 (022) 8940-2200 / +91 98200 44888'
    },
    whatsapp: {
      type: String,
      default: '+91 62358 20223'
    },
    address: {
      type: String,
      default: 'QAMRAH Fine Foods Ltd, 4th Floor, Crescent Tower, BKC Commercial Complex, Mumbai 400051, India'
    },
    workingHours: {
      type: String,
      default: 'Monday – Saturday: 9:00 AM – 8:00 PM IST'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ContactPage', contactPageSchema);
