'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Payment } from '@/lib/payments';

interface PayPalCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess: (payment: Payment) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons,funding-eligibility`;
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
              setError(null);
              
              // Capture the order
              const order = await actions.order.capture();
              
              // Validate the capture response
              if (!order || !order.id) {
                throw new Error('Invalid payment response received');
              }
              
              onSuccess(order);
            } catch (error: any) {
              console.error('PayPal capture error:', error);
              
              // Provide user-friendly error messages
              let errorMessage = 'Payment processing failed. Please try again.';
              
              if (error.details?.[0]?.issue) {
                const issue = error.details[0].issue;
                const issueMap: Record<string, string> = {
                  'ORDER_NOT_APPROVED': 'Payment was not approved. Please try again.',
                  'ORDER_ALREADY_CAPTURED': 'Payment has already been processed.',
                  'ORDER_EXPIRED': 'Payment order has expired. Please create a new order.',
                  'PAYER_ACCOUNT_LOCKED_OR_CLOSED': 'PayPal account is locked or closed. Please use a different payment method.',
                  'PAYER_ACCOUNT_RESTRICTED': 'PayPal account is restricted. Please use a different payment method.',
                  'PAYER_CANNOT_PAY': 'Unable to process payment with this PayPal account. Please try a different method.',
                  'PAYER_COUNTRY_NOT_SUPPORTED': 'PayPal payments from your country are not supported.',
                  'PAYER_ACCOUNT_NOT_VERIFIED': 'PayPal account is not verified. Please verify your account or use a different method.',
                  'INSUFFICIENT_FUNDS': 'Insufficient funds in PayPal account. Please add funds or use a different payment method.',
                  'CURRENCY_NOT_SUPPORTED': 'Currency not supported. Please try again with USD.',
                  'AMOUNT_TOO_LARGE': 'Payment amount is too large. Please contact support.',
                  'AMOUNT_TOO_SMALL': 'Payment amount is too small. Please try a larger amount.'
                };
                errorMessage = issueMap[issue] || errorMessage;
              } else if (error.message) {
                if (error.message.includes('timeout')) {
                  errorMessage = 'Payment processing timeout. Please try again.';
                } else if (error.message.includes('network')) {
                  errorMessage = 'Network error. Please check your internet connection and try again.';
                } else if (error.message.includes('cancelled')) {
                  errorMessage = 'Payment was cancelled. Please try again.';
                }
              }
              
              setError(errorMessage);
              onError(errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
          onCancel: () => {
            setError(null);
            onCancel();
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            let errorMessage = 'Payment failed. Please try again.';
            
            if (err.details?.[0]?.issue) {
              const issue = err.details[0].issue;
              const issueMap: Record<string, string> = {
                'INVALID_REQUEST': 'Invalid payment request. Please check your details and try again.',
                'PAYER_ACCOUNT_LOCKED_OR_CLOSED': 'PayPal account is locked or closed. Please use a different payment method.',
                'PAYER_ACCOUNT_RESTRICTED': 'PayPal account is restricted. Please use a different payment method.',
                'PAYER_CANNOT_PAY': 'Unable to process payment with this PayPal account. Please try a different method.',
                'PAYER_COUNTRY_NOT_SUPPORTED': 'PayPal payments from your country are not supported.',
                'PAYER_ACCOUNT_NOT_VERIFIED': 'PayPal account is not verified. Please verify your account or use a different method.',
                'INSUFFICIENT_FUNDS': 'Insufficient funds in PayPal account. Please add funds or use a different payment method.',
                'CURRENCY_NOT_SUPPORTED': 'Currency not supported. Please try again with USD.',
                'AMOUNT_TOO_LARGE': 'Payment amount is too large. Please contact support.',
                'AMOUNT_TOO_SMALL': 'Payment amount is too small. Please try a larger amount.'
              };
              errorMessage = issueMap[issue] || errorMessage;
            }
            
            setError(errorMessage);
            onError(errorMessage);
          },
          onInit: (data: any, actions: any) => {
            // PayPal buttons are ready
            setIsLoading(false);
          },
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }
        }).render(paypalRef.current);
      }
    };
    
    script.onerror = () => {
      setError('Failed to load PayPal. Please refresh the page and try again.');
      setIsLoading(false);
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId, onSuccess, onError, onCancel]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setIsLoading(true);
    
    // Force reload of PayPal script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons,funding-eligibility`;
    script.async = true;
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        // Clear the container
        paypalRef.current.innerHTML = '';
        
        // Re-render PayPal buttons
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return orderId;
          },
          onApprove: async (data: any, actions: any) => {
            try {
              setIsLoading(true);
              setError(null);
              const order = await actions.order.capture();
              onSuccess(order);
            } catch (error: any) {
              console.error('PayPal capture error:', error);
              const errorMessage = 'Payment processing failed. Please try again.';
              setError(errorMessage);
              onError(errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
          onCancel: () => {
            setError(null);
            onCancel();
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            const errorMessage = 'Payment failed. Please try again.';
            setError(errorMessage);
            onError(errorMessage);
          },
          onInit: () => {
            setIsLoading(false);
          },
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }
        }).render(paypalRef.current);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">{error}</p>
              {retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
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
      
      {retryCount >= 3 && error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                Having trouble with PayPal? Please refresh the page or contact support for assistance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 