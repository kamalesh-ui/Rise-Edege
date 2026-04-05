import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/auth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ChatPage from './pages/ChatPage';
import CollegeFinderPage from './pages/CollegeFinderPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function ProtectedRoute({ user, children }: { user: any; children: React.ReactNode }) {
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AuthRoute({ user, children }: { user: any; children: React.ReactNode }) {
  if (user === undefined) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/career/:id" element={<CareerDetailPage />} />
        <Route path="/login" element={<AuthRoute user={user}><LoginPage /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute user={user}><SignupPage /></AuthRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute user={user}><RecommendationsPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute user={user}><ChatPage /></ProtectedRoute>} />
        <Route path="/college-finder" element={<ProtectedRoute user={user}><CollegeFinderPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}