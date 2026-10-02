import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Never return password in normal queries/responses
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: 'Role must be either customer or admin'
      },
      default: 'customer'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Remove password and __v when converting document to JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
