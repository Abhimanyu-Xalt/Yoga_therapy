import mongoose, { Schema } from 'mongoose';
import { IUser } from './interfaces/User';

export interface IPatient extends IUser {
  role: 'patient';
  bloodGroup: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  assignedTherapist?: mongoose.Types.ObjectId;
}

const PatientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneCode: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'patient' },
  bloodGroup: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  emergencyContactRelation: { type: String, required: true },
  assignedTherapist: { type: Schema.Types.ObjectId, ref: 'Therapist' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String },
}, {
  timestamps: true
});

// Create indexes
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ assignedTherapist: 1 });

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema); 