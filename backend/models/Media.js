import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      default: function () {
        return this.url;
      }
    },
    public_id: {
      type: String,
      index: true,
      default: ''
    },
    // Backwards-compatible publicId alias
    publicId: {
      type: String,
      default: function () {
        return this.public_id;
      }
    },
    filename: {
      type: String,
      required: true
    },
    originalFilename: {
      type: String,
      default: ''
    },
    altText: {
      type: String,
      default: ''
    },
    folder: {
      type: String,
      default: 'qamrah'
    },
    section: {
      type: String,
      enum: ['hero', 'product', 'category', 'pack', 'gallery', 'service', 'story', 'general'],
      default: 'general'
    },
    format: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    storageType: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'cloudinary'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to ensure publicId and public_id stay in sync
mediaSchema.pre('save', function (next) {
  if (this.public_id && !this.publicId) {
    this.publicId = this.public_id;
  } else if (this.publicId && !this.public_id) {
    this.public_id = this.publicId;
  }
  if (this.url && !this.secure_url) {
    this.secure_url = this.url;
  }
  next();
});

export default mongoose.model('Media', mediaSchema);
