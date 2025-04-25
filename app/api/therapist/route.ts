import { NextResponse } from 'next/server';
import { TherapistService } from '@/services/therapist/therapistService';

const therapistService = new TherapistService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const experience = searchParams.get('experience');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const therapists = await therapistService.getAllTherapists({
      specialization: specialization || undefined,
      experience: experience ? parseInt(experience) : undefined,
      status: status || undefined,
      search: search || undefined,
    });

    return NextResponse.json(therapists, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }

    const updatedTherapist = await therapistService.updateTherapist(id, updateData);
    return NextResponse.json(updatedTherapist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }

    await therapistService.deleteTherapist(id);
    return NextResponse.json({ message: 'Therapist deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 