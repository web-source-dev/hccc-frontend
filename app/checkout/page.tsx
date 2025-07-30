'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertCircle, CreditCard } from 'lucide-react';
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
}

function CheckoutForm({ game, packageIndex, location, orderId, onSuccess, onError }: CheckoutFormProps) {
  const [error, setError] = useState('');

  const handlePayPalSuccess = async (paypalOrder: any) => {
    try {
      // Capture the PayPal order on our backend
      const response = await captureOrder({
        orderId: orderId,
      });

      if (response.success) {
        onSuccess(response.data.payment);
      } else {
        throw new Error('Payment capture failed');
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
              Complete your payment securely with PayPal.
            </p>
            {error && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            
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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Check authentication first
        if (!isAuthenticated()) {
          setError('Please log in to continue');
          setIsLoading(false);
          return;
        }

        const gameId = searchParams.get('gameId');
        const packageIndex = searchParams.get('packageIndex');
        const location = searchParams.get('location');

        if (!gameId || packageIndex === null || !location) {
          throw new Error('Missing required parameters');
        }

        // Fetch game details
        const gameResponse = await getGame(gameId);
        if (!gameResponse.success) {
          throw new Error('Failed to load game details');
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
          throw new Error('Failed to create PayPal order');
        }

        setOrderId(orderResponse.data.orderId);
      } catch (err) {
        setError((err as Error).message || 'Failed to initialize checkout');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [searchParams]);

  const handlePaymentSuccess = (payment: Payment) => {
    // Redirect to success page with payment ID
    router.push(`/payment-success?paymentId=${payment._id}`);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
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

  if (!game || !orderId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Alert variant="destructive">
                <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
              </Alert>
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
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <CheckoutForm
              game={game}
              packageIndex={parseInt(searchParams.get('packageIndex') || '0')}
              location={searchParams.get('location') || ''}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
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
        <p>Loading checkout...</p>
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