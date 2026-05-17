import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CreditCard, Award, Zap, Shield, ArrowLeft, CircleCheck as CheckCircle, Trophy } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned_at: string;
}

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'badges' | 'payments'>('info');
  const [depositLoading, setDepositLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const { data: badgeData } = await supabase.from('badges').select('*').eq('user_id', user.id).order('earned_at', { ascending: false });
    const { data: paymentData } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    if (badgeData) setBadges(badgeData);
    if (paymentData) setPayments(paymentData);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handlePayDeposit() {
    if (!user || depositLoading) return;
    setDepositLoading(true);
    await supabase.from('profiles').update({ deposit_paid: true, deposit_amount: 150 }).eq('id', user.id);
    window.location.reload();
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => navigate('/')} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">Profil Etudiant</h1>
      </div>

      {/* Profile header */}
      <div className="px-4 py-6 border-b border-dark-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">{profile?.full_name || 'Etudiant'}</h2>
            <p className="text-dark-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Shield className={`w-3.5 h-3.5 ${profile?.deposit_paid ? 'text-primary-400' : 'text-accent-400'}`} />
              <span className={`text-xs ${profile?.deposit_paid ? 'text-primary-400' : 'text-accent-400'}`}>
                Caution {profile?.deposit_paid ? 'payee' : 'non payee'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-800">
        {(['info', 'badges', 'payments'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            {tab === 'info' ? 'Infos' : tab === 'badges' ? 'Badges' : 'Paiements'}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {activeTab === 'info' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
              <h3 className="text-dark-400 text-xs uppercase tracking-wider mb-3">Informations personnelles</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400 text-sm">Nom</span>
                  <span className="text-white text-sm">{profile?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400 text-sm">Telephone</span>
                  <span className="text-white text-sm">{profile?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400 text-sm">Carte etudiant</span>
                  <span className="text-white text-sm">{profile?.student_card_number}</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
              <h3 className="text-dark-400 text-xs uppercase tracking-wider mb-3">Statut caution</h3>
              {profile?.deposit_paid ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-primary-400 text-sm font-medium">Caution de {profile.deposit_amount} DH payee</span>
                </div>
              ) : (
                <div>
                  <p className="text-accent-400 text-sm mb-3">Caution non payee - 150 DH requise</p>
                  <button
                    onClick={handlePayDeposit}
                    disabled={depositLoading}
                    className="bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-600 transition-all disabled:opacity-50"
                  >
                    {depositLoading ? 'Paiement...' : 'Payer la caution (150 DH)'}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/subscriptions')}
              className="w-full bg-dark-800 rounded-xl p-4 border border-dark-700 flex items-center gap-3 hover:border-primary-500/30 transition-all"
            >
              <Zap className="w-5 h-5 text-primary-400" />
              <span className="text-white text-sm font-medium">Gerer mon abonnement</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full bg-error-500/10 border border-error-500/20 rounded-xl p-4 flex items-center gap-3 text-error-500 hover:bg-error-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Se deconnecter</span>
            </button>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="animate-fade-in">
            {badges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Trophy className="w-12 h-12 text-dark-600 mb-3" />
                <p className="text-dark-400 text-sm">Aucun badge pour le moment</p>
                <p className="text-dark-500 text-xs mt-1">Faites des courses pour gagner des badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700 text-center">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-primary-400" />
                    </div>
                    <p className="text-white text-sm font-medium">{badge.name}</p>
                    <p className="text-dark-500 text-xs mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-fade-in space-y-3">
            {payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <CreditCard className="w-12 h-12 text-dark-600 mb-3" />
                <p className="text-dark-400 text-sm">Aucun paiement</p>
              </div>
            ) : (
              payments.map(payment => (
                <div key={payment.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{payment.amount} DH</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      payment.status === 'completed'
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-dark-400 bg-dark-700'
                    }`}>
                      {payment.status === 'completed' ? 'Paye' : 'En attente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-500 text-xs capitalize">{payment.payment_method}</span>
                    <span className="text-dark-500 text-xs">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
