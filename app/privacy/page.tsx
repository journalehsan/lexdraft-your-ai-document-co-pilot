import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground mb-12">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <div>
                  <h2>Introduction</h2>
                  <p>
                    LexDraft ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your information when you use our service.
                  </p>
                </div>

                <div>
                  <h2>Information We Collect</h2>
                  <h3>Personal Information</h3>
                  <ul>
                    <li>Name and email address</li>
                    <li>Account credentials</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                  </ul>

                  <h3>Usage Information</h3>
                  <ul>
                    <li>Document content you create</li>
                    <li>Usage statistics and analytics</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>

                <div>
                  <h2>How We Use Your Information</h2>
                  <p>We use information we collect to:</p>
                  <ul>
                    <li>Provide and maintain our service</li>
                    <li>Process your transactions</li>
                    <li>Send you updates and marketing communications (with your consent)</li>
                    <li>Improve our service and develop new features</li>
                    <li>Detect and prevent fraud or abuse</li>
                  </ul>
                </div>

                <div>
                  <h2>Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to provide our services and comply
                    with legal obligations. You can request deletion of your data at any time.
                  </p>
                </div>

                <div>
                  <h2>Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Export your data</li>
                  </ul>
                </div>

                <div>
                  <h2>Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy, please contact us at privacy@lexdraft.com
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
