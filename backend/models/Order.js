import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    name: {
      type: String,
      required: [true, 'Product name snapshot is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price snapshot is required'],
      min: [0, 'Price cannot be negative']
    },
    weight: {
      type: String,
      default: '250g',
      trim: true
    },
    packDesign: {
      type: String,
      default: 'Classic QAMRAH Pack',
      trim: true
    },
    packPriceAdjustment: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      default: '',
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code / pincode is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    }
  },
  { _id: false }
);

const orderTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order items list cannot be empty'
      }
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required']
    },
    // Backward compatibility customer alias
    customer: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      notes: { type: String, trim: true, default: '' }
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative']
    },
    // Alias for frontend compatibility
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: 'Payment status must be pending, paid, failed, or refunded'
      },
      default: 'pending',
      lowercase: true,
      index: true
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
      trim: true
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: 'Order status must be pending, confirmed, processing, shipped, delivered, or cancelled'
      },
      default: 'pending',
      lowercase: true,
      index: true
    },
    // Status alias for storefront and CMS
    status: {
      type: String,
      default: 'pending',
      lowercase: true
    },
    timeline: {
      type: [orderTimelineSchema],
      default: []
    },
    cancelledAt: {
      type: Date
    },
    cancelReason: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save synchronization for aliases and consistent status
orderSchema.pre('save', function (next) {
  // Sync status and orderStatus
  if (this.orderStatus && !this.status) {
    this.status = this.orderStatus.toLowerCase();
  } else if (this.status && !this.orderStatus) {
    this.orderStatus = this.status.toLowerCase();
  } else if (this.isModified('orderStatus')) {
    this.status = this.orderStatus.toLowerCase();
  } else if (this.isModified('status')) {
    this.orderStatus = this.status.toLowerCase();
  }

  // Sync shipping and shippingFee
  if (this.shippingFee !== undefined && this.shipping === undefined) {
    this.shipping = this.shippingFee;
  } else if (this.shipping !== undefined && this.shippingFee === undefined) {
    this.shippingFee = this.shipping;
  } else if (this.isModified('shippingFee')) {
    this.shipping = this.shippingFee;
  }

  // Populate customer object from shippingAddress for CMS compatibility
  if (this.shippingAddress) {
    this.customer = {
      name: this.shippingAddress.fullName,
      phone: this.shippingAddress.phone,
      address: this.shippingAddress.address,
      city: this.shippingAddress.city,
      state: this.shippingAddress.state,
      pincode: this.shippingAddress.postalCode,
      notes: this.notes || ''
    };
  }

  // Add initial timeline event if empty
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = [
      {
        status: this.orderStatus || 'pending',
        note: 'Order successfully created and registered in QAMRAH system.',
        timestamp: new Date()
      }
    ];
  }

  next();
});

// Clean __v from JSON responses
orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

// Compound indexes for performant queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
