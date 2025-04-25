import mongoose, { Schema } from 'mongoose';

export interface IPayment extends Document {
  patientId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  paymentGatewayResponse?: any;
  refundDetails?: {
    amount: number;
    reason: string;
    refundedAt: Date;
    refundedBy: mongoose.Types.ObjectId;
    transactionId: string;
  };
  metadata?: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: String,
  paymentGatewayResponse: Schema.Types.Mixed,
  refundDetails: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    transactionId: String
  },
  metadata: Schema.Types.Mixed,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
PaymentSchema.index({ patientId: 1 });
PaymentSchema.index({ packageId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema); 