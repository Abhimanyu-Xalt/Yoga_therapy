import { NextResponse } from 'next/server';
import Therapist from '@/models/Therapist';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find therapist by email
    const therapist = await Therapist.findOne({ 
      email: body.email,
      isDeleted: false 
    }).select('+password').exec();

    // Check if therapist exists
    if (!therapist) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if therapist is active
    if (!therapist.isActive) {
      return NextResponse.json(
        { error: 'Your account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // In a real application, you would hash the password and compare with the hashed version
    // For now, we're doing a direct comparison
    if (therapist.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: therapist._id,
        email: therapist.email,
        role: 'therapist'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data from response
    const therapistResponse = {
      id: therapist._id,
      name: therapist.name,
      email: therapist.email,
      phoneCode: therapist.phoneCode,
      phone: therapist.phone,
      specializations: therapist.specializations,
      experience: therapist.experience,
      qualifications: therapist.qualifications,
      education: therapist.education,
      certifications: therapist.certifications,
      languages: therapist.languages,
      bio: therapist.bio,
      consultationFee: therapist.consultationFee,
      availability: therapist.availability,
      role: therapist.role,
      isVerified: therapist.isVerified,
      isActive: therapist.isActive,
      profileImage: therapist.profileImage,
      rating: therapist.rating,
      totalSessions: therapist.totalSessions,
      totalPatients: therapist.totalPatients
    };

    return NextResponse.json({
      message: 'Login successful',
      token
    });

  } catch (error: any) {
    console.error('Therapist login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 