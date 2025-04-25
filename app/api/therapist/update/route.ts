import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Therapist from '@/models/Therapist';
import { verifyAdminToken } from '@/middleware/adminAuth';
import { validateEmail, validatePhone } from '@/utils/validation';

// Validation function for therapist update data
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

  if (data.specializations && (!Array.isArray(data.specializations) || data.specializations.length === 0)) {
    errors.push('Specializations must be a non-empty array');
  }

  if (data.experience && typeof data.experience !== 'string') {
    errors.push('Experience must be a string');
  }

  if (data.qualifications && (!Array.isArray(data.qualifications) || data.qualifications.length === 0)) {
    errors.push('Qualifications must be a non-empty array');
  }

  if (data.education && typeof data.education !== 'string') {
    errors.push('Education must be a string');
  }

  if (data.certifications && (!Array.isArray(data.certifications))) {
    errors.push('Certifications must be an array');
  }

  if (data.languages && (!Array.isArray(data.languages) || data.languages.length === 0)) {
    errors.push('Languages must be a non-empty array');
  }

  if (data.consultationFee && (typeof data.consultationFee !== 'number' || data.consultationFee < 0)) {
    errors.push('Consultation fee must be a non-negative number');
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
        { error: 'Therapist ID is required' },
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

    // Check if therapist exists
    const existingTherapist = await Therapist.findOne({ _id: body.id, isDeleted: false });
    if (!existingTherapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    // If email is being updated, check for duplicates
    if (body.email && body.email !== existingTherapist.email) {
      const emailExists = await Therapist.findOne({
        _id: { $ne: body.id },
        email: body.email,
        isDeleted: false
      });
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already registered to another therapist' },
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
      ...(body.specializations && { specializations: body.specializations }),
      ...(body.experience && { experience: body.experience }),
      ...(body.qualifications && { qualifications: body.qualifications }),
      ...(body.education && { education: body.education }),
      ...(body.certifications && { certifications: body.certifications }),
      ...(body.languages && { languages: body.languages }),
      ...(body.bio && { bio: body.bio }),
      ...(typeof body.consultationFee === 'number' && { consultationFee: body.consultationFee }),
      ...(body.availability && { availability: body.availability }),
      ...(typeof body.isActive === 'boolean' && { isActive: body.isActive }),
      ...(typeof body.isVerified === 'boolean' && { isVerified: body.isVerified }),
      ...(body.profileImage && { profileImage: body.profileImage })
    };

    // Update therapist
    const updatedTherapist = await Therapist.findByIdAndUpdate(
      body.id,
      updateData,
      { new: true }
    ).select('-password -__v');

    return NextResponse.json({
      message: 'Therapist updated successfully',
      therapist: updatedTherapist
    });
  } catch (error: any) {
    console.error('Update therapist error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 