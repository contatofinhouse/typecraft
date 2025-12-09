
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateFontPreview } from '../services/gemini';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Wand2, Download, RefreshCw, AlertTriangle, Upload, X, Image as ImageIcon, Settings2 } from 'lucide-react';
import { User } from '../types';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [fontName, setFontName] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  
  // Customization State
  const [previewText, setPreviewText] = useState('The quick brown fox');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontStyle, setFontStyle] = useState('normal');
  const [fontWeight, setFontWeight] = useState('400');

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch current user credits (in a real app, use a context or hook)
  const [credits, setCredits] = useState<number>(0);

  React.useEffect(() => {
    const checkCredits = async () => {
      let { data: { user } } = await supabase.auth.getUser();
      
      // Fallback for demo user
      if (!user) {
         const demoStr = localStorage.getItem('typecraft_demo_user');
         if (demoStr) user = JSON.parse(demoStr);
      }

      if (user) {
        // If demo, use local user object
        if (user.email?.includes('demo')) {
           // @ts-ignore - Demo user has credits property locally
           setCredits(user.credits || 100);
           return;
        }

        const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (data) setCredits(data.credits);
      }
    };
    checkCredits();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size too large. Please upload an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setReferenceImage(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && !referenceImage) return;

    setIsGenerating(true);
    setError(null);
    setPreviewUrl(null);

    try {
      // Pass the reference image (base64) if it exists, along with customization options
      const url = await generateFontPreview(
        prompt, 
        referenceImage || undefined,
        previewText,
        bgColor,
        textColor,
        fontStyle,
        fontWeight
      );
      setPreviewUrl(url);
    } catch (err) {
      setError("Failed to generate preview. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    const COST = 5;

    if (credits < COST) {
      setError(`Insufficient credits. You need ${COST} credits to export.`);
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      let { data: { user } } = await supabase.auth.getUser();
      // Demo fallback
      if (!user) {
         const demoStr = localStorage.getItem('typecraft_demo_user');
         if (demoStr) {
           user = JSON.parse(demoStr);
           // Handle Demo Deduction locally
           const newCredits = (user as any).credits - COST;
           const updatedUser = { ...user, credits: newCredits };
           localStorage.setItem('typecraft_demo_user', JSON.stringify(updatedUser));
           setCredits(newCredits);
           
           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work
           navigate('/dashboard');
           return;
         }
      }
      
      if (!user) throw new Error("Not authenticated");

      // 1. Deduct Credits via Supabase RPC (Secure)
      const { data: rpcData, error: rpcError } = await supabase.rpc('deduct_credits', {
        cost: COST,
        reason: `Export Font: ${fontName || 'Untitled'}`
      });

      if (rpcError) throw new Error(rpcError.message);

      // 2. Insert the Font record
      // In a real app, you would upload the file to storage here.
      // We are simulating the "Generation" part by saving the metadata.
      const { error: dbError } = await supabase.from('fonts').insert({
        user_id: user.id,
        style_name: fontName || "Custom Font",
        prompt: prompt,
        status: 'ready',
        preview_url: previewUrl,
        // Mocking the download URLs for this demo
        download_woff2_url: `https://cdn.typecraft.ai/mock/${Date.now()}.woff2`
      });

      if (dbError) throw new Error(dbError.message);

      // 3. Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Font Generator</h1>
        <p className="text-muted-foreground">Describe your brand aesthetic or upload a reference image to guide the model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Font Family Name</label>
                <Input 
                  placeholder="e.g. Acme Sans" 
                  value={fontName}
                  onChange={(e) => setFontName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Image (Optional)</label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  
                  {!referenceImage ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-dashed h-24 flex flex-col gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload font screenshot</span>
                    </Button>
                  ) : (
                    <div className="relative rounded-md overflow-hidden border group">
                      <img src={referenceImage} alt="Reference" className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={clearImage}>
                           <X className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Design Brief</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="e.g. A bold, compressed headline font for a sports brand. Angular corners, heavy weight, italicized forward movement."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Preview Customization Section */}
              <div className="border-t pt-4 mt-2">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                  <Settings2 className="h-4 w-4" />
                  Preview Settings
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Preview Text</label>
                    <Input 
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Custom text..."
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Weight</label>
                      <select
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                      >
                        <option value="100">Thin</option>
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="700">Bold</option>
                        <option value="900">Black</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Style</label>
                      <select
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Background</label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-8 w-8 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-8 text-xs flex-1 min-w-0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Text Color</label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-8 w-8 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-8 text-xs flex-1 min-w-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePreview} 
                className="w-full" 
                disabled={isGenerating || (!prompt && !referenceImage)}
                isLoading={isGenerating}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {previewUrl ? "Update Specimen" : "Generate Specimen"}
              </Button>
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-lg border text-sm">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
               Available Credits: {credits}
            </h4>
            <p className="text-muted-foreground mb-4 text-xs">
              Generation is free. Exporting the font files for web/print costs 5 credits per weight.
            </p>
            {credits < 5 && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Top up needed to export.</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="h-full min-h-[400px] flex flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 relative transition-colors duration-300">
              {/* Dynamic Background */}
              <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: previewUrl ? bgColor : undefined }}></div>
              
              {/* Background Grid Pattern (Only visible if transparent or default) */}
              {(!previewUrl || bgColor.toLowerCase() === '#ffffff' || bgColor.toLowerCase() === '#fff') && (
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              )}

              {isGenerating ? (
                <div className="text-center space-y-4 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary relative z-10" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Compiling glyphs from {referenceImage ? "image analysis" : "prompt"}...</p>
                </div>
              ) : previewUrl ? (
                <div className="w-full h-full p-8 flex items-center justify-center relative z-10">
                   <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[400px] object-contain shadow-2xl rounded-sm border bg-white/5" />
                </div>
              ) : (
                <div className="text-center text-muted-foreground relative z-10 max-w-sm px-4">
                  <TypePreviewPlaceholder />
                  <h3 className="text-lg font-medium text-foreground mt-4">Waiting for Input</h3>
                  <p className="mt-2 text-sm">Enter a prompt or upload a reference image to see a real-time specimen generated by our AI engine.</p>
                </div>
              )}
            </CardContent>
            
            <div className="p-4 border-t bg-card flex justify-between items-center relative z-20">
              <span className="text-xs font-mono text-muted-foreground">
                {previewUrl ? "STATUS: PREVIEW_READY" : "STATUS: IDLE"}
              </span>
              <Button 
                variant="default" 
                onClick={handleExport}
                disabled={!previewUrl || isExporting || credits < 5}
                isLoading={isExporting}
                className="shadow-lg shadow-primary/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Export OTF/TTF (5 Credits)
              </Button>
            </div>
          </Card>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TypePreviewPlaceholder = () => (
  <svg className="h-20 w-20 mx-auto text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
  </svg>
);
