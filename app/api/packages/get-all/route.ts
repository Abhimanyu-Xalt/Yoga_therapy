import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
  try {
    await connectDB();

    const packages = await Package.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: 'Packages fetched successfully',
      packages
    });
  } catch (error: any) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 