import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Therapist from '@/models/Therapist';
import { verifyAdminToken } from '@/middleware/adminAuth';

export async function GET() {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken();
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();

    const therapists = await Therapist.find({ isDeleted: false })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: 'Therapists fetched successfully',
      therapists,
      total: therapists.length
    });
  } catch (error: any) {
    console.error('Fetch therapists error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 