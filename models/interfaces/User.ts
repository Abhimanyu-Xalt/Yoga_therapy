import { Document } from 'mongoose';

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'admin' | 'patient' | 'therapist';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin extends IUser {
  permissions: string[];
}

export interface IPatient extends IUser {
  age: number;
  gender: string;
  medicalHistory: string[];
  assignedTherapist?: string; // therapist ID
  activePackage?: string; // package ID
}

export interface ITherapist extends IUser {
  specialization: string[];
  experience: number;
  qualifications: string[];
  availability: {
    day: string;
    slots: string[];
  }[];
  rating: number;
  patients: string[]; // patient IDs
  bio: string;
  certifications: string[];
} 