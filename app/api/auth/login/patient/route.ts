import { NextResponse } from 'next/server';
import Patient from '@/models/Patient';
import { connectDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // Log the raw request body for debugging
    const rawText = await request.text();
    console.log('Raw request body:', rawText);
    
    let body;
    try {
      body = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON format. Please ensure your request body is proper JSON.',
        receivedData: rawText
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find patient by email
    const patient = await Patient.findOne({ 
      email: body.email,
      isDeleted: false 
    }).select('+password').exec();

    // Check if patient exists
    if (!patient) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if patient is active
    if (!patient.isActive) {
      return NextResponse.json(
        { error: 'Your account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // In a real application, you would hash the password and compare with the hashed version
    // For now, we're doing a direct comparison
    if (patient.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: patient._id,
        email: patient.email,
        role: 'patient'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data from response
    const patientResponse = {
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phoneCode: patient.phoneCode,
      phone: patient.phone,
      bloodGroup: patient.bloodGroup,
      emergencyContactPhone: patient.emergencyContactPhone,
      emergencyContactRelation: patient.emergencyContactRelation,
      role: patient.role,
      isVerified: patient.isVerified,
      isActive: patient.isActive,
      profileImage: patient.profileImage
    };

    return NextResponse.json({
      message: 'Login successful',
    //   patient: patientResponse,
      token
    });

  } catch (error: any) {
    console.error('Patient login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 