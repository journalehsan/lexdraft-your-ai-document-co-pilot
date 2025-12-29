import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Shield, Lock, Server, Eye, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32 bg-slate-900 text-slate-50">
          <div className="container">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Enterprise-grade security</h1>
              <p className="text-xl text-slate-300">
                Your data never leaves your control. LexDraft is designed from ground up for privacy-conscious legal environments.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-16">
              {[
                {
                  title: "End-to-End Encryption",
                  description: "All data is encrypted in transit and at rest using industry-standard protocols.",
                  icon: Lock
                },
                {
                  title: "SOC 2 Compliant",
                  description: "We maintain SOC 2 Type II compliance to ensure highest security standards.",
                  icon: Shield
                },
                {
                  title: "On-Premise Option",
                  description: "Enterprise customers can deploy LexDraft on their own infrastructure.",
                  icon: Server
                },
                {
                  title: "Privacy First",
                  description: "We never sell your data. Your documents remain private and are never used to train AI.",
                  icon: Eye
                }
              ].map((feature, idx) => (
                <div key={idx} className="relative rounded-xl bg-slate-800 p-6 border border-slate-700">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Security Practices</h2>
                <ul className="space-y-3">
                  {[
                    "Regular security audits and penetration testing",
                    "Multi-factor authentication (MFA) support",
                    "Role-based access control (RBAC)",
                    "Automated backups and disaster recovery",
                    "24/7 security monitoring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Compliance</h2>
                <p className="text-muted-foreground mb-6">
                  LexDraft is compliant with major data protection regulations including:
                </p>
                <ul className="space-y-3">
                  {[
                    "GDPR (General Data Protection Regulation)",
                    "CCPA (California Consumer Privacy Act)",
                    "HIPAA (for healthcare customers)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Security at a glance</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Encryption Standard</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">AES-256</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime SLA</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">99.99%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99.9%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
