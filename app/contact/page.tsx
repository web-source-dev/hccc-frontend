import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            CONTACT US
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Get in touch with us for questions, feedback, or support
          </p>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-yellow-400" />
              <span>Call Us</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-yellow-400" />
              <span>Email Us</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <span>Visit Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Get In Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cedar Park Location */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">CEDAR PARK</h3>
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
                  <a href="mailto:cedarpark@hccc.online" className="hover:text-yellow-400 transition-colors">
                    cedarpark@hccc.online
                  </a>
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

            {/* Liberty Hill Location */}
            <div className="bg-[#222] rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">LIBERTY HILL</h3>
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
                  <a href="mailto:libertyhill@hccc.online" className="hover:text-yellow-400 transition-colors">
                    libertyhill@hccc.online
                  </a>
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

      {/* Contact Form */}
      <div className="py-20 bg-[#111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Send Us a Message</h2>
          
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
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your phone number (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="partnership">Partnership</option>
                  <option value="employment">Employment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Location</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select a location</option>
                  <option value="cedar-park">Cedar Park</option>
                  <option value="liberty-hill">Liberty Hill</option>
                  <option value="both">Both locations</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" required className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400" />
                  <span className="text-sm">
                    I agree to the privacy policy and terms of service.
                  </span>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">What are your operating hours?</h3>
              <p className="text-gray-300">
                Cedar Park: Monday - Sunday, 11 am - 3 am<br />
                Liberty Hill: Monday - Thursday 10 am - 11 pm, Friday - Saturday 10 am - midnight, Sunday 10 am - 11 pm
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Do you offer birthday specials?</h3>
              <p className="text-gray-300">
                Yes! We offer special birthday bonuses and promotions. Contact us or visit our promotions page for more details.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Can I host a private event?</h3>
              <p className="text-gray-300">
                Absolutely! We offer private event hosting for parties, corporate events, and special occasions. Contact us for availability and pricing.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept cash, credit cards, debit cards, and digital payments. We also offer online token purchases through our website.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Is there an age requirement?</h3>
              <p className="text-gray-300">
                Yes, all players must be 18 years or older to play our games and enter our facilities.
              </p>
            </div>
            
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Do you offer group discounts?</h3>
              <p className="text-gray-300">
                Yes! We offer special group rates and packages for parties and events. Contact us for more information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="py-20 bg-[#111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8">
            For urgent matters or technical issues, please call us directly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Cedar Park</h3>
              <a href="tel:5129867878" className="text-2xl font-bold hover:text-yellow-400 transition-colors">
                (512) 986-7878
              </a>
            </div>
            <div className="bg-[#222] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Liberty Hill</h3>
              <a href="tel:5125486505" className="text-2xl font-bold hover:text-yellow-400 transition-colors">
                (512) 548-6505
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Visit HCCC Gameroom?</h2>
          <p className="text-xl mb-8">
            We look forward to seeing you at one of our locations!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Browse Games
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#b80000] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 