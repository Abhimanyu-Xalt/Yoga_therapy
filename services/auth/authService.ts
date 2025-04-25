import { IUser, IPatient, ITherapist, IAdmin } from '../../models/interfaces/User';

export class AuthService {
  // Admin login
  async adminLogin(email: string, password: string): Promise<{ token: string; user: IAdmin }> {
    // TODO: Implement actual admin login logic
    throw new Error('Not implemented');
  }

  // Patient login
  async patientLogin(email: string, password: string): Promise<{ token: string; user: IPatient }> {
    // TODO: Implement actual patient login logic
    throw new Error('Not implemented');
  }

  // Patient signup
  async patientSignup(userData: Omit<IPatient, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ token: string; user: IPatient }> {
    // TODO: Implement actual patient signup logic
    throw new Error('Not implemented');
  }

  // Therapist login
  async therapistLogin(email: string, password: string): Promise<{ token: string; user: ITherapist }> {
    // TODO: Implement actual therapist login logic
    throw new Error('Not implemented');
  }

  // Therapist signup
  async therapistSignup(userData: Omit<ITherapist, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ token: string; user: ITherapist }> {
    // TODO: Implement actual therapist signup logic
    throw new Error('Not implemented');
  }

  // Verify token
  async verifyToken(token: string): Promise<IUser> {
    // TODO: Implement token verification logic
    throw new Error('Not implemented');
  }
} 