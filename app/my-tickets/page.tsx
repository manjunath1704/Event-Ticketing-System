'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { Ticket } from '@/types';
import TicketCard from '@/components/TicketCard';

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        const ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', user.id)
        );
        const ticketsSnapshot = await getDocs(ticketsQuery);
        const ticketsData = ticketsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ticket[];
        
        setTickets(ticketsData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-center text-gray-600">You haven't purchased any tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
