import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, Clock, ArrowLeft, CreditCard } from 'lucide-react';

interface Ride {
  id: string;
  status: string;
  duration_minutes: number | null;
  price: number | null;
  start_time: string;
  end_time: string | null;
}

export default function RidesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['completed', 'cancelled'])
      .order('created_at', { ascending: false });
    if (data) setRides(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const statusLabel = (status: string) => {
    switch (status) {
      case 'completed': return { text: 'Terminee', color: 'text-primary-400 bg-primary-500/10' };
      case 'cancelled': return { text: 'Annulee', color: 'text-error-500 bg-error-500/10' };
      default: return { text: status, color: 'text-dark-400 bg-dark-800' };
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => navigate('/')} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">Historique des courses</h1>
      </div>

      <div className="flex-1 px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-dark-400">Chargement...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-dark-500" />
            </div>
            <p className="text-dark-400 text-sm">Aucune course pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rides.map(ride => {
              const status = statusLabel(ride.status);
              return (
                <div key={ride.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                    <span className="text-dark-500 text-xs">
                      {new Date(ride.start_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-dark-400" />
                      <span className="text-white text-sm">{ride.duration_minutes ?? '-'} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-dark-400" />
                      <span className="text-primary-400 text-sm font-medium">{ride.price ?? '-'} DH</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-3 h-3 text-dark-500" />
                    <span className="text-dark-500 text-xs">
                      {new Date(ride.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      {ride.end_time && ` - ${new Date(ride.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
