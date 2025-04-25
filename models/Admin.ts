import mongoose from 'mongoose';
import { IUser } from './interfaces/User';

export interface IAdmin extends IUser {
  role: 'admin' | 'super_admin';
  permissions?: string[];
}

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't include password in normal queries
  },
  phoneCode: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  permissions: [{
    type: String,
    enum: [
      'manage_patients',
      'manage_therapists',
      'manage_packages',
      'manage_sessions',
      'manage_payments',
      'view_reports',
      'manage_admins'
    ]
  }],
  isVerified: { type: Boolean, default: false },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  profileImage: { type: String },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
adminSchema.index({ email: 1 });
adminSchema.index({ phone: 1 });

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin; 