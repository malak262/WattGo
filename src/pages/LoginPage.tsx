import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Watt<span className="text-primary-400">Go</span>
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-white mb-1">Connexion</h2>
        <p className="text-dark-400 text-sm mb-8">Retrouvez vos scooters a Oujda</p>

        {error && (
          <div className="bg-error-500/10 border border-error-500/20 text-error-500 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="email"
              placeholder="Email universitaire"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-dark-400 text-sm mt-8">
          Pas encore de compte?{' '}
          <Link to="/signup" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
