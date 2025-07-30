'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PayPalCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalCheckout({ 
  orderId, 
  amount, 
  onSuccess, 
  onError, 
  onCancel, 
  disabled = false 
}: PayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return orderId;
          },
          onApprove: async (data: any, actions: any) => {
            try {
              setIsLoading(true);
              // Capture the order
              const order = await actions.order.capture();
              onSuccess(order);
            } catch (error) {
              console.error('PayPal capture error:', error);
              onError('Payment capture failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          onCancel: () => {
            onCancel();
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            onError('Payment failed. Please try again.');
          }
        }).render(paypalRef.current);
        setIsLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId, onSuccess, onError, onCancel]);

  return (
    <div className="space-y-4">
      <div ref={paypalRef} className="flex justify-center">
        {isLoading && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading PayPal...</span>
          </div>
        )}
      </div>
      
      {disabled && (
        <div className="text-center text-sm text-gray-500">
          Please wait while we prepare your payment...
        </div>
      )}
    </div>
  );
} 