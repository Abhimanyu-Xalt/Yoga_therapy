import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
import { verifyAdminToken } from '@/middleware/adminAuth';

export async function POST(request: Request) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken();
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, sessions, validity, price, features } = body;

    // Validate required fields
    if (!name || !description || !sessions || !validity || !price || !features) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if package with same name exists
    const existingPackage = await Package.findOne({ name, isDeleted: false });
    if (existingPackage) {
      return NextResponse.json(
        { error: 'Package with this name already exists' },
        { status: 400 }
      );
    }

    const newPackage = await Package.create({
      name,
      description,
      sessions,
      validity,
      price,
      features
    });

    return NextResponse.json({
      message: 'Package created successfully',
      package: newPackage
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 