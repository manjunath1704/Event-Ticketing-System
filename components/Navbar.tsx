'use client';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const { theme, toggle } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            EventTickets
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/my-tickets" className="hover:underline">
              My Tickets
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">Welcome, {user.name}!</span>
                    <Button 
                      onClick={toggle}
                      variant="ghost"
                      className="text-white border-white/30"
                    >
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </Button>
                    <Button 
                      onClick={handleSignOut}
                      variant="outline"
                      className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-blue-800 hover:bg-blue-900">
                        Sign Up
                      </Button>
                    </Link>
                    <Button onClick={toggle} variant="ghost" className="text-white border-white/30">
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
