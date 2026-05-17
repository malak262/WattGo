import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Zap, MapPin, Square, Battery } from 'lucide-react';

interface Ride {
  id: string;
  scooter_id: string;
  start_time: string;
  start_latitude: number;
  start_longitude: number;
}

const PRICE_PER_MINUTE = 2;

export default function RidePage() {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [ending, setEnding] = useState(false);

  const fetchRide = useCallback(async () => {
    if (!rideId) return;
    const { data } = await supabase.from('rides').select('*').eq('id', rideId).maybeSingle();
    if (data) setRide(data);
  }, [rideId]);

  useEffect(() => { fetchRide(); }, [fetchRide]);

  useEffect(() => {
    if (!ride?.start_time) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(ride.start_time).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [ride?.start_time]);

  async function endRide() {
    if (!ride || ending) return;
    setEnding(true);
    const durationMinutes = Math.max(1, Math.ceil(elapsed / 60));
    const price = durationMinutes * PRICE_PER_MINUTE;

    await supabase.from('rides').update({
      status: 'completed',
      end_time: new Date().toISOString(),
      duration_minutes: durationMinutes,
      price,
    }).eq('id', ride.id);

    await supabase.from('scooters').update({ status: 'available' }).eq('id', ride.scooter_id);

    navigate(`/payment/${ride.id}`);
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const currentPrice = (Math.max(1, Math.ceil(elapsed / 60)) * PRICE_PER_MINUTE);

  if (!ride) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <p className="text-dark-400">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Active ride header */}
      <div className="bg-primary-500/10 border-b border-primary-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-primary-400 text-sm font-medium">Course en cours</span>
          </div>
          <span className="text-dark-400 text-xs">Scooter actif</span>
        </div>
      </div>

      {/* Timer display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full border-4 border-primary-500/20 flex items-center justify-center bg-dark-900">
            <div className="text-center">
              <p className="text-4xl font-bold text-white tabular-nums">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </p>
              <p className="text-dark-400 text-xs mt-1">duree</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-xs border border-dark-700 mb-6">
          <div className="text-center">
            <p className="text-dark-400 text-sm mb-1">Prix actuel</p>
            <p className="text-3xl font-bold text-white">{currentPrice} <span className="text-lg text-dark-400">DH</span></p>
            <p className="text-dark-500 text-xs mt-1">{PRICE_PER_MINUTE} DH / minute</p>
          </div>
        </div>

        {/* Ride info */}
        <div className="w-full max-w-xs space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-dark-800/50 rounded-xl px-4 py-3">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300 text-sm">Scooter en utilisation</span>
          </div>
          <div className="flex items-center gap-3 bg-dark-800/50 rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-accent-400" />
            <span className="text-dark-300 text-sm">GPS actif</span>
          </div>
          <div className="flex items-center gap-3 bg-dark-800/50 rounded-xl px-4 py-3">
            <Battery className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300 text-sm">Batterie en suivi</span>
          </div>
        </div>

        {/* End ride button */}
        <button
          onClick={endRide}
          disabled={ending}
          className="w-full max-w-xs bg-error-500/10 border border-error-500/30 text-error-500 font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-error-500/20 transition-all"
        >
          <Square className="w-5 h-5" fill="currentColor" />
          {ending ? 'Fin de course...' : 'Terminer le trajet'}
        </button>
      </div>
    </div>
  );
}
