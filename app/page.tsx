import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import {
  Scale,
  FileText,
  GitBranch,
  History,
  Bot,
  CheckCircle2,
  Shield,
  Server,
  ChevronRight,
  Terminal,
  FileCheck,
  Lock,
  Plus,
  Search,
  MoreVertical
} from 'lucide-react';

const buttonBaseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary/90";
const outlineBtn = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
const btnLg = "h-11 px-8 text-lg";

function MockApp() {
  return (
    <div className="relative rounded-xl border bg-card text-card-foreground shadow-xl overflow-hidden aspect-[4/3] md:aspect-[16/10]">
      {/* App Header */}
      <div className="flex h-10 items-center border-b px-4 gap-4 bg-muted/30">
        <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400/80"></div>
            <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-mono">lexdraft_workspace — master</div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-16 md:w-48 border-r bg-muted/10 hidden sm:flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground hidden md:inline">PROJECTS</span>
                <Plus className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1 p-2 space-y-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded text-sm ${i === 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
                        <FileText className="h-4 w-4" />
                        <span className="hidden md:inline truncate">NDA_Draft_v{i}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Editor Toolbar */}
            <div className="h-10 border-b flex items-center justify-between px-4 bg-background">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">NDA_Google_v1.md</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-medium">Edited</span>
                </div>
                <div className="flex gap-2">
                    <div className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"><Search className="h-3 w-3" /></div>
                    <div className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"><MoreVertical className="h-3 w-3" /></div>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden bg-background relative">
                <p className="text-muted-foreground mb-4">// CONFIDENTIAL</p>
                <h1 className="text-lg font-bold text-foreground mb-4">NON-DISCLOSURE AGREEMENT</h1>
                <p className="mb-4">
                    This Agreement is made on <span className="bg-primary/10 text-primary px-1 rounded">2023-10-24</span> between the parties...
                </p>
                <div className="pl-4 border-l-2 border-primary/30 my-4 py-1 bg-primary/5 rounded-r">
                   <p className="text-foreground">
                       1.1 "Confidential Information" shall mean all information disclosed by one party to the other...
                   </p>
                </div>
                <p className="text-muted-foreground opacity-50">
                    [AI Suggestion: Consider adding a clause about data retention periods to comply with GDPR...]
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 border-b">
          <div className="container relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Draft legal documents <span className="text-primary">faster</span>, with control.
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  The enterprise-grade AI workspace for legal teams. Project-based workflow, version control, and secure on-premise deployment options.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} ${btnLg}`}>
                  Open the Workspace <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/blog" className={`${buttonBaseClass} ${outlineBtn} ${btnLg}`}>
                  Read the Blog
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Secure</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Versioned</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Collaborative</div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-50 rounded-full" />
              <MockApp />
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-b bg-muted/30 py-8">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Not legal advice", icon: Scale },
                { label: "Audit-friendly logs", icon: FileCheck },
                { label: "On-prem capable", icon: Server },
                { label: "Data retention controls", icon: Shield }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                  <item.icon className="h-5 w-5 opacity-70" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to draft with confidence</h2>
              <p className="text-lg text-muted-foreground">
                Built for legal professionals who demand precision, security, and efficiency.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Project-based Drafting",
                  description: "Organize multiple files, references, and versions into cohesive projects.",
                  icon: FileText
                },
                {
                  title: "WYSIWYG Markdown",
                  description: "Distraction-free editing with powerful Vditor integration and clean output.",
                  icon: Terminal
                },
                {
                  title: "Diff & Apply",
                  description: "Review AI suggestions as diffs before applying them. Zero hallucinations in your final text.",
                  icon: GitBranch
                },
                {
                  title: "Flexible AI Models",
                  description: "Switch between global models (GPT-4) or specialized legal models instantly.",
                  icon: Bot
                },
                {
                  title: "Provider Choice",
                  description: "Connect via OpenRouter for variety or use Ollama for local privacy.",
                  icon: Server
                },
                {
                  title: "Version History",
                  description: "Every change is tracked. Restore previous versions with a single click.",
                  icon: History
                }
              ].map((feature, idx) => (
                <div key={idx} className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="py-20 md:py-32 bg-muted/30 border-y">
          <div className="container space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Start faster with templates</h2>
                <p className="text-lg text-muted-foreground">Standardized starting points for common legal documents.</p>
              </div>
              <Link href="/app" className={`${buttonBaseClass} ${outlineBtn} h-10 px-4 py-2`}>View all templates</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Non-Disclosure Agreement",
                "Employment Contract",
                "Commercial Lease",
                "Demand Letter",
                "Privacy Policy",
                "Terms of Service"
              ].map((tpl, idx) => (
                <div key={idx} className="flex flex-col justify-between rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center mb-4">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">{tpl}</h3>
                    <p className="text-sm text-muted-foreground">Standard form suitable for most jurisdictions.</p>
                  </div>
                  <Link href="/app" className={`${buttonBaseClass} hover:bg-accent hover:text-accent-foreground mt-6 w-full justify-between group h-10 px-4 py-2 flex items-center`}>
                    Start Draft <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section id="blog" className="py-20 md:py-32">
          <div className="container space-y-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center">Latest Insights</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "The Future of Legal AI: Beyond Generation",
                  date: "Oct 24, 2023",
                  tag: "Industry",
                  desc: "Why simple text generation isn't enough for legal workflows and how structured data matters."
                },
                {
                  title: "Implementing Local LLMs with Ollama",
                  date: "Oct 12, 2023",
                  tag: "Technical",
                  desc: "A guide to setting up secure, offline AI models for sensitive document processing."
                },
                {
                  title: "Understanding RAG in Legal Contexts",
                  date: "Sep 28, 2023",
                  tag: "Technology",
                  desc: "How Retrieval Augmented Generation improves accuracy in case law research."
                }
              ].map((post, idx) => (
                <Link key={idx} href="/blog" className="group cursor-pointer space-y-4">
                  <div className="aspect-video w-full rounded-xl bg-muted/50 border overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full">{post.tag}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{post.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-20 md:py-32 bg-slate-900 text-slate-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Enterprise-grade security by default</h2>
                <p className="text-lg text-slate-300">
                  Your data never leaves your control. LexDraft is designed from the ground up for privacy-conscious legal environments.
                </p>
                <ul className="space-y-4">
                  {[
                    "End-to-end encryption for all stored documents",
                    "Granular role-based access control (RBAC)",
                    "Comprehensive audit logs for all AI interactions",
                    "Self-hosted / On-premise deployment options",
                    "Zero-retention agreements with AI providers"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-800 p-8 border border-slate-700 shadow-2xl">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-400" /> Security at a glance
                </h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Encryption Standard</span>
                            <span className="font-mono text-emerald-400">AES-256</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Uptime SLA</span>
                            <span className="font-mono text-emerald-400">99.99%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[99.9%]"></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-slate-700 flex items-center justify-center">
                                <Server className="h-5 w-5 text-slate-300" />
                            </div>
                            <div>
                                <div className="font-medium">On-Premise Ready</div>
                                <div className="text-xs text-slate-400">Docker & Kubernetes support</div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
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
                    <Link href="/app" className={`${buttonBaseClass} ${outlineBtn} h-10 px-4 py-2 w-full`}>Get Started</Link>
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
                    <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} h-10 px-4 py-2 w-full`}>Start Free Trial</Link>
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
                    <Link href="/contact" className={`${buttonBaseClass} ${outlineBtn} h-10 px-4 py-2 w-full`}>Contact Sales</Link>
                </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
