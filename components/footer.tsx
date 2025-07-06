import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-4">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        {/* Cedar Park Location */}
        <div>
          <h4 className="text-lg font-bold mb-2 text-yellow-400">CEDAR PARK</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 mt-1 text-yellow-400 flex-shrink-0" />
              <span>601 E Whitestone Blvd, Suite 304<br />Cedar Park, TX 78613</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-yellow-400" />
              <a href="tel:5129867878" className="hover:text-yellow-400 transition-colors">(512) 986-7878</a>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 mt-1 text-yellow-400 flex-shrink-0" />
              <span>Mon-Sun: 11 am - 3 am</span>
            </div>
          </div>
        </div>
        {/* Liberty Hill Location */}
        <div>
          <h4 className="text-lg font-bold mb-2 text-yellow-400">LIBERTY HILL</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 mt-1 text-yellow-400 flex-shrink-0" />
              <span>15399 TX-29 Unit B<br />Liberty Hill, TX 78642</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-yellow-400" />
              <a href="tel:5125486505" className="hover:text-yellow-400 transition-colors">(512) 548-6505</a>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 mt-1 text-yellow-400 flex-shrink-0" />
              <span>Mon-Thu: 10 am - 11 pm<br />Fri-Sat: 10 am - midnight<br />Sun: 10 am - 11 pm</span>
            </div>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-2 text-yellow-400">LINKS</h4>
          <nav className="space-y-1 text-sm">
            <Link href="/" className="hover:text-yellow-400 transition-colors block">Home</Link>
            <Link href="/about" className="hover:text-yellow-400 transition-colors block">About Us</Link>
            <Link href="/promotions" className="hover:text-yellow-400 transition-colors block">Digital Promotions</Link>
            <Link href="/contact" className="hover:text-yellow-400 transition-colors block">Contact Us</Link>
            <Link href="/jobs" className="hover:text-yellow-400 transition-colors block">Job Opportunities</Link>
            
          </nav>
        </div>
        {/* Social & Legal */}
        <div className="flex flex-col h-full justify-between">
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-white hover:text-yellow-400 transition-colors"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors"><Facebook className="w-6 h-6" /></a>
          </div>
          <div className="text-xs text-gray-300 space-y-2 mt-4">
            <p>“No purchase necessary. Void where prohibited. Must be 18 or older. Tokens have no cash value.”</p>
            <p>For full sweepstakes service, <a href="#" className="text-yellow-400 hover:underline">click here</a>.</p>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-4 mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} HCCC Gameroom. All rights reserved.
      </div>
    </footer>
  );
} 