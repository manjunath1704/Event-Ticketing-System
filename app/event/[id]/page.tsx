'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { loadRazorpayScript } from '@/lib/razorpay';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;
      
      try {
        const eventDoc = doc(db, 'events', params.id as string);
        const eventSnap = await getDoc(eventDoc);
        
        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() } as Event);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleBookTicket = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!event) return;

    try {
      await loadRazorpayScript();
      
      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          amount: event.price,
        }),
      });

      const { orderId } = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: event.price * 100,
        currency: 'INR',
        name: 'EventTickets',
        description: `Ticket for ${event.title}`,
        order_id: orderId,
        handler: async (response: any) => {
          // Verify payment and create ticket
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event.id,
              userId: user.id,
            }),
          });

          if (verifyResponse.ok) {
            router.push('/my-tickets');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center py-8">Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-6">{event.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-medium">Date</p>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium">Venue</p>
            <p className="text-gray-600">{event.venue}</p>
          </div>
          <div>
            <p className="font-medium">Price</p>
            <p className="text-gray-600">₹{event.price}</p>
          </div>
          <div>
            <p className="font-medium">Available Tickets</p>
            <p className="text-gray-600">{event.totalTickets - event.soldTickets}</p>
          </div>
        </div>

        <button
          onClick={handleBookTicket}
          disabled={event.soldTickets >= event.totalTickets}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {event.soldTickets >= event.totalTickets ? 'Sold Out' : 'Book Ticket'}
        </button>
      </div>
    </div>
  );
}
