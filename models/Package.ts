import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  sessions: {
    type: Number,
    required: true,
    min: 1
  },
  validity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
packageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
packageSchema.index({ name: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ isActive: 1, isDeleted: 1 });

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

export default Package; 