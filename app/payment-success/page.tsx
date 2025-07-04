'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPaymentDetails, type Payment } from '@/lib/payments';
import Image from 'next/image';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentId) {
        setError('Payment ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await getPaymentDetails(paymentId);
        setPayment(response.data.payment);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-bold mb-2 text-red-400">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Payment not found'}</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-gold-400">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={payment.game.image}
                  alt={payment.game.name}
                  className="w-12 h-12 rounded object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <h3 className="font-semibold text-white">{payment.game.name}</h3>
                  <p className="text-sm text-gray-400">{payment.location}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Tokens Purchased:</span>
                  <span className="text-white font-medium">{payment.tokenPackage.tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount Paid:</span>
                  <span className="text-gold-400 font-bold">${payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-medium ${
                    payment.status === 'succeeded' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-400 text-center">
                <p>Your tokens will be available at the location.</p>
                <p>Payment ID: {payment._id}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              
              {payment.receiptUrl && (
                <Button 
                  variant="outline" 
                  onClick={() => window.open(payment.receiptUrl, '_blank')}
                  className="w-full"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .text-gold-400 { color: #FFD700; }
        .bg-gold-400 { background-color: #FFD700; }
      `}</style>
    </div>
  );
}

// Loading component for suspense fallback
function LoadingPayment() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto mb-4"></div>
        <p>Loading payment details...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingPayment />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 