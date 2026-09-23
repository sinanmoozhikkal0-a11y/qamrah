import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      index: true
    },
    categoryName: {
      type: String,
      default: ''
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 50
    },
    inStock: {
      type: Boolean,
      default: true
    },
    packSize: {
      type: String,
      default: '250g'
    },
    availableWeights: [
      {
        label: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: 0 }
      }
    ],
    rating: {
      type: Number,
      default: 4.9
    },
    reviewCount: {
      type: Number,
      default: 120
    },
    badge: {
      type: String,
      default: ''
    },
    origin: {
      type: String,
      default: ''
    },
    highlights: [
      {
        type: String
      }
    ],
    healthBenefits: [
      {
        type: String
      }
    ],
    nutritionalFacts: {
      type: Map,
      of: String,
      default: {}
    },
    ingredients: {
      type: String,
      default: ''
    },
    mainImage: {
      type: String,
      default: ''
    },
    galleryImages: [
      {
        type: String
      }
    ],
    backImage: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestseller: {
      type: Boolean,
      default: false
    },
    availablePackDesigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PackDesign'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
