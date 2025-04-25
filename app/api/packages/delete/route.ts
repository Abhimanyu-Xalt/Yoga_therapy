import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
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
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Soft delete the package
    const deletedPackage = await Package.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          isActive: false,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!deletedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Package deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 