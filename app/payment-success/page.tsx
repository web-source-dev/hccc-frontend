'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getPaymentByOrder, type Payment } from '@/lib/payments';
import { isAuthenticated } from '@/lib/auth';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // Check authentication
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }

        const orderId = searchParams.get('orderId');
        if (!orderId) {
          setError('No order ID provided');
          setIsLoading(false);
          return;
        }

        const response = await getPaymentByOrder(orderId);
        if (response.success) {
          setPayment(response.data.payment);
        } else {
          setError('Failed to fetch payment details');
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
        setError('Failed to load payment information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [searchParams, router]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const orderId = searchParams.get('orderId');
      if (orderId) {
        const response = await getPaymentByOrder(orderId);
        if (response.success) {
          setPayment(response.data.payment);
          setError('');
        } else {
          setError('Failed to fetch payment details');
        }
      }
    } catch (error) {
      console.error('Error refreshing payment:', error);
      setError('Failed to refresh payment information');
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return <LoadingPayment />;
  }

  if (error && !payment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleRetry} disabled={isRetrying}>
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </>
            )}
          </Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Payment not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = payment.status === 'COMPLETED';
  const isPending = ['CREATED', 'SAVED', 'APPROVED', 'PAYER_ACTION_REQUIRED'].includes(payment.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        {isSuccess ? (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        ) : isPending ? (
          <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
        ) : (
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        )}
        
        <h1 className="text-3xl font-bold mb-2">
          {isSuccess ? 'Payment Successful!' : isPending ? 'Payment Processing' : 'Payment Failed'}
        </h1>
        
        <p className="text-muted-foreground">
          {isSuccess 
            ? 'Your tokens have been added to your account.'
            : isPending 
            ? 'Your payment is being processed. Please wait...'
            : 'Your payment was not completed successfully.'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Order ID:</span>
            <span className="font-mono text-sm">{payment.paypalOrderId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Game:</span>
            <span className="font-medium">{payment.game.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Location:</span>
            <span className="font-medium">{payment.location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Tokens:</span>
            <span className="font-medium">{payment.tokenPackage.tokens} tokens</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Amount:</span>
            <span className="font-medium">${payment.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <span className={`font-medium ${
              isSuccess ? 'text-green-600' : 
              isPending ? 'text-blue-600' : 
              'text-red-600'
            }`}>
              {payment.status}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Date:</span>
            <span className="font-medium">
              {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {payment.tokensScheduledFor && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Token Schedule Notice</h3>
              <p className="text-sm text-yellow-700">
                Your tokens will be added to your account on{' '}
                {new Date(payment.tokensScheduledFor).toLocaleDateString()} at{' '}
                {new Date(payment.tokensScheduledFor).toLocaleTimeString()}.
              </p>
            </div>
          )}

          {payment.receiptUrl && (
            <div className="pt-4">
              <a 
                href={payment.receiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Receipt
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 flex gap-4 justify-center">
        {isPending && (
          <Button onClick={handleRetry} disabled={isRetrying}>
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Status...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Status
              </>
            )}
          </Button>
        )}
        
        <Link href={`/tokens/${payment.game._id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Game
          </Button>
        </Link>
        
        <Link href="/">
          <Button variant="outline">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingPayment() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payment details...</span>
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