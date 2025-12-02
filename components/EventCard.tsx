import Link from 'next/link';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const availableTickets = event.totalTickets - event.soldTickets;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <p className="text-gray-600 mb-3">{event.description}</p>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
        <p><span className="font-medium">Venue:</span> {event.venue}</p>
        <p><span className="font-medium">Price:</span> ₹{event.price}</p>
        <p><span className="font-medium">Available:</span> {availableTickets} tickets</p>
      </div>
      <Link
        href={`/event/${event.id}`}
        className={`block text-center py-2 px-4 rounded ${
          availableTickets > 0
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
      </Link>
    </div>
  );
}
