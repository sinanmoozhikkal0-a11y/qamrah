import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'QAMRAH'
    },
    storeTagline: {
      type: String,
      default: 'Royal Dry Fruits & Nuts'
    },
    logo: {
      type: String,
      default: '/images/logo.png'
    },
    email: {
      type: String,
      default: 'concierge@qamrahnuts.com'
    },
    phone: {
      type: String,
      default: '+91 (022) 8940-2200'
    },
    whatsappNumber: {
      type: String,
      default: '+916235820223'
    },
    address: {
      type: String,
      default: 'BKC Commercial Complex, Bandra East, Mumbai 400051, India'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    currencySymbol: {
      type: String,
      default: '₹'
    },
    shippingCharge: {
      type: Number,
      default: 49
    },
    freeShippingThreshold: {
      type: Number,
      default: 999
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/qamrahnuts' },
      facebook: { type: String, default: 'https://facebook.com/qamrahnuts' },
      youtube: { type: String, default: 'https://youtube.com/@qamrahnuts' }
    },
    whatsappNotificationEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
