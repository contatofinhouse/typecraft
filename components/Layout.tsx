import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { LogOut, Type, LayoutDashboard, Sparkles, CreditCard, Menu, X, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onSignOut?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    // 1. Clear local state (demo mode)
    if (onSignOut) onSignOut();
    
    // 2. Clear real auth
    await supabase.auth.signOut();
    
    // 3. Redirect
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Define public routes that don't require authentication
  const isPublic = location.pathname === '/' || 
                   location.pathname.startsWith('/auth') || 
                   location.pathname === '/terms' || 
                   location.pathname === '/privacy' || 
                   location.pathname === '/guide';

  if (!user && !isPublic) {
    // Basic protection (use a real protected route wrapper in prod)
    return <div className="flex h-screen items-center justify-center">Loading or Redirecting...</div>;
  }

  if (isPublic) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link to="/dashboard" onClick={onClick}>
        <Button variant={isActive('/dashboard') ? "secondary" : "ghost"} className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link to="/generate" onClick={onClick}>
        <Button variant={isActive('/generate') ? "secondary" : "ghost"} className="w-full justify-start">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate New
        </Button>
      </Link>
      <Link to="/guide" onClick={onClick}>
        <Button variant={isActive('/guide') ? "secondary" : "ghost"} className="w-full justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Prompt Guide
        </Button>
      </Link>
      <div className="pt-4 mt-4 border-t">
        <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
          Credits: {user?.credits || 0}
        </div>
        <Link to="/buy-credits" onClick={onClick}>
            <Button variant="outline" className="w-full justify-start mt-2">
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">TypeCraft</span>
          </div>
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:hidden bg-card sticky top-0 z-40">
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
               <Menu className="h-5 w-5" />
             </Button>
             <span className="font-bold text-lg">TypeCraft</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-card border-r shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
               <div className="p-4 border-b flex items-center justify-between h-16">
                  <div className="flex items-center gap-2">
                    <Type className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">TypeCraft</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
               </div>
               <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                 <NavLinks onClick={() => setMobileMenuOpen(false)} />
               </nav>
               <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
               </div>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;