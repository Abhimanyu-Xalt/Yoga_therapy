import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
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

    // Find admin by email
    const admin = await Admin.findOne({ 
      email: body.email,
      isDeleted: false 
    }).select('+password').exec();

    // Check if admin exists
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact super admin.' },
        { status: 403 }
      );
    }

    // In a real application, you would hash the password and compare with the hashed version
    // For now, we're doing a direct comparison
    if (admin.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data from response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
      lastLogin: new Date()
    };

    return NextResponse.json({
      message: 'Login successful',
      token
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 