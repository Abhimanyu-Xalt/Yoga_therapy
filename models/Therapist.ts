import mongoose, { Schema } from 'mongoose';
import { IUser } from './interfaces/User';

export interface ITherapist extends IUser {
  role: 'therapist';
  specialization: string[];
  experience: number;
  qualifications: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
  rating?: number;
}

const TherapistSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneCode: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'therapist' },
  specialization: [{ type: String, required: true }],
  experience: { type: Number, required: true },
  qualifications: [{ type: String, required: true }],
  availability: {
    days: [{ type: String }],
    timeSlots: [{ type: String }]
  },
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String },
}, {
  timestamps: true
});

// Create indexes
TherapistSchema.index({ email: 1 });
TherapistSchema.index({ phone: 1 });
TherapistSchema.index({ specialization: 1 });
TherapistSchema.index({ rating: -1 });

export default mongoose.models.Therapist || mongoose.model<ITherapist>('Therapist', TherapistSchema); 