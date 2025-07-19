'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, Package, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logoutUser, createLoginUrl, createSignupUrl, useAuth, isAdmin, isCashier } from '@/lib/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading } = useAuth(); // Use the new useAuth hook

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getUserInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getFullName = (firstname: string, lastname: string) => {
    return `${firstname} ${lastname}`;
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
              <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-white/10">
                    <Avatar className="w-8 h-8 border-2 border-white/20">
                      <AvatarImage src="/placeholder-user.jpg" alt={getFullName(user.firstname, user.lastname)} />
                      <AvatarFallback className="bg-yellow-400 text-black text-sm font-semibold">
                        {getUserInitials(user.firstname, user.lastname)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{getFullName(user.firstname, user.lastname)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=tokens" className="flex items-center space-x-2 cursor-pointer">
                      <Package className="w-4 h-4" />
                      <span>My Tokens</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin(user) && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center space-x-2 cursor-pointer">
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isCashier(user) && (
                    <DropdownMenuItem asChild>
                      <Link href="/cashier" className="flex items-center space-x-2 cursor-pointer">
                        <CreditCard className="w-4 h-4" />
                        <span>Cashier Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 cursor-pointer text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={createLoginUrl(window.location.href)}>
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-[#b80000]">
                    Log In
                  </Button>
                </Link>
                <Link href={createSignupUrl(window.location.href)}>
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
                    <div className="px-4 py-2 flex items-center space-x-3">
                      <Avatar className="w-8 h-8 border-2 border-white/20">
                        <AvatarImage src="/placeholder-user.jpg" alt={getFullName(user.firstname, user.lastname)} />
                        <AvatarFallback className="bg-yellow-400 text-black text-xs font-semibold">
                          {getUserInitials(user.firstname, user.lastname)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{getFullName(user.firstname, user.lastname)}</span>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 mr-2 inline" /> Profile
                    </Link>
                    
                    <Link 
                      href="/profile?tab=tokens" 
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2 inline" /> My Tokens
                    </Link>
                    
                    {isAdmin(user) && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2 inline" /> Admin Dashboard
                      </Link>
                    )}
                    {isCashier(user) && (
                      <Link 
                        href="/cashier" 
                        className="block px-4 py-2 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <CreditCard className="w-4 h-4 mr-2 inline" /> Cashier Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href={createLoginUrl(window.location.href)} 
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      href={createSignupUrl(window.location.href)} 
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