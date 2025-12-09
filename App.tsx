
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from './types';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import GeneratePage from './pages/Generate';
import GuidePage from './pages/Guide';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';
import BuyCreditsPage from './pages/BuyCredits';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handlers for Demo Mode
  const handleDemoLogin = (demoUser: User) => {
    localStorage.setItem('typecraft_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const handleLogout = async () => {
    localStorage.removeItem('typecraft_demo_user');
    setUser(null);
    // Attempt real sign out as well just in case
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // 0. Check for Demo User first
    const demoUserStr = localStorage.getItem('typecraft_demo_user');
    if (demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr);
        setUser(demoUser);
        setIsLoading(false);
        // If we have a demo user, we can optionally return early or let supabase init in background.
        // Returning early prevents the "flicker" if supabase returns null.
        return;
      } catch (e) {
        localStorage.removeItem('typecraft_demo_user');
      }
    }

    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (localStorage.getItem('typecraft_demo_user')) return; // Priority to demo user

      if (session?.user) {
        // Sync custom user data
        fetchUserData(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we are in demo mode, ignore supabase saying "no user"
      if (localStorage.getItem('typecraft_demo_user')) return;

      if (session?.user) {
        fetchUserData(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (id: string, email: string) => {
    // Ensure user exists in our public table (trigger usually handles this, but good for safety)
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    if (data) {
      setUser(data as User);
    } else {
      // Fallback if DB trigger hasn't run yet or user is new
      setUser({ id, email, credits: 0 }); 
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="typecraft-theme">
      <Router>
        <ScrollToTop />
        <Layout user={user} onSignOut={handleLogout}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={!user ? <AuthPage onLogin={handleDemoLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/generate" element={user ? <GeneratePage /> : <Navigate to="/auth" />} />
            <Route path="/buy-credits" element={user ? <BuyCreditsPage /> : <Navigate to="/auth" />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
