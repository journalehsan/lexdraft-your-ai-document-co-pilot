import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-12 text-sm">
      <div className="container grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Scale className="h-3 w-3" />
            </div>
            <span className="font-bold">LexDraft</span>
          </div>
          <p className="text-muted-foreground">
            Empowering legal professionals with intelligent, secure drafting tools.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
            <li><Link href="/#templates" className="hover:text-foreground">Templates</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/app" className="hover:text-foreground">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/#about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LexDraft Inc. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-70">
          Disclaimer: LexDraft is an AI-assisted drafting tool and does not provide legal advice. Always consult with a qualified attorney.
        </p>
      </div>
    </footer>
  );
}
