import { NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment/paymentService';

const paymentService = new PaymentService();

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const invoice = await paymentService.generateInvoice(params.sessionId);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Could not generate invoice' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 