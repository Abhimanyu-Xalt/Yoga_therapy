import { NextResponse } from 'next/server';
import { SessionService } from '@/services/session/sessionService';

const sessionService = new SessionService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedback = await sessionService.addFeedback(body);
    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sessionId = searchParams.get('sessionId');
    const therapistId = searchParams.get('therapistId');

    let feedback;
    if (type === 'platform') {
      feedback = await sessionService.getPlatformFeedback();
    } else if (sessionId) {
      feedback = await sessionService.getSessionFeedback(sessionId);
    } else if (therapistId) {
      feedback = await sessionService.getTherapistFeedback(therapistId);
    } else {
      return NextResponse.json(
        { error: 'Invalid feedback request' },
        { status: 400 }
      );
    }

    return NextResponse.json(feedback, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 