import { MapPin, Phone, Clock, Users, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            ABOUT HCCC GAMEROOM
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Your premier gaming destination in Central Texas
          </p>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>Est. 2020</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-yellow-400" />
              <span>10,000+ Happy Players</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-yellow-400">Our Mission</h2>
              <p className="text-lg mb-6 leading-relaxed">
                At HCCC Gameroom, we&apos;re passionate about providing an exceptional gaming experience 
                that brings people together. Our mission is to create a welcoming, exciting, and 
                safe environment where players can enjoy the thrill of gaming while building 
                lasting friendships and memories.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                We believe in responsible gaming and are committed to maintaining the highest 
                standards of service, security, and entertainment for our valued customers.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">2</div>
                  <div className="text-sm">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">50+</div>
                  <div className="text-sm">Games Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                  <div className="text-sm">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                  <div className="text-sm">Secure Gaming</div>
                </div>
              </div>
            </div>
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Why Choose HCCC?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Premium Gaming Experience</h4>
                    <p className="text-gray-300">State-of-the-art equipment and the latest games in a comfortable, modern environment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Convenient Locations</h4>
                    <p className="text-gray-300">Two strategic locations in Cedar Park and Liberty Hill, easily accessible from anywhere in Central Texas.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Responsible Gaming</h4>
                    <p className="text-gray-300">We promote responsible gaming practices and provide support for players who need it.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Community Focus</h4>
                    <p className="text-gray-300">We&apos;re proud to be part of the local community and support various charitable initiatives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cedar Park */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">CEDAR PARK</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">601 E Whitestone Blvd, Suite 304</p>
                    <p className="text-gray-300">Cedar Park, TX 78613</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <Link href="tel:5129867878" className="hover:text-yellow-400 transition-colors">
                    (512) 986-7878
                  </Link>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Hours:</p>
                    <p className="text-gray-300">Monday - Sunday: 11 am - 3 am</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liberty Hill */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">LIBERTY HILL</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">15399 TX-29 Unit B</p>
                    <p className="text-gray-300">Liberty Hill, TX 78642</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <Link href="tel:5125486505" className="hover:text-yellow-400 transition-colors">
                    (512) 548-6505
                  </Link>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Hours:</p>
                    <p className="text-gray-300">Monday - Thursday: 10 am - 11 pm</p>
                    <p className="text-gray-300">Friday - Saturday: 10 am - midnight</p>
                    <p className="text-gray-300">Sunday: 10 am - 11 pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-300">
                We strive for excellence in everything we do, from customer service to game selection and facility maintenance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <p className="text-gray-300">
                We&apos;re committed to building and supporting our local community through various initiatives and partnerships.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p className="text-gray-300">
                We operate with the highest standards of integrity, transparency, and responsible gaming practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience HCCC Gameroom?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied players and discover why we&apos;re Central Texas&apos;s premier gaming destination.
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