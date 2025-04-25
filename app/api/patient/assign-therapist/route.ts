import { NextResponse } from 'next/server';
import { PatientService } from '@/services/patient/patientService';

const patientService = new PatientService();

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { patientId, therapistId } = body;

    if (!patientId || !therapistId) {
      return NextResponse.json(
        { error: 'Patient ID and Therapist ID are required' },
        { status: 400 }
      );
    }

    const updatedPatient = await patientService.assignTherapist(patientId, therapistId);
    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 