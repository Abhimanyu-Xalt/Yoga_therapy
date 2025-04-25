import mongoose, { Schema } from 'mongoose';

export interface IFeedback extends Document {
  type: 'session' | 'platform';
  sessionId?: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  therapistId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  tags: string[];
  status: 'pending' | 'reviewed' | 'archived';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  isPublic: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema({
  type: {
    type: String,
    enum: ['session', 'platform'],
    required: true
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session'
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  therapistId: {
    type: Schema.Types.ObjectId,
    ref: 'Therapist'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'archived'],
    default: 'pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: Date,
  isPublic: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
FeedbackSchema.index({ type: 1 });
FeedbackSchema.index({ sessionId: 1 });
FeedbackSchema.index({ patientId: 1 });
FeedbackSchema.index({ therapistId: 1 });
FeedbackSchema.index({ rating: -1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ isPublic: 1, isDeleted: 1 });

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema); 