'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getGame, type Game } from '@/lib/games';
import { createPayPalOrder, capturePayPalOrder, type Payment } from '@/lib/payments';
import { isAuthenticated } from '@/lib/auth';

interface CheckoutFormProps {
  game: Game;
  packageIndex: number;
  location: string;
  onSuccess: (payment: Payment) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ game, packageIndex, location, onSuccess, onError }: CheckoutFormProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const tokenPackage = game.tokenPackages[packageIndex];

  const createOrder = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await createPayPalOrder({
        gameId: game._id,
        packageIndex,
        location
      });

      if (response.success) {
        return response.data.orderId;
      } else {
        throw new Error('Failed to create PayPal order');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create PayPal order';
      setError(errorMessage);
      onError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await capturePayPalOrder({
        orderId: data.orderID
      });

      if (response.success) {
        onSuccess(response.data.payment);
      } else {
        throw new Error('Failed to capture PayPal order');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to capture PayPal order';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPayPalError = (err: unknown) => {
    console.error('PayPal error:', err);
    const errorMessage = 'PayPal payment failed. Please try again.';
    setError(errorMessage);
    onError(errorMessage);
  };

  const onCancel = () => {
    setError('Payment was canceled');
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
        <p className="text-muted-foreground">
          {tokenPackage.tokens} tokens for {game.name} at {location}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Game:</span>
            <span className="font-medium">{game.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Location:</span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tokens:</span>
            <span className="font-medium">{tokenPackage.tokens} tokens</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>${tokenPackage.price.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
                 <PayPalButtons
           createOrder={createOrder}
           onApprove={onApprove}
           onError={onPayPalError}
           onCancel={onCancel}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          }}
          disabled={isLoading}
        />

        <div className="text-center">
          <Link href={`/tokens/${game._id}`}>
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Check authentication
        if (!isAuthenticated()) {
          router.push('/login?redirect=' + encodeURIComponent(window.location.href));
          return;
        }

        const gameId = searchParams.get('gameId');
        const packageIndex = searchParams.get('packageIndex');
        const location = searchParams.get('location');

        if (!gameId || packageIndex === null || !location) {
          setError('Missing required parameters');
          setIsLoading(false);
          return;
        }

        // Fetch game details
        const gameResponse = await getGame(gameId);
        if (gameResponse.success) {
          setGame(gameResponse.data.game);
        } else {
          setError('Failed to load game details');
        }
      } catch (error) {
        console.error('Error initializing checkout:', error);
        setError('Failed to initialize checkout');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [searchParams, router]);

  const handlePaymentSuccess = (payment: Payment) => {
    setPaymentSuccess(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push(`/payment-success?orderId=${payment.paypalOrderId}`);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (isLoading) {
    return <LoadingCheckout />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Redirecting you to the success page...
          </p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Game not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const packageIndex = parseInt(searchParams.get('packageIndex') || '0');
  const location = searchParams.get('location') || '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CheckoutForm
        game={game}
        packageIndex={packageIndex}
        location={location}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}

function LoadingCheckout() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading checkout...</span>
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