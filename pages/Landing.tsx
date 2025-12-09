import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Type, Check, Zap, Download, Sparkles, Globe, ArrowRight, Menu, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import AntigravityBackground from '../components/AntigravityBackground';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative">
      <AntigravityBackground />
      
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Type className="h-6 w-6 text-primary" />
          <span>TypeCraft AI</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/guide" className="text-sm font-medium hover:text-primary transition-colors">
            Guide
          </Link>
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 flex flex-col gap-3">
             <Link to="/guide" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Typography Guide</Button>
            </Link>
             <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="py-20 md:py-32 max-w-5xl mx-auto px-6 text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
            The Missing Link in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Your Brand Identity
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-sm">
            Stop using the same 5 google fonts. Generate proprietary, trademark-ready typography for your campaigns in seconds. 
            Export to CDN instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/auth">
              <Button size="lg" className="px-8 text-lg h-12 shadow-xl shadow-primary/20">Start Creating Free</Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 text-lg h-12 bg-background/50 backdrop-blur-sm" onClick={() => {
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              See Brand Examples
            </Button>
          </div>
        </section>

        {/* Mockup Gallery - Brand Authenticity */}
        <section id="gallery" className="py-24 bg-zinc-50 dark:bg-zinc-950/80 border-y relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(#00000009_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff09_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Built for Marketers. Ready for Production.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how TypeCraft generates authentic brand assets from simple descriptive prompts.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Item 1: The "Soda" Vibe */}
              <GalleryItem 
                name="Americana Script" 
                prompt="Classic 1900s soda brand script, flowing ribbon tails, energetic, iconic red branding style." 
                preview={
                  <div className="flex items-center justify-center h-full bg-[#f40009] p-6 relative group overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                     <div className="absolute bottom-4 right-4 text-white/20 text-xs font-mono">FIG. 01</div>
                    <span className="relative z-10 text-6xl text-white group-hover:scale-110 transition-transform duration-500" style={{ fontFamily: 'Brush Script MT, cursive', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                      Delicious
                    </span>
                  </div>
                }
              />
              
              {/* Item 2: The "Heineken" Vibe */}
              <GalleryItem 
                name="Heritage Brewer" 
                prompt="European brewery serif, slight flare on terminals, star quality, premium green and silver aesthetic." 
                preview={
                  <div className="flex items-center justify-center h-full bg-[#005c28] p-6 relative group">
                    <div className="absolute inset-0 border-4 border-[#005c28] m-2 rounded-sm border-t-white/10 border-b-white/10"></div>
                    <span className="text-5xl font-bold tracking-tight text-white group-hover:tracking-wide transition-all duration-700" style={{ fontFamily: 'Times New Roman, serif' }}>
                      PREMIUM
                    </span>
                    <span className="absolute top-2 right-4 text-red-500 text-2xl">★</span>
                  </div>
                } 
              />

              {/* Item 3: The "Tesla/SpaceX" Vibe */}
              <GalleryItem 
                name="Orbit Sans" 
                prompt="Aerospace grade sans-serif, wide tracking, minimalist, future-tech, disconnected strokes." 
                preview={
                  <div className="flex items-center justify-center h-full bg-zinc-950 p-6 relative group">
                    <span className="text-4xl font-sans font-bold text-white uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors duration-300" style={{ fontFamily: 'Arial, sans-serif' }}>
                      FUTURE
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                  </div>
                } 
              />
              
              {/* Item 4: The "Vogue/Gucci" Vibe */}
              <GalleryItem 
                name="Atelier Didot" 
                prompt="High fashion editorial serif, extreme contrast between thick and thin lines, luxury, parisian." 
                preview={
                  <div className="flex items-center justify-center h-full bg-white p-6 group border border-zinc-100">
                    <span className="text-6xl text-black italic group-hover:-translate-y-2 transition-transform duration-500" style={{ fontFamily: 'Didot, serif', fontWeight: 100 }}>
                      Vogue
                    </span>
                  </div>
                } 
              />

              {/* Item 5: The "Supreme/Nike" Vibe */}
              <GalleryItem 
                name="Hype Beast" 
                prompt="Heavy condensed geometric sans, street culture, loud, box logo aesthetics." 
                preview={
                  <div className="flex items-center justify-center h-full bg-zinc-100 p-6 group">
                     <div className="bg-[#da2d2d] px-4 py-1 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                      <span className="text-4xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                        SUPREME
                      </span>
                     </div>
                  </div>
                } 
              />

               {/* Item 6: The "Whole Foods" Vibe */}
               <GalleryItem 
                name="Market Hand" 
                prompt="Organic grocery store marker style, friendly, rustic, chalkboard texture." 
                preview={
                  <div className="flex items-center justify-center h-full bg-[#2e3b30] p-6 group">
                    <span className="text-5xl font-bold text-[#f2e6d0] -rotate-3 group-hover:rotate-3 transition-transform duration-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      Fresh
                    </span>
                  </div>
                } 
              />

               {/* Item 7: Doodle */}
               <GalleryItem 
                name="Notes & Doodles" 
                prompt="Hand-drawn marker pen style, organic texture, uneven baseline, playful and casual vibe." 
                preview={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-yellow-50 to-orange-100 p-6 relative group overflow-hidden">
                     <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#00000008 1px, transparent 1px)', backgroundSize: '100% 24px' }}></div>
                     <span className="relative z-10 text-5xl text-blue-600 -rotate-2 group-hover:rotate-2 transition-transform duration-300" style={{ fontFamily: 'Comic Sans MS, cursive', filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.1))' }}>
                       Idea!
                     </span>
                     <div className="absolute bottom-6 right-8 w-12 h-12 border-2 border-red-400/50 rounded-full rotate-12 transform group-hover:scale-110 transition-transform"></div>
                  </div>
                } 
              />

              {/* Item 8: Retro Terminal */}
              <GalleryItem 
                name="Mainframe Mono" 
                prompt="Retro-futuristic coding font, fixed width, pixelated aesthetic, glowing phosphor effect." 
                preview={
                  <div className="flex items-center justify-center h-full bg-slate-950 p-6 relative group font-mono overflow-hidden">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[size:100%_2px,3px_100%] opacity-20"></div>
                     <div className="text-green-500 text-3xl md:text-4xl font-bold tracking-wider z-0 group-hover:text-green-400 transition-colors drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                       <span className="mr-1 opacity-50">&gt;</span>INIT<span className="animate-pulse">_</span>
                     </div>
                  </div>
                } 
              />

              {/* Item 9: Gradient/Aura */}
              <GalleryItem 
                name="Aura Display" 
                prompt="Ethereal gradient typography, soft edges, wide stance, dreamlike and fluid." 
                preview={
                  <div className="flex items-center justify-center h-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-6 relative group">
                     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                     <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter group-hover:tracking-widest transition-all duration-700 ease-out" style={{ fontFamily: 'Arial, sans-serif' }}>
                       GLOW
                     </span>
                  </div>
                } 
              />
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/20">
                  Generate Your Brand Font <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-background/90 py-20 border-b backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <Feature 
              icon={<Zap className="h-6 w-6 text-yellow-500" />}
              title="Identity in Seconds"
              desc="Don't wait weeks for a typographer. Describe the vibe ('clean, eco-friendly, rounded') and get options instantly."
            />
            <Feature 
              icon={<Globe className="h-6 w-6 text-blue-500" />}
              title="CDN Deployment"
              desc="We host your font files on a global edge network. Import them into your CSS with a single line of code."
            />
            <Feature 
              icon={<Download className="h-6 w-6 text-green-500" />}
              title="Full Ownership"
              desc="Export standard OTF/TTF files. Use them in Photoshop, Figma, or your website. 100% royalty free."
            />
          </div>
        </section>

        {/* Pricing Mini */}
        <section className="py-20 max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12">Flexible Credit Packs</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="border p-8 rounded-xl bg-card/80 backdrop-blur-sm shadow-sm hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-xl">Starter</h3>
              <div className="text-4xl font-bold my-4">$0</div>
              <ul className="text-left space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> 5 Free Credits</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited AI Previews</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary" /> 1 Font Export</li>
              </ul>
              <Link to="/auth"><Button className="w-full" variant="outline">Sign Up Free</Button></Link>
            </div>
            <div className="border p-8 rounded-xl bg-primary text-primary-foreground shadow-lg scale-105 relative">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">AGENCY FAVORITE</div>
              <h3 className="font-semibold text-xl">Marketing Pack</h3>
              <div className="text-4xl font-bold my-4">$15</div>
              <ul className="text-left space-y-3 mb-8 text-primary-foreground/90 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4" /> 30 Credits</li>
                <li className="flex gap-2"><Check className="h-4 w-4" /> Commercial License</li>
                <li className="flex gap-2"><Check className="h-4 w-4" /> Priority Rendering Queue</li>
                <li className="flex gap-2"><Check className="h-4 w-4" /> Permanent CDN Hosting</li>
              </ul>
              <Link to="/auth"><Button className="w-full bg-background text-foreground hover:bg-background/90">Get Credits</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground bg-muted/20 relative z-10">
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-4 font-medium">
          <Link to="/guide" className="hover:text-primary transition-colors">Typography Guide</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
        <p>© 2024 TypeCraft AI. Built for the modern web.</p>
      </footer>
    </div>
  );
}

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="space-y-4">
    <div className="bg-background w-12 h-12 rounded-lg border flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);

const GalleryItem = ({ name, prompt, preview }: { name: string, prompt: string, preview: React.ReactNode }) => (
  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-muted-foreground/10 group h-full flex flex-col bg-card/50 backdrop-blur-sm">
    <div className="h-56 w-full border-b bg-muted/50 overflow-hidden">
      {preview}
    </div>
    <CardContent className="p-5 flex-1 flex flex-col">
      <div className="mb-2">
         <h3 className="font-bold text-lg">{name}</h3>
      </div>
      <div className="bg-muted/50 p-2 rounded text-xs text-muted-foreground font-mono leading-relaxed flex-1">
        <span className="text-primary font-bold mr-1">PROMPT_</span>
        "{prompt}"
      </div>
    </CardContent>
  </Card>
);