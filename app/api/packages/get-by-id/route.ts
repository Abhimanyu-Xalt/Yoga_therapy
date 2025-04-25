import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const package_ = await Package.findOne({ _id: id, isDeleted: false });

    if (!package_) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Package fetched successfully',
      package: package_
    });
  } catch (error: any) {
    console.error('Fetch package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 