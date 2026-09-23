import mongoose from 'mongoose';

const wholesaleEnquirySchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      default: 'Corporate'
    },
    productInterest: {
      type: String,
      default: 'All Products'
    },
    orderVolume: {
      type: String,
      default: '100kg - 500kg'
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Completed'],
      default: 'New'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('WholesaleEnquiry', wholesaleEnquirySchema);
