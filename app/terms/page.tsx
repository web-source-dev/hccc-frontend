import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#b80000] to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            TERMS OF SERVICE
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Rules and guidelines for using our services
          </p>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Agreement to Terms</h2>
              <p className="text-gray-300 mb-4">
                These Terms of Service (&quot;Terms&quot;) govern your use of HCCC Gameroom&apos;s services, including our website, mobile applications, and physical locations. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-300">
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Age Requirements</h2>
              <p className="text-gray-300 mb-4">
                You must be at least 18 years of age to use our services. By using our services, you represent and warrant that:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• You are at least 18 years old</li>
                <li>• You have the legal capacity to enter into these Terms</li>
                <li>• You will comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We reserve the right to verify your age and may require valid identification.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Services Description</h2>
              <p className="text-gray-300 mb-4">
                HCCC Gameroom provides gaming entertainment services, including:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Access to gaming machines and equipment</li>
                <li>• Token-based gaming activities</li>
                <li>• Prize redemption services</li>
                <li>• Food and beverage services</li>
                <li>• Event hosting and private parties</li>
                <li>• Online services and mobile applications</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">User Accounts</h2>
              <p className="text-gray-300 mb-4">
                When you create an account with us, you must provide accurate and complete information. You are responsible for:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Maintaining the security of your account credentials</li>
                <li>• All activities that occur under your account</li>
                <li>• Notifying us immediately of any unauthorized use</li>
                <li>• Keeping your account information up to date</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We reserve the right to terminate accounts that violate these Terms.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Payment and Billing</h2>
              <p className="text-gray-300 mb-4">
                All purchases and transactions are subject to the following terms:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• All prices are in US Dollars unless otherwise stated</li>
                <li>• Payment must be made at the time of purchase</li>
                <li>• We accept cash, credit cards, debit cards, and digital payments</li>
                <li>• All sales are final unless otherwise specified</li>
                <li>• Refunds are subject to our refund policy</li>
                <li>• We may change prices at any time without notice</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Prohibited Activities</h2>
              <p className="text-gray-300 mb-4">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Violating any applicable laws or regulations</li>
                <li>• Attempting to cheat, hack, or manipulate our games</li>
                <li>• Interfering with other users&apos; enjoyment of our services</li>
                <li>• Harassing, threatening, or intimidating other users or staff</li>
                <li>• Damaging or vandalizing our property or equipment</li>
                <li>• Using our services for illegal gambling activities</li>
                <li>• Attempting to gain unauthorized access to our systems</li>
                <li>• Sharing account credentials with others</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All content, trademarks, logos, and intellectual property on our website and in our facilities are owned by HCCC Gameroom or our licensors. You may not:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Copy, reproduce, or distribute our content without permission</li>
                <li>• Use our trademarks or logos without authorization</li>
                <li>• Create derivative works based on our content</li>
                <li>• Remove or alter any copyright notices</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Privacy and Data Protection</h2>
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Our collection and use of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-300">
                By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                To the maximum extent permitted by law, HCCC Gameroom shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Loss of profits, data, or use</li>
                <li>• Business interruption</li>
                <li>• Personal injury or property damage</li>
                <li>• Emotional distress</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Our total liability shall not exceed the amount you paid for our services in the 12 months preceding the claim.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Disclaimer of Warranties</h2>
              <p className="text-gray-300 mb-4">
                Our services are provided &quot;as is&quot; and &quot;as available&quot; without any warranties, express or implied. We disclaim all warranties, including but not limited to:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Warranties of merchantability</li>
                <li>• Warranties of fitness for a particular purpose</li>
                <li>• Warranties of non-infringement</li>
                <li>• Warranties that our services will be uninterrupted or error-free</li>
              </ul>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Indemnification</h2>
              <p className="text-gray-300">
                You agree to indemnify and hold harmless HCCC Gameroom, its officers, directors, employees, and agents from and against any claims, damages, losses, and expenses arising out of or relating to your use of our services or violation of these Terms.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including but not limited to:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Violation of these Terms</li>
                <li>• Fraudulent or illegal activities</li>
                <li>• Harassment of other users or staff</li>
                <li>• Non-payment of fees</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Upon termination, your right to use our services will cease immediately.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Governing Law</h2>
              <p className="text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of Williamson County, Texas.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Severability</h2>
              <p className="text-gray-300">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the new Terms.
              </p>
            </div>

            <div className="bg-[#222] rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> legal@hccc.online</p>
                <p><strong>Phone:</strong> (512) 986-7878 (Cedar Park) or (512) 548-6505 (Liberty Hill)</p>
                <p><strong>Address:</strong> 601 E Whitestone Blvd, Suite 304, Cedar Park, TX 78613</p>
              </div>
            </div>

            <div className="bg-[#222] rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">Entire Agreement</h2>
              <p className="text-gray-300">
                These Terms, together with our Privacy Policy and any other agreements referenced herein, constitute the entire agreement between you and HCCC Gameroom regarding your use of our services. These Terms supersede all prior agreements and understandings, whether written or oral.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#b80000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Our Terms?</h2>
          <p className="text-xl mb-8">
            We&apos;re here to help clarify any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#b80000] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 