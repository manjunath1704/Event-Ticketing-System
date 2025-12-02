import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { eventId, amount } = await request.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `ticket_${eventId}_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
