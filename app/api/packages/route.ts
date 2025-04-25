import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
import { verifyAdminToken } from '@/middleware/adminAuth';

// Validation function for package data
const validatePackageData = (data: any) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters long');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (!data.sessions || typeof data.sessions !== 'number' || data.sessions < 1) {
    errors.push('Sessions must be a positive number');
  }

  if (!data.validity || typeof data.validity !== 'number' || data.validity < 1) {
    errors.push('Validity (in days) must be a positive number');
  }

  if (!data.price || typeof data.price !== 'number' || data.price < 0) {
    errors.push('Price must be a non-negative number');
  }

  if (!Array.isArray(data.features) || data.features.length === 0) {
    errors.push('Features must be a non-empty array');
  }

  return errors;
};

// GET - Public route to fetch all packages or a single package by ID
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, return specific package
    if (id) {
      const packageData = await Package.findOne({ _id: id, isDeleted: false })
        .select('-isDeleted -__v');

      if (!packageData) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(packageData);
    }

    // If no ID, return all packages
    const packages = await Package.find({ isDeleted: false })
      .select('-isDeleted -__v')
      .sort({ price: 1 });

    return NextResponse.json(packages);
  } catch (error: any) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new package (Admin only)
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

    await connectDB();
    const body = await request.json();

    // Validate package data
    const validationErrors = validatePackageData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Check if package name already exists
    const existingPackage = await Package.findOne({ name: body.name, isDeleted: false });
    if (existingPackage) {
      return NextResponse.json(
        { error: 'Package with this name already exists' },
        { status: 400 }
      );
    }

    // Create new package
    const newPackage = await Package.create({
      name: body.name,
      description: body.description,
      sessions: body.sessions,
      validity: body.validity,
      price: body.price,
      features: body.features,
      isActive: body.isActive ?? true,
      isDeleted: false
    });

    return NextResponse.json(
      {
        message: 'Package created successfully',
        package: newPackage
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update package (Admin only)
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

    await connectDB();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Validate package data
    const validationErrors = validatePackageData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Check if package exists
    const existingPackage = await Package.findOne({ _id: body.id, isDeleted: false });
    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with other packages
    const nameConflict = await Package.findOne({
      _id: { $ne: body.id },
      name: body.name,
      isDeleted: false
    });
    if (nameConflict) {
      return NextResponse.json(
        { error: 'Package with this name already exists' },
        { status: 400 }
      );
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        description: body.description,
        sessions: body.sessions,
        validity: body.validity,
        price: body.price,
        features: body.features,
        isActive: body.isActive ?? existingPackage.isActive
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

// DELETE - Soft delete package (Admin only)
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

    // Check if package exists
    const existingPackage = await Package.findOne({ _id: id, isDeleted: false });
    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Soft delete package
    await Package.findByIdAndUpdate(id, { isDeleted: true });

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