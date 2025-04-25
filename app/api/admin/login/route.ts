import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/validators/auth';
import { comparePassword, generateJWT } from '@/utils/auth';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { AuthService } from '@/services/auth/authService';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find admin
    const admin = await Admin.findOne({ 
      email: validatedData.email,
      isDeleted: false
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(validatedData.password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateJWT({
      id: admin._id,
      email: admin.email,
      role: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: 'admin'
        }
      }
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    
    if (error.errors) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST_AuthService(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authService.adminLogin(email, password);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 