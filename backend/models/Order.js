import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: '250g'
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  packDesign: {
    type: String,
    default: 'Classic QAMRAH Pack'
  },
  packPriceAdjustment: {
    type: Number,
    default: 0
  },
  itemTotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, required: true },
      notes: { type: String, default: '' }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery'
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    whatsappSent: {
      type: Boolean,
      default: false
    },
    whatsappMessage: {
      type: String,
      default: ''
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
