import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const buttonBaseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary/90";
const outlineBtn = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";

export interface PricingPlan {
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

interface PricingTableProps {
  plans: PricingPlan[];
  showHeader?: boolean;
  className?: string;
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

export function PricingTable({ plans, showHeader = true, className = "" }: PricingTableProps) {
  return (
    <div className={`space-y-16 ${className}`}>
      {showHeader && (
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-blue-900 dark:text-blue-100 font-light text-sm tracking-wider">
            <span className="w-8 h-[1px] bg-blue-900 dark:bg-blue-100"></span>
            PRICING
            <span className="w-8 h-[1px] bg-blue-900 dark:bg-blue-100"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950 dark:text-blue-100">
            Simple, transparent pricing for <span className="font-semibold text-blue-800 dark:text-blue-300">legal professionals</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            Choose the plan that fits your practice size and security requirements.
          </p>
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isFeatured = plan.is_featured;
          const cardClass = isFeatured
            ? 'rounded-2xl border-2 border-blue-900 dark:border-blue-700 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800 p-10 shadow-lg flex flex-col relative transform scale-105 hover:scale-[1.07] transition-transform duration-300'
            : 'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-10 shadow-sm flex flex-col hover:shadow-lg transition-shadow duration-300';
          const buttonClass = isFeatured
            ? `${buttonBaseClass} ${primaryBtn} h-12 px-6 py-3 w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-light`
            : `${buttonBaseClass} ${outlineBtn} h-12 px-6 py-3 w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-light`;
          
          return (
            <div key={plan.id} className={cardClass}>
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 dark:bg-blue-700 text-white text-xs font-light px-4 py-2 rounded-full tracking-wider">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-light text-blue-950 dark:text-blue-100">{plan.name}</h3>
              <div className="mt-6 mb-8">
                <span className="text-5xl font-light text-blue-950 dark:text-blue-100">{formatPrice(plan)}</span>
                {plan.price_suffix && (
                  <span className="text-slate-600 dark:text-slate-400 text-lg">{plan.price_suffix}</span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">{plan.description}</p>
              <ul className="space-y-4 mb-10 flex-1 text-sm font-light text-slate-700 dark:text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 items-start">
                    <CheckCircle2 className={`h-5 w-5 ${isFeatured ? 'text-blue-700 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'} shrink-0 mt-0.5`} />
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
  );
}