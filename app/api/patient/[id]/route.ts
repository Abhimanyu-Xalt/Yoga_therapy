import { NextResponse } from 'next/server';
import { PatientService } from '@/services/patient/patientService';

const patientService = new PatientService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await patientService.getPatientById(params.id);
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 