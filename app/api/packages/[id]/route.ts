import { NextResponse } from 'next/server';
import { PackageService } from '@/services/package/packageService';

const packageService = new PackageService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const package_ = await packageService.getPackageById(params.id);
    
    if (!package_) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(package_, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 