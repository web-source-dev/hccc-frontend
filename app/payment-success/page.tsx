'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Package, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { getPaymentDetails, getPaymentByOrder, captureOrder, type Payment } from '@/lib/payments';

function PaymentSuccessContent() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const searchParams = useSearchParams();

  const fetchPayment = async () => {
    try {
      setLoading(true);
      setError('');
      const paymentId = searchParams.get('paymentId');
      if (!paymentId) {
        const orderId = searchParams.get('orderId');
        if (orderId) {
          const response = await getPaymentByOrder(orderId);
          if (response.success) {
            setPayment(response.data.payment);
            setLoading(false);
            return;
          } else {
            setError('Payment not found');
            setLoading(false);
            return;
          }
        }
        setError('Payment ID is required');
        setLoading(false);
        return;
      }
      const response = await getPaymentDetails(paymentId);
      if (response.success) {
        setPayment(response.data.payment);
      } else {
        setError('Failed to load payment details');
      }
    } catch (err) {
      console.log(err);
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
    // eslint-disable-next-line
  }, [searchParams]);

  const handleRetry = async () => {
    if (!payment) return;
    setRetrying(true);
    setError('');
    try {
      // Try to capture payment status with backend
      const response = await captureOrder({ orderId: payment.paypalOrderId });
      if (response.success) {
        setPayment(response.data.payment);
      } else {
        setError('Could not update payment status. Please try again later.');
      }
    } catch (err) {
      console.log(err);
      setError('Could not update payment status. Please try again later.');
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return <LoadingPayment />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Link href="/">
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                </Link>
                <Link href="/profile?tab=history">
                  <Button variant="outline" className="w-full">
                    View Payment History
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <Alert variant="destructive">
                <AlertDescription>Payment not found</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = payment.status === 'succeeded';
  const isPending = payment.status === 'pending' || payment.status === 'processing';
  const isFailed = payment.status === 'failed' || payment.status === 'canceled' || payment.status === 'expired';
  const tokensAdded = payment.tokensAdded;
  const tokensScheduled = payment.tokensScheduledFor && !payment.tokensAdded;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : isPending ? (
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            <CardTitle className="text-2xl font-bold">
              {isSuccess ? 'Payment Successful!' : isPending ? 'Payment Processing' : 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess && tokensAdded && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your payment was processed successfully. Your tokens are now available at the selected location. Thank you for your purchase!
                </AlertDescription>
              </Alert>
            )}
            {isSuccess && tokensScheduled && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                <AlertDescription className="text-yellow-800">
                  Your payment was successful, but tokens will be added to your account on <b>{new Date(payment.tokensScheduledFor || '').toLocaleString()}</b> due to location closing hours. You will receive an email when tokens are credited. Thank you for your patience!
                </AlertDescription>
              </Alert>
            )}
            {isPending && (
              <Alert className="bg-blue-50 border-blue-200">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-800">
                  Your payment is being processed. This may take a few moments. If tokens are not credited within 5 minutes, please click the button below to retry. If the issue persists, contact support with your payment details.
                </AlertDescription>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <Button onClick={handleRetry} disabled={retrying} className="w-full max-w-xs">
                    {retrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {retrying ? 'Checking Status...' : 'Retry Status'}
                  </Button>
                </div>
              </Alert>
            )}
            {isFailed && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Payment failed or was cancelled. Please try again or contact support if you were charged but did not receive tokens.
                </AlertDescription>
              </Alert>
            )}
            <div className="bg-black p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Game</p>
                    <p className="font-medium">{payment.game.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tokens</p>
                    <p className="font-medium">{payment.tokenPackage.tokens} tokens</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{payment.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Back to Games
                </Button>
              </Link>
              <Link href="/profile?tab=history" className="flex-1">
                <Button variant="outline" className="w-full">
                  View Payment History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingPayment() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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