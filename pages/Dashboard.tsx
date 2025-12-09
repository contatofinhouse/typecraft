import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Font, FontStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Download, Clock, AlertCircle, Code, Copy, Check, Globe, ExternalLink, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);
  const [activePairingId, setActivePairingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFonts = async () => {
      // 1. Try fetching real user
      let { data: { user } } = await supabase.auth.getUser();
      
      // 2. Fallback to demo user if no real session
      if (!user) {
        const demoUserStr = localStorage.getItem('typecraft_demo_user');
        if (demoUserStr) {
          try {
            user = JSON.parse(demoUserStr);
          } catch (e) {
            console.error("Failed to parse demo user");
          }
        }
      }

      if (user) {
        // If it's a demo user, load mock data immediately
        if (user.email?.includes('demo')) {
           setFonts([
             {
               id: 'demo-font-1',
               user_id: user.id,
               style_name: 'Demo Sans',
               prompt: 'A clean modern sans serif for a tech startup',
               status: FontStatus.READY,
               preview_url: 'https://placehold.co/800x400/1a1a1a/ffffff?text=Demo+Sans&font=roboto',
               download_ttf_url: '#',
               download_otf_url: '#',
               download_woff2_url: 'https://cdn.typecraft.ai/demo/demo-sans-v1.woff2',
               created_at: new Date().toISOString()
             },
             {
                id: 'demo-font-2',
                user_id: user.id,
                style_name: 'Vintage Script',
                prompt: 'Elegant handwritten script, 1950s cola vibe',
                status: FontStatus.READY,
                preview_url: 'https://placehold.co/800x400/aa2222/ffffff?text=Cola+Vibe&font=playfair-display',
                download_ttf_url: '#',
                download_otf_url: '#',
                download_woff2_url: 'https://cdn.typecraft.ai/demo/vintage-script-v1.woff2',
                created_at: new Date(Date.now() - 86400000).toISOString()
             }
           ]);
           setLoading(false);
           return;
        }

        // Otherwise fetch from real DB
        const { data, error } = await supabase
          .from('fonts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setFonts(data as Font[]);
        }
      }
      setLoading(false);
    };

    fetchFonts();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const StatusIcon = ({ status }: { status: FontStatus }) => {
    switch (status) {
      case FontStatus.READY:
        return <Download className="h-4 w-4 text-green-500" />;
      case FontStatus.PROCESSING:
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case FontStatus.FAILED:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPairings = (font: Font) => {
    const prompt = (font.prompt || "").toLowerCase();
    
    // Heuristic for pairing suggestions
    if (prompt.includes('serif') && !prompt.includes('sans')) {
       return [
         { name: 'Inter', type: 'Sans-serif', reason: 'Clean modern sans to balance the serif details.' },
         { name: 'Lato', type: 'Sans-serif', reason: 'Neutral and legible for body text.' }
       ];
    } else if (prompt.includes('script') || prompt.includes('hand') || prompt.includes('doodle')) {
       return [
         { name: 'Montserrat', type: 'Sans-serif', reason: 'Geometric structure stabilizes the organic script.' },
         { name: 'Raleway', type: 'Sans-serif', reason: 'Elegant thin weights complement the handwritten vibe.' }
       ];
    } else if (prompt.includes('mono') || prompt.includes('code') || prompt.includes('tech')) {
       return [
         { name: 'Inter', type: 'Sans-serif', reason: 'Humanist sans softens the technical feel.' },
         { name: 'Space Grotesk', type: 'Sans-serif', reason: 'Quirky sans that matches the tech aesthetic.' }
       ];
    } else {
       // Default (assume display/sans)
       return [
         { name: 'Merriweather', type: 'Serif', reason: 'High readability serif for long-form content.' },
         { name: 'Open Sans', type: 'Sans-serif', reason: 'Friendly neutral companion.' }
       ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Font Library</h1>
          <p className="text-muted-foreground">Manage your generated assets and CDN deployments.</p>
        </div>
        <Link to="/generate">
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Create New Font
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-80 animate-pulse bg-muted/50 border-0" />
          ))}
        </div>
      ) : fonts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center bg-muted/10">
          <div className="bg-background rounded-full p-4 mb-4 shadow-sm">
             <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Your library is empty</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">Generate your first custom font to see it here.</p>
          <Link to="/generate">
            <Button size="lg">Start Generator</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {fonts.map((font) => {
            // Construct a valid URL even if missing from DB for preview purposes
            const cdnUrl = font.download_woff2_url || `https://cdn.typecraft.ai/u/${font.user_id}/${font.id}.woff2`;
            const pairings = getPairings(font);

            return (
            <Card key={font.id} className="flex flex-col h-full overflow-hidden transition-all hover:border-primary/50 group">
              {/* Preview Area */}
              <div className="h-48 w-full bg-white dark:bg-zinc-900 relative overflow-hidden flex items-center justify-center border-b p-4 shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                
                {font.preview_url ? (
                   <img src={font.preview_url} alt={font.style_name} className="w-full h-full object-contain relative z-10" />
                ) : (
                  <div className="relative z-10 text-center">
                    <span className="text-6xl font-serif text-foreground/80">Aa</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2 z-20">
                  <div className="bg-background/95 backdrop-blur rounded-full px-2.5 py-1 text-xs font-medium border shadow-sm flex items-center gap-1.5">
                    <StatusIcon status={font.status} />
                    <span className="capitalize">{font.status}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                   <CardTitle className="text-lg truncate font-bold">{font.style_name || "Untitled Font"}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]" title={font.prompt}>
                  {font.prompt}
                </p>
              </CardHeader>
              
              {/* Expandable Sections */}
              {(activeEmbedId === font.id || activePairingId === font.id) && (
                <div className="px-4 pb-4 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                  
                  {/* Pairings Section */}
                  {activePairingId === font.id && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended Pairings</span>
                      </div>
                      {pairings.map(p => (
                        <div key={p.name} className="bg-muted/50 p-2.5 rounded-lg border text-sm flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold flex items-center gap-1.5">
                              {p.name} 
                              <a href={`https://fonts.google.com/specimen/${p.name}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><ExternalLink className="h-3 w-3" /></a>
                            </span>
                            <span className="text-[10px] bg-background px-1.5 py-0.5 rounded text-muted-foreground border uppercase">{p.type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">{p.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embed Section */}
                  {activeEmbedId === font.id && (
                    <>
                      {/* CSS Import */}
                      <div className="bg-zinc-950 text-zinc-100 p-3 rounded-lg relative text-[10px] font-mono leading-tight shadow-inner ring-1 ring-zinc-800">
                        <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
                          <span className="text-zinc-400 font-sans text-xs font-semibold flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5 text-purple-400" /> 
                            CSS Import
                          </span>
                        </div>
                        <div className="break-all text-zinc-400 pr-6">
                          <span className="text-purple-400">@font-face</span> {'{'}<br/>
                          &nbsp;&nbsp;<span className="text-blue-300">font-family</span>: <span className="text-orange-300">'{font.style_name}'</span>;<br/>
                          &nbsp;&nbsp;<span className="text-blue-300">src</span>: url('<span className="text-green-400">{cdnUrl}</span>') format('woff2');<br/>
                          {'}'}
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-1 right-1 h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md" 
                          onClick={() => handleCopy(`@font-face { font-family: '${font.style_name}'; src: url('${cdnUrl}') format('woff2'); }`, font.id)}
                          title="Copy CSS"
                        >
                          {copiedId === font.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>

                      {/* Direct CDN Link */}
                      <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg border flex items-center gap-2">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center flex-shrink-0">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Direct CDN Link</p>
                            <p className="text-xs truncate font-mono text-foreground">{cdnUrl}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleCopy(cdnUrl, font.id + '_link')}
                          >
                            {copiedId === font.id + '_link' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                      </div>
                    </>
                  )}

                </div>
              )}

              <CardFooter className="p-4 mt-auto border-t bg-muted/20">
                <div className="flex w-full gap-2">
                   {font.status === FontStatus.READY ? (
                     <>
                      <Button 
                        variant={activePairingId === font.id ? "default" : "secondary"} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setActivePairingId(activePairingId === font.id ? null : font.id);
                          setActiveEmbedId(null);
                        }}
                      >
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                        Pairings
                      </Button>
                      <Button 
                        variant={activeEmbedId === font.id ? "default" : "secondary"} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setActiveEmbedId(activeEmbedId === font.id ? null : font.id);
                          setActivePairingId(null);
                        }}
                      >
                        <Code className="mr-2 h-3.5 w-3.5" />
                        {activeEmbedId === font.id ? 'Close' : 'Embed'}
                      </Button>
                     </>
                   ) : (
                      <Button variant="secondary" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled>
                         Processing...
                      </Button>
                   )}
                </div>
              </CardFooter>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}