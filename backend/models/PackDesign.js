import mongoose from 'mongoose';

const packDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    packType: {
      type: String,
      default: 'Pouch'
    },
    packSize: {
      type: String,
      default: 'Standard'
    },
    packImage: {
      type: String,
      default: ''
    },
    frontImage: {
      type: String,
      default: ''
    },
    backImage: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    priceAdjustment: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('PackDesign', packDesignSchema);
