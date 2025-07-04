'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getGame, type Game } from '@/lib/games';
import { createPaymentIntent, confirmPayment, type Payment } from '@/lib/payments';
import { isAuthenticated } from '@/lib/auth';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface CheckoutFormProps {
  game: Game;
  packageIndex: number;
  location: string;
  clientSecret: string;
  onSuccess: (payment: Payment) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ game, packageIndex, location, clientSecret, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const tokenPackage = game.tokenPackages[packageIndex];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || submitted) {
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitted(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      setSubmitted(false);
      return;
    }

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        setSubmitted(false);
        return;
      }

      if (paymentIntent) {
        // Confirm payment with our backend
        const response = await confirmPayment({
          paymentIntentId: paymentIntent.id,
        });

        if (response.success) {
          onSuccess(response.data.payment);
        } else {
          setError('Failed to confirm payment');
          setSubmitted(false);
        }
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Payment failed');
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Details
          </label>
          <div className="border border-gray-600 rounded-lg p-3 bg-gray-800">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Game:</span>
            <span className="text-white font-medium">{game.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Location:</span>
            <span className="text-white font-medium">{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Tokens:</span>
            <span className="text-white font-medium">{tokenPackage.tokens}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-300">Total:</span>
            <span className="text-gold-400">${tokenPackage.price}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gold-400 text-black hover:bg-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${tokenPackage.price}
          </>
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<Payment | null>(null);
  const [initialized, setInitialized] = useState(false);

  const gameId = searchParams.get('gameId');
  const packageIndex = parseInt(searchParams.get('packageIndex') || '0');
  const location = searchParams.get('location');

  useEffect(() => {
    const initializeCheckout = async () => {
      // Check authentication
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      if (!gameId || !location || initialized) {
        if (!gameId || !location) {
          setError('Missing required parameters');
        }
        setLoading(false);
        return;
      }

      try {
        setInitialized(true);
        
        // Fetch game details
        const gameResponse = await getGame(gameId);
        setGame(gameResponse.data.game);

        // Create payment intent
        const paymentResponse = await createPaymentIntent({
          gameId,
          packageIndex,
          location,
        });

        setClientSecret(paymentResponse.data.clientSecret);
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to initialize checkout');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [gameId, packageIndex, location, router, initialized]);

  const handlePaymentSuccess = (payment: Payment) => {
    setPaymentSuccess(payment);
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push(`/payment-success?paymentId=${payment._id}`);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setInitialized(false); // Allow retry
  };

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      setInitialized(false);
    };
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold-400" />
          <p>Initializing checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Checkout Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/')} variant="outline">
              Go Home
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gold-400">Payment Successful!</h2>
          <p className="text-gray-300 mb-4">
            You have successfully purchased {paymentSuccess.tokenPackage.tokens} tokens for {paymentSuccess.metadata.gameName}.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Your tokens will be available at {paymentSuccess.location}.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/')}>
              Go Home
            </Button>
            {paymentSuccess.receiptUrl && (
              <Button variant="outline" onClick={() => window.open(paymentSuccess.receiptUrl, '_blank')}>
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!game || !clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                game={game}
                packageIndex={packageIndex}
                location={location!}
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
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