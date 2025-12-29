import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Shield, Lock, Server, Eye, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 font-serif text-foreground antialiased selection:bg-blue-900/20 dark:selection:bg-blue-400/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-950 to-slate-900 text-slate-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950 dark:text-blue-100">Enterprise-grade security <span className="font-semibold text-blue-800 dark:text-blue-300">by default</span></h2>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                Your data never leaves your control. LexDraft is designed from the ground up for privacy-conscious legal environments with comprehensive security measures.
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
                <div key={idx} className="relative rounded-xl bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700 hover:border-blue-600/30 transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-light text-blue-100">{feature.title}</h3>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-20">
              <div>
                <div className="flex items-center justify-center gap-3 text-blue-900 font-light text-sm tracking-wider mb-8">
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                  SECURITY PRACTICES
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                </div>
                 <h2 className="text-4xl font-light tracking-tight text-blue-950 dark:text-blue-100 mb-12 text-center">Comprehensive security measures for <span className="font-semibold text-blue-800 dark:text-blue-300">legal professionals</span></h2>
                <ul className="space-y-6">
                  {[
                    "Regular security audits and penetration testing",
                    "Multi-factor authentication (MFA) support",
                    "Role-based access control (RBAC)",
                    "Automated backups and disaster recovery",
                    "24/7 security monitoring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 font-light leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

               <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/30 border border-blue-200 dark:border-blue-800 p-10 shadow-sm">
                <div className="flex items-center gap-3 text-blue-900 font-light text-sm tracking-wider mb-6">
                  <span className="w-6 h-[1px] bg-blue-900"></span>
                  COMPLIANCE
                  <span className="w-6 h-[1px] bg-blue-900"></span>
                </div>
                 <h3 className="text-2xl font-light text-blue-950 dark:text-blue-100 mb-6">Industry-standard regulatory compliance</h3>
                 <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                  LexDraft is compliant with major data protection regulations including:
                </p>
                <ul className="space-y-4">
                  {[
                    "GDPR (General Data Protection Regulation)",
                    "CCPA (California Consumer Privacy Act)",
                    "HIPAA (for healthcare customers)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 mt-0.5 shrink-0" />
                       <span className="text-slate-700 dark:text-slate-300 font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-blue-950 to-slate-900 text-slate-50 p-10 shadow-xl border border-blue-900/20">
                <h3 className="text-2xl font-light mb-8 text-blue-100">Security specifications at a glance</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-light">Encryption Standard</span>
                      <span className="font-mono text-emerald-400 font-semibold">AES-256</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-full rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-light">Uptime SLA</span>
                      <span className="font-mono text-emerald-400 font-semibold">99.99%</span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[99.9%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-900/20">
                      <div className="h-12 w-12 rounded-xl bg-blue-900/50 flex items-center justify-center">
                        <Server className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <div className="font-medium text-blue-100">On-Premise Ready</div>
                        <div className="text-sm text-slate-400 font-light">Docker & Kubernetes deployment support</div>
                      </div>
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
