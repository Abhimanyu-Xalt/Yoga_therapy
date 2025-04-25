export interface IPackage {
  id: string;
  name: string;
  description: string;
  sessions: number;
  validity: number; // in days
  price: number;
  features: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatientPackage {
  id: string;
  patientId: string;
  packageId: string;
  purchaseDate: Date;
  expiryDate: Date;
  sessionsLeft: number;
  status: 'active' | 'completed' | 'expired';
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount: number;
  transactionId?: string;
} 