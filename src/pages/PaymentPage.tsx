import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CircleCheck as CheckCircle, CreditCard, Banknote, Building2, ArrowLeft } from 'lucide-react';

interface Ride {
  id: string;
  duration_minutes: number;
  price: number;
  start_time: string;
  end_time: string;
}

export default function PaymentPage() {
  const { rideId } = useParams<{ rideId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [method, setMethod] = useState<'card' | 'transfer' | 'cash'>('card');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const fetchRide = useCallback(async () => {
    if (!rideId) return;
    const { data } = await supabase.from('rides').select('*').eq('id', rideId).maybeSingle();
    if (data) setRide(data);
  }, [rideId]);

  useEffect(() => { fetchRide(); }, [fetchRide]);

  async function handlePayment() {
    if (!ride || !user || paying) return;
    setPaying(true);
    await supabase.from('payments').insert({
      user_id: user.id,
      ride_id: ride.id,
      amount: ride.price,
      payment_method: method,
      status: 'completed',
    });
    setPaid(true);
    setPaying(false);
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Paiement reussi!</h2>
          <p className="text-dark-400 text-sm mb-8">Merci d'avoir utilise WattGo</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20"
          >
            Retour a la carte
          </button>
        </div>
      </div>
    );
  }

  if (!ride) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <p className="text-dark-400">Chargement...</p>
    </div>
  );

  const methods = [
    { id: 'card' as const, label: 'Carte bancaire', icon: CreditCard, desc: 'Visa, Mastercard' },
    { id: 'transfer' as const, label: 'Virement', icon: Building2, desc: 'Virement bancaire' },
    { id: 'cash' as const, label: 'Cash en agence', icon: Banknote, desc: 'Paiement en personne' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => navigate('/')} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">Paiement</h1>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Summary */}
        <div className="bg-dark-800 rounded-2xl p-5 border border-dark-700 mb-6">
          <h3 className="text-dark-400 text-sm mb-3">Resume de la course</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Duree</span>
            <span className="text-white">{ride.duration_minutes} min</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Debut</span>
            <span className="text-white">{new Date(ride.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Fin</span>
            <span className="text-white">{new Date(ride.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="border-t border-dark-700 mt-3 pt-3 flex justify-between">
            <span className="text-white font-medium">Total</span>
            <span className="text-primary-400 font-bold text-lg">{ride.price} DH</span>
          </div>
        </div>

        {/* Payment method */}
        <h3 className="text-dark-400 text-sm mb-3">Mode de paiement</h3>
        <div className="space-y-2 mb-8">
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                method === m.id
                  ? 'bg-primary-500/10 border-primary-500/30'
                  : 'bg-dark-800 border-dark-700 hover:border-dark-600'
              }`}
            >
              <m.icon className={`w-5 h-5 ${method === m.id ? 'text-primary-400' : 'text-dark-400'}`} />
              <div className="text-left">
                <p className={`text-sm font-medium ${method === m.id ? 'text-white' : 'text-dark-300'}`}>{m.label}</p>
                <p className="text-xs text-dark-500">{m.desc}</p>
              </div>
              {method === m.id && <CheckCircle className="w-5 h-5 text-primary-400 ml-auto" />}
            </button>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
        >
          {paying ? 'Paiement en cours...' : `Payer ${ride.price} DH`}
        </button>
      </div>
    </div>
  );
}
