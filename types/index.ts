export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  isAdmin?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  enteredCount: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  paymentId: string;
  qrCode: string;
  isUsed: boolean;
  purchaseDate: string;
  entryTime?: string;
}

export interface Payment {
  id: string;
  ticketId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
}
