
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BuyCreditsPage() {
  const handleStripeCheckout = (priceId: string) => {
    // In a real application, you would:
    // 1. Call your backend (Edge Function) to create a Stripe Checkout Session
    // 2. Redirect to the URL returned by the backend
    // For this demo, we will use a hypothetical Stripe Payment Link
    window.open('https://buy.stripe.com/test_50CreditsPack', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Credits</h1>
        <p className="text-muted-foreground">Choose a package to continue generating professional fonts.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Basic Pack */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Starter Pack</CardTitle>
            <CardDescription>Perfect for testing a few ideas.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold mb-4">$5.00</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 10 Credits</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 2 Font Exports</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => handleStripeCheckout('price_basic')}>
              Buy Now
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Pack */}
        <Card className="flex flex-col border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            BEST VALUE
          </div>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Pro Pack
            </CardTitle>
            <CardDescription>For agencies and power users.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold mb-4">$15.00</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 50 Credits</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 10 Font Exports</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Commercial License</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStripeCheckout('price_pro')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-lg bg-muted/50 p-6 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>
          Secure payments processed by Stripe. Credits are added to your account immediately after successful payment via webhook.
        </p>
      </div>
    </div>
  );
}
