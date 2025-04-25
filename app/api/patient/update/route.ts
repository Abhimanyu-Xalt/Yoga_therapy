import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { verifyAdminToken } from '@/middleware/adminAuth';
import { validateEmail, validatePhone } from '@/utils/validation';

// Validation function for patient update data
const validateUpdateData = (data: any) => {
  const errors = [];

  if (data.name && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.message);
    }
  }

  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.message);
    }
  }

  if (data.dateOfBirth && isNaN(new Date(data.dateOfBirth).getTime())) {
    errors.push('Invalid date of birth format');
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.push('Gender must be either male, female, or other');
  }

  if (data.medicalHistory && !Array.isArray(data.medicalHistory)) {
    errors.push('Medical history must be an array');
  }

  if (data.allergies && !Array.isArray(data.allergies)) {
    errors.push('Allergies must be an array');
  }

  return errors;
};

export async function PUT(request: Request) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken();
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validationErrors = validateUpdateData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if patient exists
    const existingPatient = await Patient.findOne({ _id: body.id, isDeleted: false });
    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // If email is being updated, check for duplicates
    if (body.email && body.email !== existingPatient.email) {
      const emailExists = await Patient.findOne({
        _id: { $ne: body.id },
        email: body.email,
        isDeleted: false
      });
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already registered to another patient' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email.toLowerCase() }),
      ...(body.phoneCode && { phoneCode: body.phoneCode }),
      ...(body.phone && { phone: body.phone }),
      ...(body.dateOfBirth && { dateOfBirth: body.dateOfBirth }),
      ...(body.gender && { gender: body.gender }),
      ...(body.medicalHistory && { medicalHistory: body.medicalHistory }),
      ...(body.allergies && { allergies: body.allergies }),
      ...(body.emergencyContact && { emergencyContact: body.emergencyContact }),
      ...(body.address && { address: body.address }),
      ...(typeof body.isActive === 'boolean' && { isActive: body.isActive }),
      ...(body.profileImage && { profileImage: body.profileImage })
    };

    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      body.id,
      updateData,
      { new: true }
    ).select('-password -__v');

    return NextResponse.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error: any) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 