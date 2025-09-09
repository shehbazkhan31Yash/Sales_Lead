import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginAsGuest, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
    } catch (err) {
      setError('Failed to login as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <Brain className="h-16 w-16 text-pink-400" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Welcome to LeadIQ</h2>
          <p className="text-indigo-200 text-lg">AI-Powered Sales Lead Scoring</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              required
            />

            {error && (
              <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                size="lg"
              >
                Sign In
              </Button>

              <div className="text-center text-white/60">
                <span>or</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
                onClick={handleGuestLogin}
                loading={loading}
                size="lg"
              >
                Continue as Guest
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-indigo-200 text-sm">
            <p>Experience the power of AI-driven lead qualification</p>
            <p className="mt-1">Demo credentials: any email/password</p>
          </div>
        </div>
      </div>
    </div>
  );
};