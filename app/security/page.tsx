import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Shield, Lock, Server, Eye } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Security & Privacy</h1>
          <p className="text-xl text-muted-foreground">
            Your data security is our top priority
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border rounded-lg p-6">
              <Shield className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-muted-foreground">
                All data is encrypted in transit and at rest using industry-standard encryption protocols.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <Lock className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">SOC 2 Compliant</h3>
              <p className="text-muted-foreground">
                We maintain SOC 2 Type II compliance to ensure the highest security standards.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <Server className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">On-Premise Option</h3>
              <p className="text-muted-foreground">
                Enterprise customers can deploy LexDraft on their own infrastructure for complete control.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <Eye className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                We never sell your data. Your documents remain private and are never used to train AI models.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Security Practices</h2>
          <ul className="space-y-2 mb-8">
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication (MFA) support</li>
            <li>Role-based access control (RBAC)</li>
            <li>Automated backups and disaster recovery</li>
            <li>24/7 security monitoring</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Compliance</h2>
          <p className="mb-4">
            LexDraft is compliant with major data protection regulations including:
          </p>
          <ul className="space-y-2">
            <li>GDPR (General Data Protection Regulation)</li>
            <li>CCPA (California Consumer Privacy Act)</li>
            <li>HIPAA (for healthcare customers)</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
