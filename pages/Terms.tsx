import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Type, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function TermsPage() {
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
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last Updated: March 15, 2024</p>
            
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using TypeCraft AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
              <p>TypeCraft AI provides an artificial intelligence-based font generation platform. We allow users to generate, preview, and export font files based on text prompts and reference images.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Intellectual Property</h2>
              <p><strong>Generated Assets:</strong> Fonts generated using paid credits are the property of the user, including full commercial rights. Fonts generated during free trials or previews may be subject to attribution requirements.</p>
              <p><strong>Platform IP:</strong> The underlying software, algorithms, and interface of TypeCraft AI remain the exclusive property of TypeCraft Inc.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment and Credits</h2>
              <p>Services are provided on a credit basis. Credits are non-refundable once purchased, except as required by law. We reserve the right to change pricing at any time.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
              <p>TypeCraft AI is provided "as is". We make no warranties regarding the uniqueness of generated fonts relative to existing copyrighted typefaces. Users are responsible for trademark clearance.</p>
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