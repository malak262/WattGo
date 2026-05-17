import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Timer, Lock, ArrowLeft } from 'lucide-react';

interface Scooter {
  id: string;
  code: string;
  battery_level: number;
  pin_code: string;
  station_id: string;
  latitude: number;
  longitude: number;
}

export default function BookingPage() {
  const { scooterId } = useParams<{ scooterId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [scooter, setScooter] = useState<Scooter | null>(null);
  const [step, setStep] = useState<'confirm' | 'timer' | 'unlock'>('confirm');
  const [countdown, setCountdown] = useState(300);
  const [rideId, setRideId] = useState<string | null>(null);

  const fetchScooter = useCallback(async () => {
    if (!scooterId) return;
    const { data } = await supabase.from('scooters').select('*').eq('id', scooterId).maybeSingle();
    if (data) setScooter(data);
  }, [scooterId]);

  useEffect(() => { fetchScooter(); }, [fetchScooter]);

  useEffect(() => {
    if (step !== 'timer') return;
    if (countdown <= 0) {
      cancelRide();
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  async function startReservation() {
    if (!scooter || !user) return;
    const { data: ride } = await supabase.from('rides').insert({
      user_id: user.id,
      scooter_id: scooter.id,
      start_station_id: scooter.station_id,
      status: 'reserved',
      start_latitude: scooter.latitude,
      start_longitude: scooter.longitude,
    }).select().maybeSingle();

    if (ride) {
      setRideId(ride.id);
      await supabase.from('scooters').update({ status: 'reserved' }).eq('id', scooter.id);
      setStep('timer');
    }
  }

  async function unlockScooter() {
    if (!rideId || !scooter) return;
    await supabase.from('rides').update({ status: 'active', start_time: new Date().toISOString() }).eq('id', rideId);
    await supabase.from('scooters').update({ status: 'in_use' }).eq('id', scooter.id);
    navigate(`/ride/${rideId}`);
  }

  async function cancelRide() {
    if (rideId) {
      await supabase.from('rides').update({ status: 'cancelled' }).eq('id', rideId);
    }
    if (scooter) {
      await supabase.from('scooters').update({ status: 'available' }).eq('id', scooter.id);
    }
    navigate('/');
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (!scooter) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <p className="text-dark-400">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => step === 'confirm' ? navigate('/') : cancelRide()} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">
          {step === 'confirm' ? 'Reservation' : step === 'timer' ? 'Allez a la station' : 'Deverrouillage'}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {step === 'confirm' && (
          <div className="w-full max-w-sm animate-fade-in text-center">
            <div className="w-20 h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Scooter {scooter.code}</h2>
            <p className="text-dark-400 text-sm mb-6">Batterie: {scooter.battery_level}%</p>

            <div className="bg-dark-800 rounded-xl p-4 mb-6 border border-dark-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dark-400">Tarif</span>
                <span className="text-white">2 DH / minute</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Caution</span>
                <span className="text-primary-400">{profile?.deposit_paid ? 'Payee' : 'Non payee'}</span>
              </div>
            </div>

            <button
              onClick={startReservation}
              disabled={!profile?.deposit_paid}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
            >
              Confirmer la reservation
            </button>
            {!profile?.deposit_paid && (
              <p className="text-error-500 text-xs mt-3">Payez la caution pour reserver</p>
            )}
          </div>
        )}

        {step === 'timer' && (
          <div className="w-full max-w-sm animate-fade-in text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="8"
                  strokeDasharray={`${(countdown / 300) * 339.3} 339.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{minutes}:{seconds.toString().padStart(2, '0')}</p>
                  <p className="text-[10px] text-dark-400">restantes</p>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-2">Allez a la station</h2>
            <p className="text-dark-400 text-sm mb-8">Scannez le QR code ou entrez le code PIN pour deverrouiller</p>

            <div className="bg-dark-800 rounded-xl p-4 mb-6 border border-dark-700">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-accent-400" />
                <div>
                  <p className="text-white text-sm font-medium">Code PIN</p>
                  <p className="text-primary-400 text-2xl font-bold tracking-widest">{scooter.pin_code}</p>
                </div>
              </div>
            </div>

            <button
              onClick={unlockScooter}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              <Lock className="w-4 h-4" />
              Deverrouiller le scooter
            </button>

            <button
              onClick={cancelRide}
              className="w-full text-dark-400 text-sm mt-4 hover:text-error-500 transition-colors"
            >
              Annuler la reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
