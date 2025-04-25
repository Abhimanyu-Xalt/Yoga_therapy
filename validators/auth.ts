import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneCode: z.string(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const patientSignupSchema = adminSignupSchema.extend({
  bloodGroup: z.string(),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone must be at least 10 digits'),
  emergencyContactRelation: z.string(),
});

export const therapistSignupSchema = adminSignupSchema.extend({
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  availability: z.object({
    days: z.array(z.string()).min(1, 'At least one day must be selected'),
    timeSlots: z.array(z.string()).min(1, 'At least one time slot must be selected'),
  }),
}); 