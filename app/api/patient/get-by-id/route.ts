import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const patient = await Patient.findOne({ _id: id, isDeleted: false })
      .select('-password -__v');

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Patient fetched successfully',
      patient
    });
  } catch (error: any) {
    console.error('Fetch patient error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 