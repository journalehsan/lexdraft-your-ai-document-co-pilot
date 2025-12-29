import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="border rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>5 projects</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>100 AI generations/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Basic editor</span>
              </li>
            </ul>
            <button className="w-full py-2 border border-border rounded-md hover:bg-accent transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-primary rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited AI generations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Advanced editor features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="border rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>On-premise deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Custom AI models</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <button className="w-full py-2 border border-border rounded-md hover:bg-accent transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
