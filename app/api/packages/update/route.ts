import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
import { verifyAdminToken } from '@/middleware/adminAuth';

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { name, description, sessions, validity, price, features, isActive } = body;

    await connectDB();

    // Check if package exists
    const existingPackage = await Package.findOne({ _id: id, isDeleted: false });
    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with other packages
    if (name && name !== existingPackage.name) {
      const nameExists = await Package.findOne({ 
        _id: { $ne: id }, 
        name, 
        isDeleted: false 
      });
      if (nameExists) {
        return NextResponse.json(
          { error: 'Package with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(sessions && { sessions }),
          ...(validity && { validity }),
          ...(price && { price }),
          ...(features && { features }),
          ...(typeof isActive === 'boolean' && { isActive }),
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Package updated successfully',
      package: updatedPackage
    });
  } catch (error: any) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 