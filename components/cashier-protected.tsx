'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getCurrentUser, isAuthenticated, setRedirectUrl, isCashier } from '@/lib/auth';
import { User } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface CashierProtectedProps {
  children: React.ReactNode;
}

export default function CashierProtected({ children }: CashierProtectedProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          // Store current URL for redirect after login
          const currentUrl = window.location.href;
          setRedirectUrl(currentUrl);
          router.push('/login');
          return;
        }

        // Get current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Store current URL for redirect after login
          const currentUrl = window.location.href;
          setRedirectUrl(currentUrl);
          router.push('/login');
          return;
        }

        // Check if user is cashier or admin
        if (!isCashier(currentUser) && currentUser.role !== 'admin') {
          setError('Access denied. Cashier privileges required.');
          setLoading(false);
          return;
        }

        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-300">Checking cashier privileges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              Go Home
            </Button>
            <Button
              onClick={() => {
                // Store current URL for redirect after login
                const currentUrl = window.location.href;
                setRedirectUrl(currentUrl);
                router.push('/login');
              }}
              className="flex-1"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Cashier Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 