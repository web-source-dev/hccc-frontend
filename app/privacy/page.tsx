import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            How we collect, use, and protect your information
          </p>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Introduction</h2>
              <p className="text-gray-300 mb-4">
                HCCC Gameroom (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or visit our physical locations.
              </p>
              <p className="text-gray-300">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Information We Collect</h2>
              
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Personal Information</h3>
              <p className="text-gray-300 mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li>• Name and contact information (email, phone number, address)</li>
                <li>• Date of birth and age verification</li>
                <li>• Payment information and transaction history</li>
                <li>• Account credentials and preferences</li>
                <li>• Communications with us (emails, phone calls, feedback)</li>
                <li>• Employment information (for job applications)</li>
              </ul>

              <h3 className="text-xl font-bold mb-4 text-yellow-400">Automatically Collected Information</h3>
              <p className="text-gray-300 mb-4">
                When you visit our website or use our services, we may automatically collect:
              </p>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li>• Device information (IP address, browser type, operating system)</li>
                <li>• Usage data (pages visited, time spent, links clicked)</li>
                <li>• Location data (general location based on IP address)</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-bold mb-4 text-yellow-400">Gaming Activity</h3>
              <p className="text-gray-300 mb-4">
                We may collect information about your gaming activities, including:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Games played and scores achieved</li>
                <li>• Token purchases and usage</li>
                <li>• Rewards and prizes won</li>
                <li>• Time spent gaming</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Providing and improving our gaming services</li>
                <li>• Processing transactions and payments</li>
                <li>• Verifying age and identity requirements</li>
                <li>• Sending promotional offers and updates (with your consent)</li>
                <li>• Responding to your inquiries and support requests</li>
                <li>• Analyzing usage patterns to improve our services</li>
                <li>• Complying with legal obligations</li>
                <li>• Preventing fraud and ensuring security</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Information Sharing and Disclosure</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our business</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li>• <strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Encryption of sensitive data</li>
                <li>• Secure servers and networks</li>
                <li>• Regular security assessments</li>
                <li>• Employee training on data protection</li>
                <li>• Access controls and authentication</li>
              </ul>
              <p className="text-gray-300 mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
              </p>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Provide personalized content and advertisements</li>
                <li>• Improve website functionality and performance</li>
              </ul>
              <p className="text-gray-300">
                You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Your Rights and Choices</h2>
              <p className="text-gray-300 mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Access:</strong> Request access to your personal information</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                <li>• <strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li>• <strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="text-gray-300 mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Children&apos;s Privacy</h2>
              <p className="text-gray-300">
                Our services are intended for individuals 18 years of age and older. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Third-Party Links</h2>
              <p className="text-gray-300">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Changes to This Privacy Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> privacy@hccc.online</p>
                <p><strong>Phone:</strong> (512) 986-7878 (Cedar Park) or (512) 548-6505 (Liberty Hill)</p>
                <p><strong>Address:</strong> 601 E Whitestone Blvd, Suite 304, Cedar Park, TX 78613</p>
              </div>
            </div>

            <div className="bg-[#222] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Legal Basis for Processing (EU Users)</h2>
              <p className="text-gray-300 mb-4">
                If you are located in the European Union, our legal basis for processing your personal information includes:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Consent:</strong> When you have given clear consent for specific processing</li>
                <li>• <strong>Contract:</strong> When processing is necessary for the performance of a contract</li>
                <li>• <strong>Legitimate Interest:</strong> When processing is necessary for our legitimate interests</li>
                <li>• <strong>Legal Obligation:</strong> When processing is necessary to comply with legal requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Privacy?</h2>
          <p className="text-xl mb-8">
            We&apos;re here to help with any privacy concerns you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#b80000] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 