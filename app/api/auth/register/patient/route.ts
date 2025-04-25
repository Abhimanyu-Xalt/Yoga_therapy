import { NextResponse } from 'next/server';
import Patient from '@/models/Patient';
import { connectDB } from '@/lib/mongodb';
import { validatePassword, validateEmail, validatePhone } from '@/utils/validation';

export async function POST(request: Request) {
  try {
    // Ensure MongoDB is connected
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'password',
      'phoneCode',
      'phone',
      'dateOfBirth',
      'gender'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailValidation = validateEmail(body.email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneValidation = validatePhone(body.phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: phoneValidation.message },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingPatient = await Patient.findOne({ email: body.email });
    if (existingPatient) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new patient
    const newPatient = await Patient.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password, // Note: In production, hash the password
      phoneCode: body.phoneCode,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      medicalHistory: body.medicalHistory || [],
      allergies: body.allergies || [],
      emergencyContact: body.emergencyContact,
      address: body.address,
      role: 'patient',
      isVerified: false,
      isActive: true,
      isDeleted: false,
      profileImage: body.profileImage || undefined
    });

    // Remove sensitive data from response
    const patientResponse = {
      id: newPatient._id,
      name: newPatient.name,
      email: newPatient.email,
      phoneCode: newPatient.phoneCode,
      phone: newPatient.phone,
      dateOfBirth: newPatient.dateOfBirth,
      gender: newPatient.gender,
      role: newPatient.role,
      isVerified: newPatient.isVerified,
      isActive: newPatient.isActive
    };

    return NextResponse.json(
      {
        message: 'Patient registered successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Patient registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 