import { NextResponse } from 'next/server';
import { SessionService } from '@/services/session/sessionService';

const sessionService = new SessionService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await sessionService.getSessionById(params.id);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 