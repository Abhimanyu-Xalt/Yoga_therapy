import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // TODO: Implement actual registration logic
    // This is a mock response
    return NextResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 