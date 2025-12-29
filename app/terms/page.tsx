import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-lg text-muted-foreground mb-12">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <div>
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using LexDraft, you accept and agree to be bound by terms and provision
                    of this agreement.
                  </p>
                </div>

                <div>
                  <h2>2. Use License</h2>
                  <p>
                    Permission is granted to temporarily use LexDraft for personal or commercial purposes. This is
                    the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>Modify or copy materials</li>
                    <li>Use materials for any commercial purpose without a valid subscription</li>
                    <li>Attempt to decompile or reverse engineer any software contained in LexDraft</li>
                    <li>Remove any copyright or other proprietary notations from materials</li>
                  </ul>
                </div>

                <div>
                  <h2>3. User Accounts</h2>
                  <p>
                    You are responsible for maintaining the confidentiality of your account and password. You agree
                    to accept responsibility for all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h2>4. User Content</h2>
                  <p>
                    You retain all rights to the content you create using LexDraft. We do not claim ownership of
                    your documents or content.
                  </p>
                </div>

                <div>
                  <h2>5. Prohibited Uses</h2>
                  <p>You may not use LexDraft:</p>
                  <ul>
                    <li>For any unlawful purpose</li>
                    <li>To harass, abuse, or harm another person</li>
                    <li>To impersonate or attempt to impersonate another user</li>
                    <li>To interfere with or disrupt the service</li>
                  </ul>
                </div>

                <div>
                  <h2>6. Limitation of Liability</h2>
                  <p>
                    LexDraft shall not be liable for any indirect, incidental, special, consequential, or punitive
                    damages resulting from your use or inability to use the service.
                  </p>
                </div>

                <div>
                  <h2>7. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any material
                    changes via email or through the service.
                  </p>
                </div>

                <div>
                  <h2>8. Contact Information</h2>
                  <p>
                    Questions about the Terms of Service should be sent to us at legal@lexdraft.com
                  </p>
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
