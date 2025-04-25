import { NextResponse } from 'next/server';
import { TherapistService } from '@/services/therapist/therapistService';

const therapistService = new TherapistService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const therapist = await therapistService.getTherapistById(params.id);
    
    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(therapist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 