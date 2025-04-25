import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
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

    const patients = await Patient.find({ isDeleted: false })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: 'Patients fetched successfully',
      patients,
      total: patients.length
    });
  } catch (error: any) {
    console.error('Fetch patients error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 