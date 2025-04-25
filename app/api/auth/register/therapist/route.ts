import { NextResponse } from 'next/server';
import Therapist from '@/models/Therapist';
import { connectDB } from '@/lib/mongodb';
import { validatePassword, validateEmail, validatePhone } from '@/utils/validation';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'password',
      'phoneCode',
      'phone',
      'specializations',
      'experience',
      'qualifications',
      'education',
      'certifications',
      'languages'
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

    // Validate array fields
    const arrayFields = ['specializations', 'qualifications', 'certifications', 'languages'];
    for (const field of arrayFields) {
      if (!Array.isArray(body[field]) || body[field].length === 0) {
        return NextResponse.json(
          { error: `${field} must be a non-empty array` },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingTherapist = await Therapist.findOne({ email: body.email });
    if (existingTherapist) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new therapist
    const newTherapist = await Therapist.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password, // Note: In production, hash the password
      phoneCode: body.phoneCode,
      phone: body.phone,
      specializations: body.specializations,
      experience: body.experience,
      qualifications: body.qualifications,
      education: body.education,
      certifications: body.certifications,
      languages: body.languages,
      bio: body.bio || '',
      consultationFee: body.consultationFee || 0,
      availability: body.availability || [],
      role: 'therapist',
      isVerified: false,
      isActive: true,
      isDeleted: false,
      profileImage: body.profileImage || undefined,
      rating: 0,
      totalSessions: 0,
      totalPatients: 0
    });

    // Remove sensitive data from response
    const therapistResponse = {
      id: newTherapist._id,
      name: newTherapist.name,
      email: newTherapist.email,
      phoneCode: newTherapist.phoneCode,
      phone: newTherapist.phone,
      specializations: newTherapist.specializations,
      experience: newTherapist.experience,
      qualifications: newTherapist.qualifications,
      education: newTherapist.education,
      certifications: newTherapist.certifications,
      languages: newTherapist.languages,
      bio: newTherapist.bio,
      consultationFee: newTherapist.consultationFee,
      role: newTherapist.role,
      isVerified: newTherapist.isVerified,
      isActive: newTherapist.isActive
    };

    return NextResponse.json(
      {
        message: 'Therapist registered successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Therapist registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 