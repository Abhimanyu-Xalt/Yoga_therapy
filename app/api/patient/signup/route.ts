import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, age, gender } = body;

    if (!name || !email || !password || !phone || !age || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await authService.patientSignup({
      name,
      email,
      password,
      phone,
      age,
      gender,
      medicalHistory: [],
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 