'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { getCurrentUser, isAuthenticated, setRedirectUrl } from '@/lib/auth';
import { User } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
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

        // Check if user is admin
        if (currentUser.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
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
          <p className="text-gray-300">Checking admin privileges...</p>
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
      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Welcome, {user.username}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/')}
            >
              Exit Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 