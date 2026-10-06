import mongoose from 'mongoose';

const availableWeightSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 }
  },
  { _id: false }
);

const nutritionalFactsSchema = new mongoose.Schema(
  {
    servingSize: { type: String, default: '30g' },
    calories: { type: String, default: '' },
    protein: { type: String, default: '' },
    totalFat: { type: String, default: '' },
    carbohydrates: { type: String, default: '' },
    dietaryFiber: { type: String, default: '' },
    magnesium: { type: String, default: '' }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    sku: {
      type: String,
      trim: true,
      sparse: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      lowercase: true
    },
    categoryName: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative'],
      default: 0
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    stock: {
      type: Number,
      default: 50,
      min: [0, 'Stock count cannot be negative']
    },
    inStock: {
      type: Boolean,
      default: true
    },
    packSize: {
      type: String,
      trim: true,
      default: '250g'
    },
    weight: {
      type: String,
      trim: true,
      default: '250g'
    },
    availableWeights: {
      type: [availableWeightSchema],
      default: []
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 100,
      min: 0
    },
    badge: {
      type: String,
      trim: true,
      default: ''
    },
    tag: {
      type: String,
      trim: true,
      default: ''
    },
    origin: {
      type: String,
      trim: true,
      default: ''
    },
    ingredients: {
      type: String,
      trim: true,
      default: ''
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    highlights: {
      type: [String],
      default: []
    },
    healthBenefits: {
      type: [String],
      default: []
    },
    nutritionalFacts: {
      type: nutritionalFactsSchema,
      default: () => ({})
    },
    mainImage: {
      type: String,
      required: [true, 'Main product image is required'],
      trim: true
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    backImage: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'archived'],
        message: 'Status must be active, inactive, or archived'
      },
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    bestseller: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Synchronize frontend aliases and computed fields before saving
productSchema.pre('save', function (next) {
  if (this.image && !this.mainImage) this.mainImage = this.image;
  if (this.mainImage && !this.image) this.image = this.mainImage;

  if (this.mrp && !this.originalPrice) this.originalPrice = this.mrp;
  if (this.originalPrice && !this.mrp) this.mrp = this.originalPrice;

  if (this.weight && !this.packSize) this.packSize = this.weight;
  if (this.packSize && !this.weight) this.weight = this.packSize;

  if (this.isFeatured !== undefined && this.featured === undefined) this.featured = this.isFeatured;
  if (this.featured !== undefined && this.isFeatured === undefined) this.isFeatured = this.featured;

  if (this.isBestseller !== undefined && this.bestseller === undefined) this.bestseller = this.isBestseller;
  if (this.bestseller !== undefined && this.isBestseller === undefined) this.isBestseller = this.bestseller;

  if (this.badge && !this.tag) this.tag = this.badge;
  if (this.tag && !this.badge) this.badge = this.tag;

  if (this.stock !== undefined) {
    this.inStock = Number(this.stock) > 0;
  }

  // Guard against storing massive base64 image strings in database
  if (this.mainImage && typeof this.mainImage === 'string' && this.mainImage.startsWith('data:image/') && this.mainImage.length > 2048) {
    return next(new Error('Base64 image data cannot be stored directly in database. Please provide a valid image URL or upload via Cloudinary.'));
  }
  if (this.image && typeof this.image === 'string' && this.image.startsWith('data:image/') && this.image.length > 2048) {
    return next(new Error('Base64 image data cannot be stored directly in database. Please provide a valid image URL or upload via Cloudinary.'));
  }

  next();
});

// Clean __v from JSON responses
productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ name: 'text', shortDescription: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
