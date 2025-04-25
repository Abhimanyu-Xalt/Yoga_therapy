import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Therapist from '@/models/Therapist';
import { verifyAdminToken } from '@/middleware/adminAuth';

export async function GET(request: Request) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken();
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const therapist = await Therapist.findOne({ _id: id, isDeleted: false })
      .select('-password -__v');

    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Therapist fetched successfully',
      therapist
    });
  } catch (error: any) {
    console.error('Fetch therapist error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 