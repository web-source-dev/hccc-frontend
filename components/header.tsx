'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logoutUser, type User } from '@/lib/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#b80000] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <div className="text-2xl font-bold tracking-wider">HCCC GAMEROOM</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto mr-12">
            <Link href="/" className="hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-yellow-300 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-yellow-300 transition-colors">
              Contact Us
            </Link>
            <Link href="/promotions" className="hover:text-yellow-300 transition-colors">
              Promotions
            </Link>

            <Link href="/sweepstakes" className="hover:text-yellow-300 transition-colors">
              Sweepstakes
            </Link>
            <Link href="/jobs" className="hover:text-yellow-300 transition-colors">
              Jobs
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">{user.username}</span>
                </Link>
               
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white hover:bg-white hover:text-[#b80000]"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-[#b80000]">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-yellow-400 text-black hover:bg-yellow-300">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <nav className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/promotions"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Promotions
              </Link>
              <Link
                href="/events"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/sweepstakes"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sweepstakes
              </Link>
              <Link
                href="/jobs"
                className="block px-4 py-2 hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-white/20 pt-4 mt-4">
                {loading ? (
                  <div className="px-4 py-2 text-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <Link href="/profile" className="flex items-center space-x-2 px-4 py-2">
                      <UserIcon className="w-4 h-4" />
                      <span className="text-sm">{user.username}</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white"
                    >
                      <LogOut className="w-4 h-4 mr-1 inline" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login" 
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 