import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Type, Sparkles } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onLogin?: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Navigation handled by App.tsx state change or fall through
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Account created! Please check your email to verify (if enabled) or sign in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (onLogin) {
      setLoading(true);
      // Simulate network request
      setTimeout(() => {
        onLogin({
          id: 'demo-user-id',
          email: 'demo@typecraft.ai',
          credits: 100
        });
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      
      <div className="mb-8 flex items-center gap-2 relative z-10">
        <Type className="h-8 w-8 text-primary" />
        <span className="text-3xl font-bold tracking-tight">TypeCraft AI</span>
      </div>
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card shadow-xl">
        <CardHeader>
          <CardTitle>{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Enter your credentials to access your fonts." 
              : "Sign up to get 5 free credits and start creating."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
            
            <Button className="w-full" type="submit" isLoading={loading}>
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary" 
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Demo Login (No Signup Required)
          </Button>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-muted-foreground relative z-10 flex gap-4">
         <a href="#/terms" className="hover:underline">Terms</a>
         <a href="#/privacy" className="hover:underline">Privacy</a>
      </div>
    </div>
  );
}