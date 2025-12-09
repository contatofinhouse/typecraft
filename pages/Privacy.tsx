import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Type, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative flex flex-col bg-background">
       <header className="px-6 h-16 flex items-center justify-between border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
         <div className="flex items-center gap-2 font-bold text-xl">
            <Link to="/" className="flex items-center gap-2">
              <Type className="h-6 w-6 text-primary" />
              <span>TypeCraft AI</span>
            </Link>
         </div>
         <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
         </div>
       </header>

       <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl relative z-10">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <article className="prose dark:prose-invert max-w-none space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last Updated: March 15, 2024</p>
            
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Data Collection</h2>
              <p>We collect information you provide directly to us, such as when you create an account, purchase credits, or request customer support. This may include email addresses and payment information (processed via secure third parties).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. AI Usage Data</h2>
              <p>To improve our generative models, we may store prompts and reference images uploaded to the service. However, we do not share your specific generated assets publicly without your explicit permission.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Cookies</h2>
              <p>We use cookies to maintain your session and preference settings (such as dark mode toggle). You can control cookie settings through your browser.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Us</h2>
              <p>If you have questions about this policy, please contact us at privacy@typecraft.ai.</p>
            </section>
          </article>
       </main>

       <footer className="border-t py-8 text-center text-sm text-muted-foreground bg-muted/20 relative z-10">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/guide" className="hover:text-primary">Typography Guide</Link>
          <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
        © 2024 TypeCraft AI. All rights reserved.
      </footer>
    </div>
  );
}