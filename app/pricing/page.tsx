import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const buttonBaseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary/90";
const outlineBtn = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
const btnMd = "h-10 px-4 py-2";

export default function PricingPage() {
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
                {/* Starter */}
                <div className="rounded-xl border bg-card p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-lg">Starter</h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Perfect for solo practitioners exploring AI drafting.</p>
                    <ul className="space-y-3 mb-8 flex-1 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 5 Projects</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Basic Templates</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Community Support</li>
                    </ul>
                    <Link href="/app" className={`${buttonBaseClass} ${outlineBtn} ${btnMd} w-full`}>Get Started</Link>
                </div>

                {/* Team */}
                <div className="rounded-xl border-2 border-primary bg-card p-8 shadow-md flex flex-col relative scale-105">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    <h3 className="font-semibold text-lg text-primary">Team</h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold">$49</span>
                        <span className="text-muted-foreground">/user/mo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">For small firms needing collaboration and advanced models.</p>
                    <ul className="space-y-3 mb-8 flex-1 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited Projects</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Advanced AI Models</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Collaborative Editing</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority Support</li>
                    </ul>
                    <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} ${btnMd} w-full`}>Start Free Trial</Link>
                </div>

                {/* On-Prem */}
                <div className="rounded-xl border bg-card p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-lg">On-Premise</h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold">Custom</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Full control for enterprise compliance requirements.</p>
                    <ul className="space-y-3 mb-8 flex-1 text-sm">
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Self-hosted Deployment</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Local LLM (Ollama) Support</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> SSO / SAML</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Dedicated Account Manager</li>
                    </ul>
                    <Link href="/contact" className={`${buttonBaseClass} ${outlineBtn} ${btnMd} w-full`}>Contact Sales</Link>
                </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
