'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getGame, type Game } from '@/lib/games';
import { createPaymentIntent, confirmPayment, type Payment } from '@/lib/payments';
import { isAuthenticated } from '@/lib/auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe appearance configuration
const appearance = {
  theme: 'night' as const,
  layout: 'accordion',
  height: '500px',
  variables: {
    colorPrimary: '#ffffff',
    colorBackground: '#000000',
    colorText: '#ffffff',
    colorDanger: '#ef4444',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Tab': {
      border: '1px solid #374151',
      boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
      backgroundColor: '#1f2937',
      color: '#ffffff',
    },
    '.Tab:hover': {
      color: '#ffffff',
      backgroundColor: '#374151',
    },
    '.Tab--selected': {
      backgroundColor: '#374151',
      borderColor: '#6b7280',
    },
    '.Tab--selected:hover': {
      backgroundColor: '#4b5563',
    },
    '.TabIcon': {
      color: '#ffffff',
    },
    '.TabLabel': {
      color: '#ffffff',
    },
    '.Input': {
      backgroundColor: '#000000',
      border: '1px solid #374151',
      color: '#ffffff',
    },
    '.Input:focus': {
      borderColor: '#ffffff',
      boxShadow: '0 0 0 1px #ffffff',
    },
    '.Input::placeholder': {
      color: '#9ca3af',
    },
    '.Label': {
      color: '#ffffff',
    },
    '.Field': {
      backgroundColor: '#000000',
    },
    '.FieldSet': {
      backgroundColor: '#000000',
    },
    '.FieldSetLegend': {
      color: '#ffffff',
    },
    '.FieldError': {
      color: '#ef4444',
    },
    '.AccordionItem': {
      backgroundColor: '#000000',
      border: '1px solid #374151',
    },
    '.AccordionItemButton': {
      backgroundColor: '#000000',
      color: '#ffffff',
    },
    '.AccordionItemContent': {
      backgroundColor: '#000000',
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

function CheckoutForm({ game, packageIndex, location, clientSecret, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [elementsReady, setElementsReady] = useState(false);

  useEffect(() => {
    if (elements) {
      setElementsReady(true);
    }
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Payment form is not ready. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if PaymentElement is mounted
      const paymentElement = elements.getElement(PaymentElement);
      if (!paymentElement) {
        throw new Error('Payment form is not properly loaded. Please refresh the page.');
      }

      // Submit the payment form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || 'Payment form validation failed');
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      // Handle different payment intent statuses
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on our backend
        const response = await confirmPayment({
          paymentIntentId: paymentIntent.id,
        });

        if (response.success) {
          onSuccess(response.data.payment);
        } else {
          throw new Error('Payment confirmation failed');
        }
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // Handle 3D Secure or other authentication
        setError('Payment requires additional authentication. Please complete the payment process.');
      } else if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
        // Payment failed - get detailed error information
        const response = await confirmPayment({
          paymentIntentId: paymentIntent.id,
        });

        if (!response.success && response.data?.error) {
          const error = response.data.error;
          let errorMessage = error.message || 'Your card was declined.';
          
          // Provide more specific error messages based on error codes
          if (error.decline_code === 'generic_decline') {
            errorMessage = 'Your card was declined. Please try a different card or contact your bank.';
          } else if (error.decline_code === 'insufficient_funds') {
            errorMessage = 'Your card has insufficient funds. Please try a different card.';
          } else if (error.decline_code === 'lost_card') {
            errorMessage = 'This card has been reported lost. Please use a different card.';
          } else if (error.decline_code === 'stolen_card') {
            errorMessage = 'This card has been reported stolen. Please use a different card.';
          } else if (error.decline_code === 'expired_card') {
            errorMessage = 'This card has expired. Please use a different card.';
          } else if (error.decline_code === 'incorrect_cvc') {
            errorMessage = 'The CVC number is incorrect. Please check and try again.';
          } else if (error.decline_code === 'processing_error') {
            errorMessage = 'There was an error processing your card. Please try again.';
          } else if (error.code === 'card_declined') {
            errorMessage = 'Your card was declined. Please try a different card.';
          } else if (error.code === 'expired_card') {
            errorMessage = 'This card has expired. Please use a different card.';
          } else if (error.code === 'incorrect_cvc') {
            errorMessage = 'The CVC number is incorrect. Please check and try again.';
          } else if (error.code === 'processing_error') {
            errorMessage = 'There was an error processing your card. Please try again.';
          }
          
          throw new Error(errorMessage);
        } else {
          throw new Error('Payment failed. Please try again with a different payment method.');
        }
      } else {
        throw new Error('Payment was not completed successfully. Please try again.');
      }
    } catch (err) {
      setError((err as Error).message || 'Payment failed');
      onError((err as Error).message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const tokenPackage = game.tokenPackages[packageIndex];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-black p-1 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
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
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total:</span>
              <span>${tokenPackage.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-yellow-300/20 border border-yellow-300">
          <h3 className="font-semibold text-lg mb-2 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Important Notice</h3>
          <p className="text-sm">Tokens purchased after location closing hours will be automatically added to your account the next business day.</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Payment Information</h3>
          {elementsReady ? (
            <div className="bg-black px-2 py-2 rounded-lg border border-gray-700 min-h-[600px]">
              <PaymentElement 
                options={{
                  layout: 'accordion',
                  defaultValues: {
                    billingDetails: {
                      name: '',
                      email: '',
                    }
                  }
                }}
              />
              {error && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading payment form...</span>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !elementsReady}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${tokenPackage.price.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}

function CheckoutPageContent() {
  const [game, setGame] = useState<Game | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
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

        // Create payment intent
        const paymentResponse = await createPaymentIntent({
          gameId,
          packageIndex: parseInt(packageIndex),
          location,
        });

        if (!paymentResponse.success) {
          throw new Error('Failed to create payment intent');
        }

        setClientSecret(paymentResponse.data.clientSecret);
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

  if (!isAuthenticated) {
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

  if (!game || !clientSecret) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Alert variant="destructive">
                <AlertDescription> Something went wrong. Please try again later.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-2">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </div>

        <Card className="border-gray-700 p-0">
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <div className="mb-2 text-sm text-yellow-400 font-semibold text-center">
            {error && <Alert variant="destructive">{error}</Alert>}
          </div>
          <CardContent className="px-2 py-2 md:px-4 md:py-4">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <CheckoutForm
                game={game}
                packageIndex={parseInt(searchParams.get('packageIndex') || '0')}
                location={searchParams.get('location') || ''}
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
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