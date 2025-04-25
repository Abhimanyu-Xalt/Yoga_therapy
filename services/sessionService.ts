import { FilterQuery } from 'mongoose';
import { BaseService } from './baseService';
import Session, { ISession } from '@/models/Session';

export class SessionService extends BaseService<ISession> {
  constructor() {
    super(Session);
  }

  async createSession(data: Partial<ISession>): Promise<ISession> {
    return this.create(data);
  }

  async findUpcomingSessions(
    filter: FilterQuery<ISession> = {},
    options = {}
  ): Promise<ISession[]> {
    return this.find(
      {
        ...filter,
        scheduledDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'in-progress'] },
        isDeleted: false,
      },
      {
        ...options,
        sort: { scheduledDate: 1 },
        populate: ['patientId', 'therapistId', 'packageId'],
      }
    );
  }

  async findPatientSessions(
    patientId: string,
    options = {}
  ): Promise<ISession[]> {
    return this.find(
      {
        patientId,
        isDeleted: false,
      },
      {
        ...options,
        sort: { scheduledDate: -1 },
        populate: ['therapistId', 'packageId'],
      }
    );
  }

  async findTherapistSessions(
    therapistId: string,
    options = {}
  ): Promise<ISession[]> {
    return this.find(
      {
        therapistId,
        isDeleted: false,
      },
      {
        ...options,
        sort: { scheduledDate: -1 },
        populate: ['patientId', 'packageId'],
      }
    );
  }

  async updateSessionStatus(
    sessionId: string,
    status: ISession['status'],
    notes?: {
      therapistNotes?: string;
      patientNotes?: string;
    }
  ): Promise<ISession | null> {
    const update: any = { status };
    if (notes) {
      if (notes.therapistNotes) {
        update['notes.therapistNotes'] = notes.therapistNotes;
      }
      if (notes.patientNotes) {
        update['notes.patientNotes'] = notes.patientNotes;
      }
    }
    return this.updateById(sessionId, update);
  }

  async markAttendance(
    sessionId: string,
    isPresent: boolean,
    markedBy: string
  ): Promise<ISession | null> {
    return this.updateById(sessionId, {
      'attendance.isPresent': isPresent,
      'attendance.markedBy': markedBy,
      'attendance.markedAt': new Date(),
      status: isPresent ? 'completed' : 'no-show',
    });
  }

  async cancelSession(
    sessionId: string,
    reason: string,
    cancelledBy: string
  ): Promise<ISession | null> {
    return this.updateById(sessionId, {
      status: 'cancelled',
      'cancellation.reason': reason,
      'cancellation.cancelledBy': cancelledBy,
      'cancellation.cancelledAt': new Date(),
    });
  }

  async getSessionStats(
    filter: FilterQuery<ISession> = {}
  ): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    upcoming: number;
  }> {
    const baseFilter = { ...filter, isDeleted: false };
    const [total, completed, cancelled, noShow, upcoming] = await Promise.all([
      this.count(baseFilter),
      this.count({ ...baseFilter, status: 'completed' }),
      this.count({ ...baseFilter, status: 'cancelled' }),
      this.count({ ...baseFilter, status: 'no-show' }),
      this.count({
        ...baseFilter,
        scheduledDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'in-progress'] },
      }),
    ]);

    return {
      total,
      completed,
      cancelled,
      noShow,
      upcoming,
    };
  }

  async getSessionsByDateRange(
    startDate: Date,
    endDate: Date,
    filter: FilterQuery<ISession> = {},
    options = {}
  ): Promise<ISession[]> {
    return this.find(
      {
        ...filter,
        scheduledDate: {
          $gte: startDate,
          $lte: endDate,
        },
        isDeleted: false,
      },
      {
        ...options,
        sort: { scheduledDate: 1 },
        populate: ['patientId', 'therapistId', 'packageId'],
      }
    );
  }
} 