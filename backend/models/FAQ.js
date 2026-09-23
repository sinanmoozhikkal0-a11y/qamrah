import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    order: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default mongoose.model('FAQ', faqSchema);
