import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { doc, updateDoc, addDoc, collection, getDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateQRCode } from '@/lib/qr';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      userId,
    } = await request.json();

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Create ticket
    const ticketsCollection = collection(db, 'tickets');
    const ticketDoc = await addDoc(ticketsCollection, {
      eventId,
      userId,
      paymentId: razorpay_payment_id,
      isUsed: false,
      purchaseDate: new Date().toISOString(),
      qrCode: '', // Will be updated below
    });

    // Generate QR code
    const qrCode = await generateQRCode(ticketDoc.id);
    await updateDoc(ticketDoc, { qrCode });

    // Update event sold tickets count
    const eventDoc = doc(db, 'events', eventId);
    await updateDoc(eventDoc, {
      soldTickets: increment(1),
    });

    return NextResponse.json({ success: true, ticketId: ticketDoc.id });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
