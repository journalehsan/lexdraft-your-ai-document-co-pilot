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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-serif text-foreground antialiased selection:bg-blue-900/20 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 border-b border-slate-200">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-slate-100/40 rounded-full blur-3xl"></div>
          
          <div className="container relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-900 font-light text-sm tracking-wider">
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                  AI-POWERED LEGAL DRAFTING
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-blue-950">
                  Professional document drafting with <span className="font-semibold text-blue-800">intelligent assistance</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-[600px] leading-relaxed font-light">
                  The enterprise-grade AI workspace for legal teams. Experience WYSIWYG editing, intelligent drafting, and secure collaboration in one platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} ${btnLg} bg-blue-900 hover:bg-blue-800 text-white font-light`}>
                  Start Writing <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/blog" className={`${buttonBaseClass} ${outlineBtn} ${btnLg} border-slate-300 text-slate-700 hover:bg-slate-50 font-light`}>
                  Read Legal & AI Insights
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-600 font-light">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Enterprise Security</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Version Control</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Team Collaboration</div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[700px] lg:max-w-none">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-100/40 to-slate-100/40 blur-3xl opacity-60 rounded-2xl"></div>
              <MockApp />
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-slate-50/50 py-12">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Not legal advice", icon: Scale },
                { label: "Audit-friendly logs", icon: FileCheck },
                { label: "On-prem capable", icon: Server },
                { label: "Data retention controls", icon: Shield }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center gap-3 text-sm font-light text-slate-700">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-blue-700" />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32">
          <div className="container space-y-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-blue-900 font-light text-sm tracking-wider">
                <span className="w-8 h-[1px] bg-blue-900"></span>
                FEATURES
                <span className="w-8 h-[1px] bg-blue-900"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950">Everything you need to draft with <span className="font-semibold">professional confidence</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Built for legal professionals who demand precision, security, and intelligent assistance in their document workflows.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Project-based Drafting",
                  description: "Organize multiple files, references, and versions into cohesive legal projects with intelligent structure.",
                  icon: FileText
                },
                {
                  title: "WYSIWYG Editor",
                  description: "Distraction-free editing with Typora-inspired interface and powerful Vditor integration for clean output.",
                  icon: Terminal
                },
                {
                  title: "Diff & Apply",
                  description: "Review AI suggestions as diffs before applying them. Zero hallucinations in your final legal text.",
                  icon: GitBranch
                },
                {
                  title: "Flexible AI Models",
                  description: "Switch between global models (GPT-4) or specialized legal AI models for optimal drafting accuracy.",
                  icon: Bot
                },
                {
                  title: "Provider Choice",
                  description: "Connect via OpenRouter for variety or use Ollama for complete privacy and on-premise deployment.",
                  icon: Server
                },
                {
                  title: "Version History",
                  description: "Every change is tracked with comprehensive audit logs. Restore previous versions with a single click.",
                  icon: History
                }
              ].map((feature, idx) => (
                <div key={idx} className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-light text-blue-950">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
          <div className="container space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-900 font-light text-sm tracking-wider">
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                  LEGAL TEMPLATES
                  <span className="w-8 h-[1px] bg-blue-900"></span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950">Start faster with <span className="font-semibold text-blue-800">AI-enhanced templates</span></h2>
                <p className="text-xl text-slate-600 leading-relaxed font-light max-w-2xl">
                  Standardized starting points for common legal documents with intelligent AI assistance for customization.
                </p>
              </div>
              <Link href="/app" className={`${buttonBaseClass} ${outlineBtn} h-12 px-8 border-slate-300 text-slate-700 hover:bg-slate-50 font-light`}>View all templates</Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Non-Disclosure Agreement",
                "Employment Contract",
                "Commercial Lease",
                "Demand Letter",
                "Privacy Policy",
                "Terms of Service"
              ].map((tpl, idx) => (
                <div key={idx} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                        <FileText className="h-6 w-6 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-light text-blue-950">{tpl}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-light">Standard legal form with AI-powered customization for your specific jurisdiction and requirements.</p>
                  </div>
                  <Link href="/app" className={`${buttonBaseClass} bg-blue-900 hover:bg-blue-800 text-white mt-8 w-full justify-between group h-12 px-6 py-3 flex items-center font-light transition-colors`}>
                    Start Drafting <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 translate-x-0 group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section id="blog" className="py-24 md:py-32">
          <div className="container space-y-16">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 text-blue-900 font-light text-sm tracking-wider">
                <span className="w-8 h-[1px] bg-blue-900"></span>
                LEGAL & AI INSIGHTS
                <span className="w-8 h-[1px] bg-blue-900"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950">Latest insights on <span className="font-semibold text-blue-800">intelligent document engineering</span></h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "The Future of Legal Document Drafting with AI",
                  date: "Dec 29, 2025",
                  tag: "Legal AI",
                  desc: "How artificial intelligence is revolutionizing legal document preparation, making it faster and more accessible to professionals."
                },
                {
                  title: "Building a Better Document Editor: The Typora Experience",
                  date: "Dec 29, 2025",
                  tag: "Editor Design",
                  desc: "How LexDraft combines the simplicity of Typora with AI-powered features to create the next generation of document editing."
                },
                {
                  title: "10 Productivity Hacks for AI-Powered Document Creation",
                  date: "Dec 29, 2025",
                  tag: "Productivity",
                  desc: "Maximize your efficiency with these proven strategies for AI-assisted document creation and editing workflows."
                }
              ].map((post, idx) => (
                <Link key={idx} href="/blog" className="group cursor-pointer space-y-6">
                  <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 overflow-hidden relative shadow-sm group-hover:shadow-lg transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-slate-100/40 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-light text-slate-600">
                        <span className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full">{post.tag}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-light text-blue-950 group-hover:text-blue-700 transition-colors leading-tight">{post.title}</h3>
                    <p className="text-slate-600 line-clamp-3 font-light leading-relaxed">{post.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link href="/blog" className={`${buttonBaseClass} ${outlineBtn} h-12 px-8 border-slate-300 text-slate-700 hover:bg-slate-50 font-light`}>
                Explore All Legal & AI Insights
              </Link>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24 md:py-32 bg-gradient-to-br from-blue-950 to-slate-900 text-slate-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-light tracking-tight">Enterprise-grade security <span className="font-semibold">by default</span></h2>
                  <p className="text-xl text-slate-300 leading-relaxed font-light">
                    Your data never leaves your control. LexDraft is designed from the ground up for privacy-conscious legal environments with comprehensive security measures.
                  </p>
                </div>
                <ul className="space-y-6">
                  {[
                    "End-to-end encryption for all stored legal documents",
                    "Granular role-based access control (RBAC) for teams",
                    "Comprehensive audit logs for all AI interactions and changes",
                    "Self-hosted / On-premise deployment options for maximum privacy",
                    "Zero-retention agreements with AI providers for data protection"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-200 font-light leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-slate-800/50 backdrop-blur-sm p-10 border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-light mb-8 flex items-center gap-3 text-blue-100">
                    <Lock className="h-6 w-6 text-emerald-400" /> Security specifications
                </h3>
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

        {/* Pricing Section */}
        <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container space-y-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-blue-900 font-light text-sm tracking-wider">
                <span className="w-8 h-[1px] bg-blue-900"></span>
                PRICING
                <span className="w-8 h-[1px] bg-blue-900"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-blue-950">Simple, transparent pricing for <span className="font-semibold text-blue-800">legal professionals</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Choose the plan that fits your practice size and security requirements.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {/* Starter */}
                <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-light text-blue-950">Starter</h3>
                    <div className="mt-6 mb-8">
                        <span className="text-5xl font-light text-blue-950">$0</span>
                        <span className="text-slate-600 text-lg">/mo</span>
                    </div>
                    <p className="text-slate-600 mb-8 leading-relaxed font-light">Perfect for solo practitioners exploring AI-powered legal drafting.</p>
                    <ul className="space-y-4 mb-10 flex-1 text-sm font-light text-slate-700">
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> 5 Legal Projects</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Basic Legal Templates</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Community Support</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Basic AI Models</li>
                    </ul>
                    <Link href="/app" className={`${buttonBaseClass} ${outlineBtn} h-12 px-6 py-3 w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-light`}>Get Started</Link>
                </div>

                {/* Team */}
                <div className="rounded-2xl border-2 border-blue-900 bg-gradient-to-b from-blue-50 to-white p-10 shadow-lg flex flex-col relative transform scale-105 hover:scale-[1.07] transition-transform duration-300">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-xs font-light px-4 py-2 rounded-full tracking-wider">MOST POPULAR</div>
                    <h3 className="text-xl font-light text-blue-950">Team</h3>
                    <div className="mt-6 mb-8">
                        <span className="text-5xl font-light text-blue-950">$49</span>
                        <span className="text-slate-600 text-lg">/user/mo</span>
                    </div>
                    <p className="text-slate-600 mb-8 leading-relaxed font-light">For small firms needing collaboration and advanced AI models.</p>
                    <ul className="space-y-4 mb-10 flex-1 text-sm font-light text-slate-700">
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /> Unlimited Projects</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /> Advanced AI Models</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /> Collaborative Editing</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /> Priority Support</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" /> Advanced Templates</li>
                    </ul>
                    <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} h-12 px-6 py-3 w-full bg-blue-900 hover:bg-blue-800 text-white font-light`}>Start Free Trial</Link>
                </div>

                {/* On-Prem */}
                <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-light text-blue-950">Enterprise</h3>
                    <div className="mt-6 mb-8">
                        <span className="text-5xl font-light text-blue-950">Custom</span>
                    </div>
                    <p className="text-slate-600 mb-8 leading-relaxed font-light">Full control for enterprise compliance and security requirements.</p>
                    <ul className="space-y-4 mb-10 flex-1 text-sm font-light text-slate-700">
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Self-hosted Deployment</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Local LLM (Ollama) Support</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> SSO / SAML Integration</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Dedicated Account Manager</li>
                        <li className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> Custom SLA</li>
                    </ul>
                    <Link href="/contact" className={`${buttonBaseClass} ${outlineBtn} h-12 px-6 py-3 w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-light`}>Contact Sales</Link>
                </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
