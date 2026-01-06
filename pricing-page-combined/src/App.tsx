import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Server,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Sparkles,
  Globe
} from 'lucide-react';
import { cn } from './utils/cn';

type Segment = "platform" | "ai" | "automation";
type BillingCycle = "monthly" | "quarterly" | "yearly";
type Currency = "EUR" | "USD";
type PriceModel =
  | { kind: "free" }
  | {
      kind: "paid";
      amountMonthly: number;
      unit: "workspace" | "user";
    };

type BadgeTone = "primary" | "success" | "warning" | "neutral";

type Plan = {
  id: string;
  title: string;
  badge?: { label: string; tone?: BadgeTone };
  description?: string;
  price: PriceModel;
  highlights: string[];
  bestFor?: string;
  cta: { label: string; variant?: "primary" | "secondary" | "outline" };
  finePrint?: string;
  popular?: boolean;
};

const YEARLY_DISCOUNT = 0.6;
const QUARTERLY_DISCOUNT = 0.5;
const MONTHLY_DISCOUNT = 0.4;
const EUR_TO_USD = 1.1;

function formatMoney(amount: number, currency: Currency) {
  const rounded = Math.round(amount);
  const symbol = currency === "EUR" ? "€" : "$";
  return `${symbol}${rounded}`;
}

function calcDisplayPrice(price: PriceModel, billing: BillingCycle, currency: Currency) {
  if (price.kind === "free") {
    return {
      primary: currency === "EUR" ? "€0" : "$0",
      original: null as number | null,
      suffix: "",
      sub: "Free forever",
      discountPercent: 0,
    };
  }

  const factor = currency === "EUR" ? 1 : EUR_TO_USD;
  const monthly = price.amountMonthly * factor;

  if (billing === "monthly") {
    const originalPrice = monthly;
    const discountedPrice = monthly * (1 - MONTHLY_DISCOUNT);
    return {
      primary: formatMoney(discountedPrice, currency),
      original: originalPrice,
      suffix: ` / ${price.unit} / month`,
      sub: "40% off · First year",
      discountPercent: Math.round(MONTHLY_DISCOUNT * 100),
    };
  }

  if (billing === "quarterly") {
    const originalPrice = monthly * 3;
    const discountedPrice = monthly * 3 * (1 - QUARTERLY_DISCOUNT);
    return {
      primary: formatMoney(discountedPrice, currency),
      original: originalPrice,
      suffix: ` / ${price.unit} / quarter`,
      sub: "50% off · Quarterly",
      discountPercent: Math.round(QUARTERLY_DISCOUNT * 100),
    };
  }

  const originalPrice = monthly * 12;
  const discountedPrice = monthly * 12 * (1 - YEARLY_DISCOUNT);
  return {
    primary: formatMoney(discountedPrice, currency),
    original: originalPrice,
    suffix: ` / ${price.unit} / year`,
    sub: "⭐ 60% off · Best value",
    discountPercent: Math.round(YEARLY_DISCOUNT * 100),
  };
}

function Badge({ tone, children }: { tone?: BadgeTone; children: React.ReactNode }) {
  const toneMap = {
    primary: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block", toneMap[tone || "neutral"])}>
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", className, ...props }: { children: React.ReactNode; variant?: "primary" | "secondary" | "outline"; className?: string; } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "variant">) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-400",
  };

  return (
    <button
      className={cn("px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-gray-900", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ToggleGroup({
  billing,
  setBilling,
  currency,
  setCurrency,
}: {
  billing: BillingCycle;
  setBilling: (v: BillingCycle) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
}) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-inset ring-slate-200 backdrop-blur sm:flex-row sm:items-center dark:bg-slate-900/40 dark:ring-slate-700">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Billing</span>
        <div className="inline-flex items-center rounded-xl bg-white/60 p-1 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/40 dark:ring-slate-700">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              billing === "monthly"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("quarterly")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              billing === "quarterly"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
            )}
          >
            Quarterly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              billing === "yearly"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
            )}
          >
            Yearly
          </button>
        </div>
        {billing === "yearly" ? <Badge tone="success">Save 60%</Badge> : null}
        {billing === "quarterly" ? <Badge tone="success">Save 50%</Badge> : null}
        {billing === "monthly" ? <Badge tone="success">Save 40%</Badge> : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Currency</span>
        <div className="inline-flex items-center rounded-xl bg-white/60 p-1 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/40 dark:ring-slate-700">
          <button
            type="button"
            onClick={() => setCurrency("EUR")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              currency === "EUR"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
            )}
          >
            EUR
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              currency === "USD"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
            )}
          >
            USD
          </button>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">USD is an estimate.</span>
      </div>
    </div>
  );
}

function SegmentedTabs({
  value,
  onChange,
  items,
}: {
  value: Segment;
  onChange: (v: Segment) => void;
  items: { id: Segment; label: string; description: string }[];
}) {
  return (
    <div className="rounded-2xl bg-white/60 p-1 ring-1 ring-inset ring-slate-200 backdrop-blur dark:bg-slate-900/40 dark:ring-slate-700">
      <div role="tablist" className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {items.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                "rounded-xl px-4 py-3 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                active
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700"
                  : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-950/60"
              )}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PricingCard({ plan, billing, currency, emphasized }: { plan: Plan; billing: BillingCycle; currency: Currency; emphasized?: boolean }) {
  const { primary, original, suffix, sub } = calcDisplayPrice(plan.price, billing, currency);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white/70 p-6 ring-1 ring-inset ring-slate-200 backdrop-blur dark:bg-slate-900/50 dark:ring-slate-700 transition-all duration-300 hover:shadow-xl",
        emphasized && "ring-2 ring-indigo-500/50 dark:ring-indigo-400/40 scale-[1.02] shadow-lg"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pt-[17px]">
          <Badge tone="primary" className="bg-indigo-600 text-white dark:bg-indigo-500 px-3 py-1 shadow-sm">Most Popular</Badge>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{plan.title}</h3>
          {plan.badge ? <Badge tone={plan.badge.tone}>{plan.badge.label}</Badge> : null}
        </div>
      </div>

      {plan.description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 h-10">{plan.description}</p>
      )}

      <div className="mt-5">
        <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
          {original && (
            <div className="pb-1 text-lg line-through text-slate-400 dark:text-slate-500">
              {formatMoney(original, currency)}
            </div>
          )}
          <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{primary}</div>
          <div className="pb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{suffix}</div>
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</div>
      </div>

      <ul className="mt-5 space-y-2">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {plan.bestFor && (
        <div className="mt-5 rounded-2xl bg-slate-50/70 p-3 text-sm text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/30 dark:text-slate-200 dark:ring-slate-800">
          <span className="font-semibold">Best for:</span> {plan.bestFor}
        </div>
      )}

      {plan.finePrint ? <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">{plan.finePrint}</div> : null}

      <div className="mt-6">
        <Button variant={plan.cta.variant || "secondary"} className="w-full justify-center">
          {plan.cta.label}
        </Button>
      </div>
    </div>
  );
}

function CalloutPanel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/10 via-sky-600/10 to-emerald-600/10 p-6 ring-1 ring-inset ring-slate-200 dark:from-indigo-400/10 dark:via-sky-400/10 dark:to-emerald-400/10 dark:ring-slate-700">
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-indigo-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/40 dark:text-indigo-200 dark:ring-slate-700">
            {icon}
          </span>
        ) : null}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-base text-gray-600 dark:text-gray-400 leading-7">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function ComparisonTable({ title, columns, rows }: { title: string; columns: string[]; rows: { label: string; values: (React.ReactNode | string)[] }[] }) {
  return (
    <section className="mt-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-6">{title}</h3>

        <div className="hidden overflow-hidden rounded-3xl bg-white/70 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-700 md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/70 dark:bg-slate-950/30">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Feature</th>
                  {columns.map((c) => (
                    <th key={c} className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {rows.map((r) => (
                  <tr key={r.label} className="align-top">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {columns.map((col, colIndex) => (
            <details
              key={col}
              className="group rounded-3xl bg-white/70 p-5 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-700"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{col}</div>
                  </div>
                  <ChevronDown className="text-slate-500 transition group-open:rotate-180 h-5 w-5" />
                </div>
              </summary>

              <div className="mt-4 space-y-3">
                {rows.map((r) => (
                  <div key={r.label} className="rounded-2xl bg-slate-50/70 p-3 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/30 dark:ring-slate-800">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">{r.label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{r.values[colIndex]}</div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [segment, setSegment] = useState<Segment>("platform");
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const platformPlans: Plan[] = useMemo(
    () => [
      {
        id: "community",
        title: "Community (Self-Hosted)",
        badge: { label: "Free forever", tone: "success" },
        description: "Full suite, unlimited users. You run it. You own it.",
        price: { kind: "free" },
        highlights: [
          "Full suite: LexDraft, PulseTasks, SwiftCall, Mail + Calendar",
          "Unlimited users",
          "Self-hosted deploy",
          "No support (community only)",
          "Bring your own AI keys",
        ],
        bestFor: "teams with DevOps",
        cta: { label: "Deploy self-hosted", variant: "outline" },
      },
      {
        id: "starter",
        title: "Starter (Managed)",
        description: "Managed hosting and a smooth path to production.",
        price: { kind: "paid", amountMonthly: 15, unit: "workspace" },
        highlights: ["Hosting, updates, backups", "Monitoring", "Basic email support"],
        bestFor: "Small teams getting started",
        cta: { label: "Start Starter", variant: "secondary" },
      },
      {
        id: "team",
        title: "Team (Managed)",
        description: "Support that keeps teams moving.",
        price: { kind: "paid", amountMonthly: 39, unit: "workspace" },
        highlights: ["Everything in Starter", "Priority support", "SSO basics"],
        bestFor: "Growing teams",
        cta: { label: "Start Team", variant: "primary" },
        popular: true,
      },
      {
        id: "org",
        title: "Organization (Managed)",
        badge: { label: "Enterprise-ready", tone: "warning" },
        description: "Compliance knobs, advanced identity, and stronger guarantees.",
        price: { kind: "paid", amountMonthly: 99, unit: "workspace" },
        highlights: ["Everything in Team", "Advanced SSO/SAML", "Compliance configs"],
        bestFor: "Large organizations",
        cta: { label: "Talk to us", variant: "secondary" },
      },
    ],
    []
  );

  const aiGeneralPlans: Plan[] = useMemo(
    () => [
      {
        id: "ai-byo",
        title: "AI Free (BYO Key)",
        badge: { label: "No surprise bills", tone: "success" },
        description: "Turn on AI with your own provider keys.",
        price: { kind: "free" },
        highlights: [
          "Use OpenAI / Anthropic / OpenRouter",
          "Or local LLM via OpenAI-compatible API",
          "Orchestrator available (uses your keys)",
        ],
        bestFor: "Teams who manage their own AI costs",
        cta: { label: "Use BYO AI", variant: "outline" },
        finePrint: "You pay your model provider directly.",
      },
      {
        id: "ai-managed",
        title: "AI Managed",
        badge: { label: "Best value", tone: "primary" },
        description: "Great default models with fair, predictable limits.",
        price: { kind: "paid", amountMonthly: 10, unit: "user" },
        highlights: [
          "Orchestrator + caching + model fallback",
          "Fair limits (soft caps)",
          "Great default models",
        ],
        bestFor: "Teams who want simplicity",
        cta: { label: "Start AI Managed", variant: "primary" },
        popular: true,
      },
      {
        id: "ai-pro",
        title: "AI Pro",
        description: "For heavy AI teams and high-throughput workflows.",
        price: { kind: "paid", amountMonthly: 25, unit: "user" },
        highlights: ["Higher limits", "Priority routing", "Faster response lanes"],
        bestFor: "Power users and heavy AI teams",
        cta: { label: "Start AI Pro", variant: "secondary" },
      },
    ],
    []
  );

  const aiLegalPlans: Plan[] = useMemo(
    () => [
      {
        id: "legal-byo",
        title: "Legal AI BYO",
        description: "Connect your own legal model/API.",
        price: { kind: "free" },
        highlights: ["Use your own legal model/API", "Keep data + control in your environment"],
        bestFor: "Firms with existing AI infrastructure",
        cta: { label: "Connect Legal BYO", variant: "outline" },
      },
      {
        id: "legal-pro",
        title: "Legal AI Pro",
        badge: { label: "For compliance teams", tone: "warning" },
        description: "Workspace add-on tuned for legal workflows.",
        price: { kind: "paid", amountMonthly: 99, unit: "workspace" },
        highlights: ["Legal orchestrator tuned", "Explainability mode", "Audit logs"],
        bestFor: "Law firms and legal departments",
        cta: { label: "Add Legal AI Pro", variant: "primary" },
      },
      {
        id: "legal-firm",
        title: "Legal AI Firm",
        badge: { label: "For law firms", tone: "primary" },
        description: "Jurisdiction packs and priority templates.",
        price: { kind: "paid", amountMonthly: 199, unit: "workspace" },
        highlights: ["Jurisdiction packs", "Compliance mode", "Priority updates & templates"],
        bestFor: "Large firms with compliance needs",
        cta: { label: "Add Legal AI Firm", variant: "secondary" },
      },
    ],
    []
  );

  const automationPlans: Plan[] = useMemo(
    () => [
      {
        id: "auto-basic",
        title: "Automation Basic",
        badge: { label: "Included", tone: "neutral" },
        description: "Simple flows without any lock-in.",
        price: { kind: "free" },
        highlights: ["Manual triggers", "Simple flows", "3 active automations"],
        bestFor: "Individuals and small teams",
        cta: { label: "Use Basic", variant: "outline" },
      },
      {
        id: "auto-plus",
        title: "Automation Plus",
        badge: { label: "Best value", tone: "primary" },
        description: "Common cross-app workflows that save hours.",
        price: { kind: "paid", amountMonthly: 29, unit: "workspace" },
        highlights: [
          "Task → email → calendar flows",
          "Auto notifications",
          "Templates",
          "Unlimited active automations"
        ],
        bestFor: "Teams who want efficiency",
        cta: { label: "Add Plus", variant: "primary" },
        popular: true,
      },
      {
        id: "auto-autopilot",
        title: "Automation Autopilot",
        badge: { label: "Future of work", tone: "warning" },
        description: "Agents that act with permissions and auditability.",
        price: { kind: "paid", amountMonthly: 79, unit: "workspace" },
        highlights: [
          "AI agents with permissions",
          "MCP actions",
          "Auto-scheduling",
          "Meeting MoM → tasks → notifications",
        ],
        bestFor: "Teams who want AI to work for them",
        cta: { label: "Add Autopilot", variant: "secondary" },
      },
    ],
    []
  );

  const segments = useMemo(
    () => [
      {
        id: "platform" as const,
        label: "Platform",
        description: "Self-hosted vs managed hosting & support",
      },
      {
        id: "ai" as const,
        label: "AI",
        description: "General AI + Legal AI add-ons",
      },
      {
        id: "automation" as const,
        label: "Automation",
        description: "Workflows + Autopilot features",
      },
    ],
    []
  );

  const platformComparisonRows = useMemo(
    () => [
      {
        label: "Unlimited users",
        values: [
          <span key="c" className="inline-flex items-center gap-2">
            <Check className="text-emerald-600 dark:text-emerald-400 h-4 w-4" /> Yes
          </span>,
          "Unlimited",
          "Unlimited",
          "Unlimited",
        ],
      },
      {
        label: "Hosting by us",
        values: ["—", <Check key="s" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />, <Check key="t" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />, <Check key="o" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />],
      },
      {
        label: "Backups/updates",
        values: ["You manage", <Check key="s" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />, <Check key="t" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />, <Check key="o" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />],
      },
      {
        label: "Support level",
        values: ["Community", "Basic email", "Priority", "Enterprise"],
      },
      {
        label: "SSO/SAML",
        values: ["Self-managed", "SSO basics", "SSO basics", "Advanced SSO/SAML"],
      },
      {
        label: "Compliance configs",
        values: ["Self-managed", "—", "—", <Check key="o" className="text-emerald-600 dark:text-emerald-400 h-4 w-4" />],
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        question: "Is self-hosting really free forever?",
        answer: "Yes. The Community (Self-Hosted) plan is free forever with no user limits. It includes full suite, but it comes with zero support. You get the full product suite — LexDraft, PulseTasks, SwiftCall, Mail & Calendar, VS Code plugin, MCP server, and workflow automations.",
      },
      {
        question: "Can I use my own OpenAI/Anthropic/OpenRouter keys?",
        answer: "Yes! We support bring-your-own-keys (BYO) for all major AI providers including OpenAI, Anthropic, OpenRouter, and any OpenAI-compatible API (including local LLMs like Ollama). Your keys, your costs, your control.",
      },
      {
        question: "Do you charge per token?",
        answer: "No. We never charge per token. Our managed AI plans have simple per-user pricing with soft limits. We use intelligent caching and deduplication to reduce costs, not inflate them.",
      },
      {
        question: "How do soft limits work?",
        answer: "Soft limits are designed to prevent abuse while giving you flexibility. If you occasionally exceed them, nothing breaks — we just reach out to discuss upgrading or optimizing usage. There are no surprise bills or automatic overages.",
      },
      {
        question: "Can we run AI locally/offline?",
        answer: "Yes. You can configure any OpenAI-compatible API endpoint, including local LLMs like Ollama, LM Studio, or vLLM. This works great for air-gapped environments or privacy-sensitive use cases.",
      },
      {
        question: "What happens if we cancel?",
        answer: "Your data is always yours. Export anytime in standard formats. If you're on managed hosting and cancel, you can self-host with the same data. We don't hold your data hostage.",
      },
      {
        question: "Is Legal AI a replacement for a lawyer?",
        answer: "No. Legal AI is an assistance tool designed to help legal professionals work more efficiently. It provides drafting help, analysis, and suggestions, but all outputs should be reviewed by qualified legal professionals. It is not a substitute for legal advice.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 font-sans">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-3xl" />
      </div>

      <header className="relative sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">LexDraft Suite</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Open-source • Self-hostable • Trust-first</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary">View pricing</Button>
              <Button>Start self-hosting</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 pt-20">
          <div className="rounded-3xl bg-white/50 p-7 ring-1 ring-inset ring-slate-200 backdrop-blur sm:p-10 dark:bg-slate-900/40 dark:ring-slate-700">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                <Badge tone="success">Self-host stays free forever</Badge>
                <Badge tone="neutral">No per-token billing</Badge>
                <Badge tone="primary">BYO keys or Managed AI</Badge>
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
                Simple, honest pricing for work that thinks with you.
              </h1>
              <p className="mt-4 text-pretty text-base text-slate-600 sm:text-lg dark:text-slate-300">
                Self-host for free. Pay only for support, hosting, or intelligence.
              </p>
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button>Start self-hosting</Button>
                <Button variant="secondary">Try managed hosting</Button>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                {[
                  { icon: "🧩", text: "Self-host stays free forever" },
                  { icon: "🔑", text: "Bring your own AI keys" },
                  { icon: "🧾", text: "No per-token billing" },
                  { icon: "📦", text: "Export anytime" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="rounded-2xl bg-white/60 p-4 text-sm text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/30 dark:text-slate-200 dark:ring-slate-800"
                  >
                    <div className="text-base" aria-hidden="true">{b.icon}</div>
                    <div className="mt-1 font-semibold">{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <SectionHeader title="Pick what you need. Keep what you control." subtitle="Platform hosting/support is workspace-based. AI is optional (BYO keys or managed). Legal AI and Automation are add-ons." />

          <div className="mt-8 space-y-4">
            <SegmentedTabs value={segment} onChange={setSegment} items={segments} />
            <ToggleGroup billing={billing} setBilling={setBilling} currency={currency} setCurrency={setCurrency} />
          </div>

          <div className="mt-6 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-inset ring-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:ring-amber-800">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                🎉 Founding pricing — limited time
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Early adopters get up to 60% off during our launch period.
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Discounts apply during the first year. Renewals return to standard pricing.
              </div>
            </div>
          </div>

          <div className="mt-10">
            <AnimatePresence mode="wait">
              {segment === "platform" && (
                <motion.div
                  key="platform"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mx-auto max-w-3xl text-center mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                      Platform pricing (workspace-based)
                    </h2>
                  </div>

                  <div className="mx-auto max-w-7xl grid grid-cols-1 gap-5 lg:grid-cols-4">
                    {platformPlans.map((p) => (
                      <PricingCard
                        key={p.id}
                        plan={p}
                        billing={billing}
                        currency={currency}
                        emphasized={p.id === "team"}
                      />
                    ))}
                  </div>

                  <ComparisonTable
                    title="Platform feature comparison"
                    columns={["Community", "Starter", "Team", "Organization"]}
                    rows={platformComparisonRows}
                  />
                </motion.div>
              )}

              {segment === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-16"
                >
                  <div>
                    <div className="mx-auto max-w-3xl text-center mb-8">
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                        General AI
                      </h2>
                    </div>

                    <div className="mx-auto max-w-7xl grid grid-cols-1 gap-5 lg:grid-cols-3">
                      {aiGeneralPlans.map((p) => (
                        <PricingCard
                          key={p.id}
                          plan={p}
                          billing={billing}
                          currency={currency}
                          emphasized={p.id === "ai-managed"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center mb-8">
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                        Legal AI
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                      {aiLegalPlans.map((p) => (
                        <PricingCard
                          key={p.id}
                          plan={p}
                          billing={billing}
                          currency={currency}
                          emphasized={p.id === "legal-firm"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mx-auto max-w-7xl grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <CalloutPanel title="How AI billing works" icon={<Shield className="h-5 w-5" />}>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="mt-0.5 text-emerald-600 dark:text-emerald-400 h-4 w-4" />
                          <span className="font-semibold">No per-token billing</span>
                          <span className="text-slate-600 dark:text-slate-300">— managed AI is flat-rate.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="mt-0.5 text-emerald-600 dark:text-emerald-400 h-4 w-4" />
                          <span className="font-semibold">Bring your own keys anytime</span>
                          <span className="text-slate-600 dark:text-slate-300">— switch providers without lock-in.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="mt-0.5 text-emerald-600 dark:text-emerald-400 h-4 w-4" />
                          <span className="font-semibold">Soft limits</span>
                          <span className="text-slate-600 dark:text-slate-300">— prevent abuse instead of surprise bills.</span>
                        </li>
                      </ul>
                    </CalloutPanel>

                    <CalloutPanel title="Local/offline-friendly" icon={<Server className="h-5 w-5" />}>
                      Run models locally with any OpenAI-compatible API. Keep sensitive work inside your network, with same suite integrations.
                    </CalloutPanel>

                    <CalloutPanel title="Trust-first defaults" icon={<Sparkles className="h-5 w-5" />}>
                      Clear pricing, export-anytime data model, and self-hosting as default safety valve. Your team stays in control.
                    </CalloutPanel>
                  </div>

                  <div className="max-w-4xl mx-auto">
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Important:</strong> Legal AI is an assistance tool for legal professionals. It is not a replacement for qualified legal advice. All outputs should be reviewed by licensed attorneys.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {segment === "automation" && (
                <motion.div
                  key="automation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mx-auto max-w-3xl text-center mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                      Automation & Workflows
                    </h2>
                  </div>

                  <div className="mx-auto max-w-7xl grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {automationPlans.map((p) => (
                      <PricingCard
                        key={p.id}
                        plan={p}
                        billing={billing}
                        currency={currency}
                        emphasized={p.id === "auto-plus"}
                      />
                    ))}
                  </div>

                  <div className="mt-10 max-w-4xl mx-auto">
                    <div className="mx-auto max-w-3xl text-center mb-6">
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">What you can automate</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        "Create tasks from emails",
                        "Sync calendar with tasks",
                        "Auto-generate meeting minutes",
                        "Send notifications on deadlines",
                        "Create documents from templates",
                        "Route tasks to team members",
                        "Schedule follow-up meetings",
                        "Generate weekly summaries",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Check className="text-indigo-500 flex-shrink-0 h-4 w-4" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-100 to-white dark:from-slate-900 dark:to-slate-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Suggested Bundles" subtitle="Popular configurations with clear assumptions. No hidden token charges, no surprise bills." />

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {[
                {
                  title: "Startup Bundle",
                  badge: "Popular",
                  fromMonthly: 78,
                  assumptions: ["Managed Platform: Team (€39 / workspace / month)", "AI Managed: example for 3 users (3 × €10 = €30)", "Automation Plus (€29 / workspace / month)"],
                },
                {
                  title: "Law Firm Bundle",
                  badge: "For law firms",
                  fromMonthly: 224,
                  assumptions: ["Platform: Self-hosted (€0)", "Legal AI Firm (€199 / workspace / month)", "AI Pro: example for 1 user (1 × €25 = €25)"],
                },
                {
                  title: "Power User",
                  badge: "Best value",
                  fromMonthly: 29,
                  assumptions: ["Platform: Self-hosted (€0)", "General AI: BYO keys (€0)", "Automation Plus (€29 / workspace / month)"],
                },
                {
                  title: "All Features",
                  badge: "Complete",
                  fromMonthly: 54,
                  assumptions: ["Platform: Starter (€15 / workspace / month)", "AI Managed: example for 1 user (1 × €10 = €10)", "Automation Plus (€29 / workspace / month)"],
                },
                {
                  title: "Legal Startup",
                  badge: "For startups",
                  fromMonthly: 154,
                  assumptions: ["Platform: Self-hosted (€0)", "Legal AI Pro (€99 / workspace / month)", "AI Managed: example for 2 users (2 × €10 = €20)", "Automation Plus (€29 / workspace / month)"],
                },
                {
                  title: "Automation Team",
                  badge: "For efficiency",
                  fromMonthly: 108,
                  assumptions: ["Platform: Team (€39 / workspace / month)", "AI Managed: example for 4 users (4 × €10 = €40)", "Automation Autopilot (€79 / workspace / month)"],
                },
              ].map((bundle) => (
                <div
                  key={bundle.title}
                  className="relative overflow-hidden rounded-3xl bg-white/70 p-6 ring-1 ring-inset ring-slate-200 backdrop-blur dark:bg-slate-900/50 dark:ring-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{bundle.title}</h3>
                        <Badge tone="primary">{bundle.badge}</Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                          <div className="text-lg line-through text-slate-400 dark:text-slate-500">
                            {formatMoney(
                              bundle.fromMonthly * (currency === "EUR" ? 1 : EUR_TO_USD) *
                              (billing === "yearly" ? 12 : billing === "quarterly" ? 3 : 1),
                              currency
                            )}
                          </div>
                          <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            {formatMoney(
                              bundle.fromMonthly * (currency === "EUR" ? 1 : EUR_TO_USD) *
                              (billing === "yearly" ? 12 * (1 - YEARLY_DISCOUNT) :
                               billing === "quarterly" ? 3 * (1 - QUARTERLY_DISCOUNT) :
                               (1 - MONTHLY_DISCOUNT)),
                              currency
                            )}
                          </div>
                          <span className="text-base font-normal text-slate-500 pb-1">
                            {" / "}{billing === "yearly" ? "year" : billing === "quarterly" ? "quarter" : "month"}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {billing === "yearly" ? "⭐ 60% off · Best value" :
                           billing === "quarterly" ? "50% off · Quarterly" :
                           "40% off · First year"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-950/30 dark:ring-slate-800">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Assumptions</div>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {bundle.assumptions.map((a) => (
                        <li key={a} className="flex items-start gap-2">
                          <Check className="mt-0.5 text-emerald-600 dark:text-emerald-400 h-4 w-4" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <Button variant="primary" className="w-full justify-center">Build this bundle</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about pricing and billing.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </section>

        <section id="final-cta" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900 p-8 shadow-sm sm:p-10 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">Start self-hosting in 10 minutes</h2>
                <p className="mt-3 text-pretty text-base text-white/80">
                  Self-host is free forever with unlimited users—perfect for teams that want full control. Prefer managed? We can host, update, back up, and support your workspace.
                </p>
                <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button>Start self-hosting</Button>
                  <Button variant="secondary">Try managed hosting</Button>
                </div>
                <div className="mt-5 text-xs text-white/70">
                  No per-token billing • BYO keys supported • Soft limits • Export anytime
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-inset ring-white/15">
                <div className="text-sm font-semibold text-white">What you get</div>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 text-emerald-300 h-4 w-4" /> LexDraft + PulseTasks + SwiftCall + Mail + Calendar
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 text-emerald-300 h-4 w-4" /> VS Code plugin + MCP server
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 text-emerald-300 h-4 w-4" /> Workflow automations + meeting minutes
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">LexDraft Suite</span>
              <span aria-hidden="true">•</span>
              <span>Self-hostable productivity suite</span>
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-slate-700 hover:underline dark:hover:text-slate-200" href="#">FAQ</a>
              <a className="hover:text-slate-700 hover:underline dark:hover:text-slate-200" href="#">Platform</a>
              <a className="hover:text-slate-700 hover:underline dark:hover:text-slate-200" href="#">AI</a>
              <a className="hover:text-slate-700 hover:underline dark:hover:text-slate-200" href="#">Automation</a>
            </div>
          </footer>

          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Founding discounts apply during the launch period. Prices renew at standard rates unless renewed under an active promotion.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
