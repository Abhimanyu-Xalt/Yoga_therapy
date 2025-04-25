import { FilterQuery } from 'mongoose';
import { BaseService } from './baseService';
import Patient, { IPatient } from '@/models/Patient';
import { hashPassword } from '@/utils/auth';

export class PatientService extends BaseService<IPatient> {
  constructor() {
    super(Patient);
  }

  async createPatient(data: Partial<IPatient>): Promise<IPatient> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return this.create(data);
  }

  async findActivePatients(
    filter: FilterQuery<IPatient> = {},
    options = {}
  ): Promise<IPatient[]> {
    return this.find(
      {
        ...filter,
        isActive: true,
        isDeleted: false,
      },
      options
    );
  }

  async findByEmail(email: string): Promise<IPatient | null> {
    return this.findOne({ email, isDeleted: false });
  }

  async assignTherapist(
    patientId: string,
    therapistId: string
  ): Promise<IPatient | null> {
    return this.updateById(patientId, {
      assignedTherapist: therapistId,
    });
  }

  async updateProfile(
    patientId: string,
    data: Partial<IPatient>
  ): Promise<IPatient | null> {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, isActive, isDeleted, ...updateData } = data;
    return this.updateById(patientId, updateData);
  }

  async deactivateAccount(patientId: string): Promise<IPatient | null> {
    return this.updateById(patientId, {
      isActive: false,
    });
  }

  async softDelete(patientId: string): Promise<IPatient | null> {
    return this.updateById(patientId, {
      isDeleted: true,
      isActive: false,
    });
  }

  async searchPatients(
    query: string,
    options = {}
  ): Promise<IPatient[]> {
    return this.find(
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
        ],
        isDeleted: false,
      },
      options
    );
  }

  async getPatientStats(): Promise<{
    total: number;
    active: number;
    withTherapist: number;
  }> {
    const [total, active, withTherapist] = await Promise.all([
      this.count({ isDeleted: false }),
      this.count({ isDeleted: false, isActive: true }),
      this.count({
        isDeleted: false,
        isActive: true,
        assignedTherapist: { $exists: true },
      }),
    ]);

    return {
      total,
      active,
      withTherapist,
    };
  }
} 