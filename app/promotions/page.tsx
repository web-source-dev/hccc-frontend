"use client"

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Gift, Star, Percent } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicEvents, type Event } from '@/lib/events';

export default function PromotionsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getPublicEvents();
        setEvents(response);
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            PROMOTIONS & SPECIALS
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Discover amazing deals and exclusive offers at HCCC Gameroom
          </p>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center space-x-2">
              <Gift className="w-6 h-6 text-yellow-400" />
              <span>Daily Specials</span>
            </div>
            <div className="flex items-center space-x-2">
              <Percent className="w-6 h-6 text-yellow-400" />
              <span>Member Discounts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span>VIP Rewards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spin Win Repeat Section */}
      <div className="bg-black py-16">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <Image
            src="/image.png"
            alt="Slot machines"
            className="w-full max-w-3xl rounded-lg shadow-lg mb-10 object-cover"
            style={{ aspectRatio: '3/1', objectFit: 'cover' }}
            width={1200}
            height={400}
          />
          <h2 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-6 tracking-tight" style={{ letterSpacing: '-0.04em' }}>
            SPIN. WIN. REPEAT.
          </h2>
          <h3 className="text-xl md:text-2xl font-medium text-white text-center mb-4">
            Welcome to the HCCC Promotions
          </h3>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl mx-auto">
            You&apos;ve landed in the right spot to catch all the latest promos, daily deals, and special events happening at HCCC Gameroom. From surprise scratch-offs to epic giveaways—you never know what kind of fun is waiting. Stay in the loop and follow us on Facebook & Instagram so you never miss a chance to Spin. Win. Repeat.
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Upcoming Events</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Error loading events. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
              >
                Try Again
              </button>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => (
                <div key={event._id} className="bg-[#222] rounded-2xl p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{formatDate(event.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.image && (
                    <div className="mt-4">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No upcoming events at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new events and promotions!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Don&apos;t Miss Out on These Amazing Deals!</h2>
          <p className="text-xl mb-8">
            Visit us today and take advantage of our current promotions. New offers added regularly!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Browse Games
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#b80000] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 