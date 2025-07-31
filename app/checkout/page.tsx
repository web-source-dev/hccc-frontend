'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertCircle, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getGame, type Game } from '@/lib/games';
import { createOrder, captureOrder, type Payment } from '@/lib/payments';
import { isAuthenticated } from '@/lib/auth';
import { PayPalCheckout } from '@/components/paypal-checkout';

interface CheckoutFormProps {
  game: Game;
  packageIndex: number;
  location: string;
  orderId: string;
  onSuccess: (payment: Payment) => void;
  onError: (error: string) => void;
  onRetry: () => void;
  isRetrying: boolean;
}

function CheckoutForm({ game, packageIndex, location, orderId, onSuccess, onError, onRetry, isRetrying }: CheckoutFormProps) {
  const [error, setError] = useState('');

  const handlePayPalSuccess = async () => {
    try {
      setError('');
      // Capture the PayPal order on our backend
      const response = await captureOrder({
        orderId: orderId,
      });

      if (response.success) {
        onSuccess(response.data.payment);
      } else {
        throw new Error(response.message || 'Payment capture failed');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  const handlePayPalError = (error: string) => {
    setError(error);
    onError(error);
  };

  const handlePayPalCancel = () => {
    setError('Payment was canceled. You can try again or choose a different payment method.');
    onError('Payment was canceled');
  };

  const tokenPackage = game.tokenPackages[packageIndex];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-black p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Game:</span>
              <span className="font-medium">{game.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Tokens:</span>
              <span className="font-medium">{tokenPackage.tokens} tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total:</span>
              <span>${tokenPackage.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-yellow-300/20 border border-yellow-300">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Important Notice
          </h3>
          <p className="text-sm">
            Tokens purchased after location closing hours will be automatically added to your account the next business day.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Payment Method</h3>
          <div className="bg-black p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-500" />
              <span className="font-medium">PayPal</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Complete your payment securely with PayPal. You can pay with your PayPal balance, bank account, or credit/debit card.
            </p>
            
            <PayPalCheckout
              orderId={orderId}
              amount={tokenPackage.price}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              onCancel={handlePayPalCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPageContent() {
  const [game, setGame] = useState<Game | null>(null);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeCheckout = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Check authentication first
      if (!isAuthenticated()) {
        setError('Please log in to continue with your purchase.');
        setIsLoading(false);
        return;
      }

      const gameId = searchParams.get('gameId');
      const packageIndex = searchParams.get('packageIndex');
      const location = searchParams.get('location');

      if (!gameId || packageIndex === null || !location) {
        throw new Error('Missing required purchase information. Please try again.');
      }

      // Fetch game details
      const gameResponse = await getGame(gameId);
      if (!gameResponse.success) {
        throw new Error('Unable to load game details. Please try again.');
      }

      const gameData = gameResponse.data.game;
      setGame(gameData);

      // Create PayPal order
      const orderResponse = await createOrder({
        gameId,
        packageIndex: parseInt(packageIndex),
        location,
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Unable to create payment order. Please try again.');
      }

      setOrderId(orderResponse.data.orderId);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to initialize checkout. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeCheckout();
  }, [searchParams]);

  const handlePaymentSuccess = (payment: Payment) => {
    // Redirect to success page with payment ID
    router.push(`/payment-success?paymentId=${payment._id}`);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setError('');
    await initializeCheckout();
    setIsRetrying(false);
  };

  if (isLoading) {
    return <LoadingCheckout />;
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>Please Log In to Continue</AlertDescription>
              </Alert>
              <Link href="/login">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </div>

        <Card className="border-gray-700">
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="ml-4"
                  >
                    {isRetrying ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {game && orderId ? (
              <CheckoutForm
                game={game}
                packageIndex={parseInt(searchParams.get('packageIndex') || '0')}
                location={searchParams.get('location') || ''}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onRetry={handleRetry}
                isRetrying={isRetrying}
              />
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {error || 'Unable to load checkout information. Please try again.'}
                </p>
                <Button onClick={handleRetry} disabled={isRetrying}>
                  {isRetrying ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingCheckout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Preparing your checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingCheckout />}>
      <CheckoutPageContent />
    </Suspense>
  );
} 