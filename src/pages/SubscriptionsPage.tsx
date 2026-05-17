import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Crown, Sparkles } from 'lucide-react';

interface Subscription {
  id: string;
  plan: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
}

const PLANS = [
  {
    id: 'monthly' as const,
    name: 'Mensuel',
    price: 120,
    duration: '1 mois',
    features: [
      'Courses illimitees',
      'Tarif reduit: 1 DH/min',
      'Priorite de reservation',
      'Support 24/7',
    ],
    popular: false,
  },
  {
    id: 'semester' as const,
    name: 'Semestriel',
    price: 600,
    duration: '6 mois',
    features: [
      'Economie de 120 DH',
      'Courses illimitees',
      'Tarif reduit: 0.80 DH/min',
      'Priorite de reservation',
      'Support 24/7',
      'Badge exclusif',
    ],
    popular: true,
  },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setSubscription(data);
  }, [user]);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);

  async function handleSubscribe(plan: typeof PLANS[number]) {
    if (!user || subscribing) return;
    setSubscribing(plan.id);
    const endDate = new Date();
    if (plan.id === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setMonth(endDate.getMonth() + 6);

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan: plan.id,
      price: plan.price,
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
    });

    await fetchSubscription();
    setSubscribing(null);
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => navigate('/')} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">Abonnements</h1>
      </div>

      <div className="flex-1 px-4 py-6">
        {subscription ? (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-2xl p-6 border border-primary-500/20 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-primary-400" />
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    Abonnement {subscription.plan === 'monthly' ? 'Mensuel' : 'Semestriel'}
                  </h2>
                  <p className="text-primary-300 text-sm">Actif</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dark-300">Date de debut</span>
                <span className="text-white">{new Date(subscription.start_date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Date de fin</span>
                <span className="text-white">{new Date(subscription.end_date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-dark-400 text-sm mb-6">Choisissez un plan pour profiter de tarifs reduits</p>
            <div className="space-y-4">
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  className={`relative bg-dark-800 rounded-2xl p-5 border transition-all ${
                    plan.popular ? 'border-primary-500/30' : 'border-dark-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-4 bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Populaire
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                      <p className="text-dark-400 text-sm">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{plan.price}</p>
                      <p className="text-dark-400 text-xs">DH</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                        <span className="text-dark-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing !== null}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700'
                        : 'bg-dark-700 text-white hover:bg-dark-600'
                    }`}
                  >
                    {subscribing === plan.id ? 'Souscription...' : `Souscrire - ${plan.price} DH`}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
