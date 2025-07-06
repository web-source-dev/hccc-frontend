import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-[#b80000] leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-400">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p className="text-lg text-gray-400">
            Don&apos;t worry, you can still find your way back to the fun!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/" 
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-[#222] rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 text-yellow-400">Popular Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/about" 
              className="block p-4 bg-[#333] rounded-lg hover:bg-[#444] transition-colors"
            >
              <h4 className="font-semibold mb-2">About Us</h4>
              <p className="text-sm text-gray-300">Learn about HCCC Gameroom</p>
            </Link>
            <Link 
              href="/promotions" 
              className="block p-4 bg-[#333] rounded-lg hover:bg-[#444] transition-colors"
            >
              <h4 className="font-semibold mb-2">Promotions</h4>
              <p className="text-sm text-gray-300">Check out our latest deals</p>
            </Link>
            <Link 
              href="/events" 
              className="block p-4 bg-[#333] rounded-lg hover:bg-[#444] transition-colors"
            >
              <h4 className="font-semibold mb-2">Events</h4>
              <p className="text-sm text-gray-300">See what&apos;s happening</p>
            </Link>
            <Link 
              href="/contact" 
              className="block p-4 bg-[#333] rounded-lg hover:bg-[#444] transition-colors"
            >
              <h4 className="font-semibold mb-2">Contact Us</h4>
              <p className="text-sm text-gray-300">Get in touch with us</p>
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#b80000] to-[#8b0000] rounded-2xl">
          <p className="text-lg font-semibold mb-2">
            🎮 Ready to Play? 🎮
          </p>
          <p className="text-sm opacity-90">
            While you&apos;re here, why not check out our amazing games and promotions?
          </p>
        </div>
      </div>
    </div>
  );
} 