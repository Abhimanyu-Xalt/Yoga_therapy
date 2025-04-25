import { FilterQuery } from 'mongoose';
import { BaseService } from './baseService';
import Therapist, { ITherapist } from '@/models/Therapist';
import { hashPassword } from '@/utils/auth';

export class TherapistService extends BaseService<ITherapist> {
  constructor() {
    super(Therapist);
  }

  async createTherapist(data: Partial<ITherapist>): Promise<ITherapist> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return this.create(data);
  }

  async findActiveTherapists(
    filter: FilterQuery<ITherapist> = {},
    options = {}
  ): Promise<ITherapist[]> {
    return this.find(
      {
        ...filter,
        isActive: true,
        isDeleted: false,
      },
      options
    );
  }

  async findByEmail(email: string): Promise<ITherapist | null> {
    return this.findOne({ email, isDeleted: false });
  }

  async findBySpecialization(
    specializations: string[],
    options = {}
  ): Promise<ITherapist[]> {
    return this.find(
      {
        specialization: { $in: specializations },
        isActive: true,
        isDeleted: false,
      },
      options
    );
  }

  async updateProfile(
    therapistId: string,
    data: Partial<ITherapist>
  ): Promise<ITherapist | null> {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, isActive, isDeleted, rating, ...updateData } = data;
    return this.updateById(therapistId, updateData);
  }

  async updateAvailability(
    therapistId: string,
    availability: {
      days: string[];
      timeSlots: string[];
    }
  ): Promise<ITherapist | null> {
    return this.updateById(therapistId, { availability });
  }

  async updateRating(
    therapistId: string,
    newRating: number
  ): Promise<ITherapist | null> {
    return this.updateById(therapistId, { rating: newRating });
  }

  async deactivateAccount(therapistId: string): Promise<ITherapist | null> {
    return this.updateById(therapistId, {
      isActive: false,
    });
  }

  async softDelete(therapistId: string): Promise<ITherapist | null> {
    return this.updateById(therapistId, {
      isDeleted: true,
      isActive: false,
    });
  }

  async searchTherapists(
    query: string,
    options = {}
  ): Promise<ITherapist[]> {
    return this.find(
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } },
        ],
        isDeleted: false,
      },
      options
    );
  }

  async getTherapistStats(): Promise<{
    total: number;
    active: number;
    averageRating: number;
  }> {
    const [total, active, ratingStats] = await Promise.all([
      this.count({ isDeleted: false }),
      this.count({ isDeleted: false, isActive: true }),
      Therapist.aggregate([
        {
          $match: {
            isDeleted: false,
            isActive: true,
            rating: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
          },
        },
      ]).exec(),
    ]);

    return {
      total,
      active,
      averageRating: ratingStats[0]?.averageRating || 0,
    };
  }
} 