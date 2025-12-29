import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { PricingTable } from '@/components/marketing/PricingTable';
import { query } from '@/lib/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const result = await query(
    `SELECT id, name, slug, description, price_cents, price_display, price_suffix,
            cta_label, cta_href, is_featured, features
     FROM pricing_plans
     ORDER BY sort_order ASC, name ASC`
  );
  const plans = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 font-serif text-foreground antialiased selection:bg-blue-900/20 dark:selection:bg-blue-400/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container">
            <PricingTable plans={plans} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
