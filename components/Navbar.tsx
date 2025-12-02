'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            EventTickets
          </Link>
          <div className="space-x-4">
            {user ? (
              <>
                <Link href="/my-tickets" className="hover:underline">
                  My Tickets
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="hover:underline">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
