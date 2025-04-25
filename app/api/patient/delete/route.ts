import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { verifyAdminToken } from '@/middleware/adminAuth';

export async function DELETE(request: Request) {
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

    // Check if patient exists
    const existingPatient = await Patient.findOne({ _id: id, isDeleted: false });
    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Soft delete patient
    await Patient.findByIdAndUpdate(id, { isDeleted: true });

    return NextResponse.json({
      message: 'Patient deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 