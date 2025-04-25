export interface ISession {
  id: string;
  patientId: string;
  therapistId: string;
  packageId: string;
  date: Date;
  startTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeedback {
  id: string;
  type: 'session' | 'platform';
  sessionId?: string;
  therapistId?: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IInvoice {
  id: string;
  sessionId: string;
  patientId: string;
  therapistId: string;
  packageId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  paidAt?: Date;
} 