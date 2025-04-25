import { NextResponse } from 'next/server';
import { PatientService } from '@/services/patient/patientService';

const patientService = new PatientService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const therapistId = searchParams.get('therapistId');
    const search = searchParams.get('search');

    const patients = await patientService.getAllPatients({
      status: status || undefined,
      therapistId: therapistId || undefined,
      search: search || undefined,
    });

    return NextResponse.json(patients, { status: 200 });
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const updatedPatient = await patientService.updatePatient(id, updateData);
    return NextResponse.json(updatedPatient, { status: 200 });
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    await patientService.deletePatient(id);
    return NextResponse.json({ message: 'Patient deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 