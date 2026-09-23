import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
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
      default: '',
      trim: true
    },
    subject: {
      type: String,
      default: 'General'
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied'],
      default: 'New'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
