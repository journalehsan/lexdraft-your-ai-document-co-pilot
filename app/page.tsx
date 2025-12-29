import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { FileText, GitBranch, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your AI Document Co-Pilot
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your writing workflow with agentic drafting, intelligent document management,
            and seamless integration with OpenRouter and Ollama.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/app"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-semibold"
            >
              Open App
            </Link>
            <Link
              href="/blog"
              className="px-8 py-3 border border-border rounded-md hover:bg-accent transition-colors font-semibold"
            >
              Read Blog
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-lg">
              <Zap className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Agentic Drafting</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered drafting that understands context and accelerates your writing workflow.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <FileText className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Projects & Files</h3>
              <p className="text-sm text-muted-foreground">
                Organize your documents with powerful project management and file organization.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <GitBranch className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Diff & Patch</h3>
              <p className="text-sm text-muted-foreground">
                Track changes and collaborate with advanced diff and patch capabilities.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <Globe className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">OpenRouter & Ollama</h3>
              <p className="text-sm text-muted-foreground">
                Choose your AI model with seamless integration for OpenRouter and Ollama.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="bg-accent rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who are already improving their writing workflow with LexDraft.
            </p>
            <Link
              href="/app"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-semibold"
            >
              Open App
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
