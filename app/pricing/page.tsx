import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { query } from '@/lib/server/db';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const buttonBaseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary/90";
const outlineBtn = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
const btnMd = "h-10 px-4 py-2";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number | null;
  price_display: string | null;
  price_suffix: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_featured: boolean;
  features: string[];
}

const formatPrice = (plan: PricingPlan) => {
  if (plan.price_display) {
    return plan.price_display;
  }
  if (plan.price_cents === null) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(plan.price_cents / 100);
};

export default async function PricingPage() {
  const result = await query(
    `SELECT id, name, slug, description, price_cents, price_display, price_suffix,
            cta_label, cta_href, is_featured, features
     FROM pricing_plans
     ORDER BY sort_order ASC, name ASC`
  );
  const plans = result.rows as PricingPlan[];
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, transparent pricing</h1>
              <p className="text-lg text-muted-foreground">
                Choose the plan that fits your practice size and security needs.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {plans.map((plan) => {
                  const isFeatured = plan.is_featured;
                  const cardClass = isFeatured
                    ? 'rounded-xl border-2 border-primary bg-card p-8 shadow-md flex flex-col relative scale-105'
                    : 'rounded-xl border bg-card p-8 shadow-sm flex flex-col';
                  const buttonClass = isFeatured
                    ? `${buttonBaseClass} ${primaryBtn} ${btnMd} w-full`
                    : `${buttonBaseClass} ${outlineBtn} ${btnMd} w-full`;
                  return (
                    <div key={plan.id} className={cardClass}>
                      {isFeatured && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className={`font-semibold text-lg ${isFeatured ? 'text-primary' : ''}`}>{plan.name}</h3>
                      <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold">{formatPrice(plan)}</span>
                        {plan.price_suffix && (
                          <span className="text-muted-foreground">{plan.price_suffix}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                      <ul className="space-y-3 mb-8 flex-1 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={plan.cta_href || '/app'} className={buttonClass}>
                        {plan.cta_label || 'Get Started'}
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
