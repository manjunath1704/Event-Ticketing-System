'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ticket, Event } from '@/types';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = doc(db, 'events', ticket.eventId);
      const eventSnap = await getDoc(eventDoc);
      if (eventSnap.exists()) {
        setEvent({ id: eventSnap.id, ...eventSnap.data() } as Event);
      }
    };

    fetchEvent();
  }, [ticket.eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <p className="text-gray-600">{event.venue}</p>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          ticket.isUsed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {ticket.isUsed ? 'Used' : 'Valid'}
        </div>
      </div>

      <div className="text-center">
        <img
          src={ticket.qrCode}
          alt="QR Code"
          className="mx-auto w-48 h-48 mb-4"
        />
        <p className="text-xs text-gray-500">Ticket ID: {ticket.id}</p>
      </div>
    </div>
  );
}
