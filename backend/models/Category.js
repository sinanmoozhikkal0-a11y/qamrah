import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    image: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
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

export default mongoose.model('Category', categorySchema);
