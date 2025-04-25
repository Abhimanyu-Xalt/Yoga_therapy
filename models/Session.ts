import mongoose, { Schema } from 'mongoose';

export interface ISession extends Document {
  packageId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  therapistId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes: {
    therapistNotes?: string;
    patientNotes?: string;
  };
  attendance: {
    isPresent: boolean;
    markedBy: mongoose.Types.ObjectId;
    markedAt?: Date;
  };
  cancellation?: {
    reason: string;
    cancelledBy: mongoose.Types.ObjectId;
    cancelledAt: Date;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema({
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
  scheduledDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    therapistNotes: String,
    patientNotes: String
  },
  attendance: {
    isPresent: { type: Boolean, default: false },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    markedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date
  },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Create indexes
SessionSchema.index({ packageId: 1 });
SessionSchema.index({ patientId: 1 });
SessionSchema.index({ therapistId: 1 });
SessionSchema.index({ scheduledDate: 1 });
SessionSchema.index({ status: 1 });
SessionSchema.index({ 'attendance.isPresent': 1 });
SessionSchema.index({ isDeleted: 1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema); 