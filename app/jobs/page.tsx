import { Calendar, Clock, MapPin, Users, Briefcase, Star, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            CAREER OPPORTUNITIES
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Join our team and be part of Central Texas&apos;s premier gaming destination
          </p>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-yellow-400" />
              <span>Great Benefits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-yellow-400" />
              <span>Team Environment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span>Growth Opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Why Work With Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Competitive Pay</h3>
              <p className="text-gray-300">
                We offer competitive wages with opportunities for raises and bonuses based on performance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Great Team</h3>
              <p className="text-gray-300">
                Join a fun, energetic team that loves gaming and providing excellent customer service.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Flexible Hours</h3>
              <p className="text-gray-300">
                We offer flexible scheduling to accommodate your lifestyle and other commitments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Two Locations</h3>
              <p className="text-gray-300">
                Work at either our Cedar Park or Liberty Hill location, whichever is more convenient for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Openings */}
      <div className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Current Openings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Game Attendant */}
            <div className="bg-[#222] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Game Attendant</h3>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Hiring</span>
              </div>
              <p className="text-gray-300 mb-6">
                Help customers enjoy their gaming experience by providing excellent service, 
                maintaining equipment, and ensuring a safe, fun environment.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Both locations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Part-time & Full-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Entry level</span>
                </div>
              </div>
              <h4 className="font-semibold mb-3 text-yellow-400">Requirements:</h4>
              <ul className="text-gray-300 text-sm space-y-1 mb-6">
                <li>• Must be 18 years or older</li>
                <li>• Customer service experience preferred</li>
                <li>• Gaming knowledge a plus</li>
                <li>• Reliable transportation</li>
                <li>• Flexible schedule availability</li>
              </ul>
              <Link 
                href="#apply" 
                className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Cashier */}
            <div className="bg-[#222] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Cashier</h3>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Hiring</span>
              </div>
              <p className="text-gray-300 mb-6">
                Handle customer transactions, manage token sales, and provide excellent 
                customer service while maintaining accurate records.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Both locations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Part-time & Full-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Entry level</span>
                </div>
              </div>
              <h4 className="font-semibold mb-3 text-yellow-400">Requirements:</h4>
              <ul className="text-gray-300 text-sm space-y-1 mb-6">
                <li>• Must be 18 years or older</li>
                <li>• Cash handling experience preferred</li>
                <li>• Basic math skills</li>
                <li>• Attention to detail</li>
                <li>• Excellent customer service skills</li>
              </ul>
              <Link 
                href="#apply" 
                className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Manager */}
            <div className="bg-[#222] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Assistant Manager</h3>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">Limited</span>
              </div>
              <p className="text-gray-300 mb-6">
                Help manage daily operations, supervise staff, and ensure excellent 
                customer service while maintaining facility standards.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Liberty Hill location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Full-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Management experience</span>
                </div>
              </div>
              <h4 className="font-semibold mb-3 text-yellow-400">Requirements:</h4>
              <ul className="text-gray-300 text-sm space-y-1 mb-6">
                <li>• Must be 21 years or older</li>
                <li>• 2+ years management experience</li>
                <li>• Gaming industry experience preferred</li>
                <li>• Strong leadership skills</li>
                <li>• Available for evening and weekend shifts</li>
              </ul>
              <Link 
                href="#apply" 
                className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Maintenance Technician */}
            <div className="bg-[#222] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Maintenance Technician</h3>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">As Needed</span>
              </div>
              <p className="text-gray-300 mb-6">
                Maintain and repair gaming equipment, ensure facility cleanliness, 
                and perform general maintenance tasks as needed.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Both locations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Part-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Technical skills</span>
                </div>
              </div>
              <h4 className="font-semibold mb-3 text-yellow-400">Requirements:</h4>
              <ul className="text-gray-300 text-sm space-y-1 mb-6">
                <li>• Must be 18 years or older</li>
                <li>• Basic technical skills</li>
                <li>• Equipment maintenance experience</li>
                <li>• Reliable and detail-oriented</li>
                <li>• Flexible schedule</li>
              </ul>
              <Link 
                href="#apply" 
                className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Employee Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-2xl">$</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Competitive Pay</h3>
              <p className="text-gray-300">
                Starting wages above minimum wage with regular performance reviews and raises.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Flexible Scheduling</h3>
              <p className="text-gray-300">
                Work around your schedule with flexible hours and shift options.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Employee Discounts</h3>
              <p className="text-gray-300">
                Enjoy discounts on tokens and special employee-only promotions.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Team Environment</h3>
              <p className="text-gray-300">
                Work with a fun, supportive team in a positive work environment.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Growth Opportunities</h3>
              <p className="text-gray-300">
                Advance your career with opportunities for promotion and skill development.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">Paid Time Off</h3>
              <p className="text-gray-300">
                Full-time employees receive paid time off and holiday pay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-20 bg-[#111]" id="apply">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Apply Now</h2>
          
          <div className="bg-[#222] rounded-2xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Position Applied For *</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select a position</option>
                  <option value="game-attendant">Game Attendant</option>
                  <option value="cashier">Cashier</option>
                  <option value="assistant-manager">Assistant Manager</option>
                  <option value="maintenance-technician">Maintenance Technician</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Location *</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select a location</option>
                  <option value="cedar-park">Cedar Park</option>
                  <option value="liberty-hill">Liberty Hill</option>
                  <option value="both">Both locations</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Availability *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                    <span className="text-sm">Morning</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                    <span className="text-sm">Afternoon</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                    <span className="text-sm">Evening</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                    <span className="text-sm">Weekends</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Experience & Skills</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Tell us about your relevant experience and skills..."
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" required className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  <span className="text-sm">
                    I confirm that I am at least 18 years of age and authorized to work in the United States.
                  </span>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Cedar Park Location</h3>
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
                  <a href="tel:5129867878" className="hover:text-yellow-400 transition-colors">
                    (512) 986-7878
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <a href="mailto:jobs@hccc.online" className="hover:text-yellow-400 transition-colors">
                    jobs@hccc.online
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Liberty Hill Location</h3>
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
                  <a href="tel:5125486505" className="hover:text-yellow-400 transition-colors">
                    (512) 548-6505
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <a href="mailto:jobs@hccc.online" className="hover:text-yellow-400 transition-colors">
                    jobs@hccc.online
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl mb-8">
            Apply today and become part of the HCCC Gameroom family!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#apply" 
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Apply Now
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