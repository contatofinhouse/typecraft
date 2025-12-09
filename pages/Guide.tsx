import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Type, ArrowLeft, Sparkles, Image as ImageIcon, Wand2, Lightbulb, Type as TypeIcon } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Card, CardContent } from '../components/ui/Card';

export default function GuidePage() {
  return (
    <div className="min-h-screen relative flex flex-col bg-background">
       {/* Simple Header */}
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

       <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl relative z-10">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>

          <article className="space-y-12">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">The Art of AI Typography</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn how to craft effective prompts and use reference images to generate production-ready font files with TypeCraft.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                   <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. The Prompt Formula</h3>
                  <p className="text-muted-foreground mb-4">
                    The best font descriptions follow a simple structure: <strong>Style + Personality + Details</strong>.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono text-muted-foreground">
                    "A <span className="text-primary">geometric sans-serif</span> that feels <span className="text-blue-500">futuristic and cold</span>, with <span className="text-purple-500">ink traps and high x-height</span>."
                  </div>
                </CardContent>
              </Card>

              <Card>
                 <CardContent className="p-6">
                   <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                     <ImageIcon className="h-6 w-6" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">2. Visual References</h3>
                   <p className="text-muted-foreground">
                     Upload a screenshot of a font you like. The AI will analyze the stroke width, contrast, and serifs to create something similar but unique. This is perfect for "I want something like this but bolder" requests.
                   </p>
                 </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
               <h2 className="text-3xl font-bold">Key Terminology</h2>
               <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 font-bold"><TypeIcon className="h-4 w-4" /> Serifs</div>
                   <p className="text-sm text-muted-foreground">The small feet at the ends of strokes. Use "Slab Serif" for blocky feet, or "Didone" for thin, high-contrast lines.</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 font-bold"><Wand2 className="h-4 w-4" /> Weights</div>
                   <p className="text-sm text-muted-foreground">Specify "Thin", "Regular", "Bold", or "Black". You can also ask for "Variable Weight" to get a versatile font family.</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 font-bold"><Lightbulb className="h-4 w-4" /> Vibe</div>
                   <p className="text-sm text-muted-foreground">Abstract words work well too. Try "Cyberpunk", "Vintage 70s", "Corporate Trustworthy", or "Kindergarten Playful".</p>
                 </div>
               </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center space-y-4">
               <h2 className="text-2xl font-bold">Ready to create?</h2>
               <p className="text-muted-foreground">Start with a simple idea and iterate. You get 5 free credits to experiment.</p>
               <Link to="/generate">
                 <Button size="lg" className="mt-4">Open Generator</Button>
               </Link>
            </div>

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
  )
}