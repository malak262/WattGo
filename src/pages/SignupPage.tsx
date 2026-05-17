import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, User, Phone, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    studentCard: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(form.email, form.password, {
        full_name: form.fullName,
        phone: form.phone,
        student_card_number: form.studentCard,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Inscription reussie!</h2>
          <p className="text-dark-400 text-sm mb-8">Vous pouvez maintenant vous connecter.</p>
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Watt<span className="text-primary-400">Go</span>
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-white mb-1">Inscription Etudiant</h2>
        <p className="text-dark-400 text-sm mb-6">Rejoignez WattGo pour acceder aux scooters</p>

        {error && (
          <div className="bg-error-500/10 border border-error-500/20 text-error-500 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={e => update('fullName', e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="email"
              placeholder="Email universitaire"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="tel"
              placeholder="Numero de telephone (+212...)"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Numero carte etudiant"
              value={form.studentCard}
              onChange={e => update('studentCard', e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="password"
              placeholder="Mot de passe (6 caracteres min)"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
              required
              minLength={6}
            />
          </div>

          <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl px-4 py-3 text-sm">
            <p className="text-accent-400 font-medium">Caution requise: 100-200 DH</p>
            <p className="text-dark-400 text-xs mt-1">A payer en agence pour activer votre compte</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {loading ? "Inscription..." : "S'inscrire"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-dark-400 text-sm mt-6">
          Deja inscrit?{' '}
          <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
