import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import { connectDB } from '@/lib/mongodb';

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
      'phone'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    // If this is not the first admin, require authorization
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admin registration is restricted. Please contact the super admin.' },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: body.email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new admin (first admin will be super_admin)
    const newAdmin = await Admin.create({
      name: body.name,
      email: body.email,
      password: body.password, // Note: In production, hash the password
      phoneCode: body.phoneCode,
      phone: body.phone,
      role: 'super_admin', // First admin is always super_admin
      permissions: [
        'manage_patients',
        'manage_therapists',
        'manage_packages',
        'manage_sessions',
        'manage_payments',
        'view_reports',
        'manage_admins'
      ],
      isVerified: true,
      isActive: true,
      isDeleted: false,
      profileImage: body.profileImage || undefined
    });

    // Remove sensitive data from response
    const adminResponse = {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      phoneCode: newAdmin.phoneCode,
      phone: newAdmin.phone,
      role: newAdmin.role,
      permissions: newAdmin.permissions,
      isVerified: newAdmin.isVerified,
      isActive: newAdmin.isActive
    };

    return NextResponse.json(
      {
        message: 'Super admin registered successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 