import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, TriangleAlert as AlertTriangle, Battery, MapPin, ArrowLeft, Shield, CreditCard, Activity } from 'lucide-react';

interface Scooter {
  id: string;
  code: string;
  status: string;
  battery_level: number;
  latitude: number;
  longitude: number;
  station_id: string;
}

interface AlertItem {
  id: string;
  type: string;
  message: string;
  resolved: boolean;
  created_at: string;
  scooter_id: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  deposit_paid: boolean;
  is_admin: boolean;
  created_at: string;
}

const scooterColors: Record<string, string> = {
  available: '#10b981',
  reserved: '#f97316',
  in_use: '#3b82f6',
  maintenance: '#ef4444',
};

function makeScooterIcon(status: string) {
  const color = scooterColors[status] || '#64748b';
  return new L.DivIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const OUJDA_CENTER: [number, number] = [34.6650, -1.9080];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'alerts' | 'users'>('map');

  const fetchData = useCallback(async () => {
    const { data: scooterData } = await supabase.from('scooters').select('*');
    const { data: alertData } = await supabase.from('alerts').select('*').eq('resolved', false).order('created_at', { ascending: false });
    const { data: userData } = await supabase.from('profiles').select('*');
    if (scooterData) setScooters(scooterData);
    if (alertData) setAlerts(alertData);
    if (userData) setUsers(userData);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-6">
        <Shield className="w-16 h-16 text-dark-600 mb-4" />
        <h2 className="text-white font-semibold text-lg mb-2">Acces refuse</h2>
        <p className="text-dark-400 text-sm mb-6">Vous n'avez pas les droits administrateur</p>
        <button onClick={() => navigate('/')} className="text-primary-400 text-sm hover:text-primary-300">
          Retour a la carte
        </button>
      </div>
    );
  }

  const statusCounts = {
    available: scooters.filter(s => s.status === 'available').length,
    reserved: scooters.filter(s => s.status === 'reserved').length,
    in_use: scooters.filter(s => s.status === 'in_use').length,
    maintenance: scooters.filter(s => s.status === 'maintenance').length,
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-800">
        <button onClick={() => navigate('/')} className="text-dark-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-white">Dashboard Admin</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 py-4">
        <div className="bg-dark-800 rounded-xl p-3 border border-dark-700 text-center">
          <Zap className="w-4 h-4 text-primary-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{scooters.length}</p>
          <p className="text-dark-500 text-[10px]">Scooters</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-3 border border-dark-700 text-center">
          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{users.length}</p>
          <p className="text-dark-500 text-[10px]">Utilisateurs</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-3 border border-dark-700 text-center">
          <AlertTriangle className="w-4 h-4 text-accent-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{alerts.length}</p>
          <p className="text-dark-500 text-[10px]">Alertes</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-3 border border-dark-700 text-center">
          <Activity className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{statusCounts.in_use}</p>
          <p className="text-dark-500 text-[10px]">En cours</p>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex gap-2 px-4 mb-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-1.5 bg-dark-800 rounded-lg px-2.5 py-1.5 border border-dark-700">
            <div className="w-2 h-2 rounded-full" style={{ background: scooterColors[status] }} />
            <span className="text-dark-300 text-xs capitalize">{status === 'in_use' ? 'actif' : status === 'available' ? 'dispo' : status === 'reserved' ? 'reserve' : 'maintenance'}</span>
            <span className="text-white text-xs font-medium">{count}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-800">
        {(['map', 'alerts', 'users'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            {tab === 'map' ? 'Carte' : tab === 'alerts' ? 'Alertes' : 'Utilisateurs'}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {activeTab === 'map' && (
          <div className="h-[400px]">
            <MapContainer center={OUJDA_CENTER} zoom={14} className="h-full w-full" zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              {scooters.map(scooter => (
                <Marker key={scooter.id} position={[scooter.latitude, scooter.longitude]} icon={makeScooterIcon(scooter.status)}>
                  <Popup>
                    <div className="text-dark-900">
                      <p className="font-semibold">{scooter.code}</p>
                      <p className="text-xs">Statut: {scooter.status}</p>
                      <p className="text-xs">Batterie: {scooter.battery_level}%</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="px-4 py-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-16">
                <AlertTriangle className="w-12 h-12 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-400 text-sm">Aucune alerte active</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      alert.type === 'zone_violation' ? 'bg-error-500/10' : alert.type === 'low_battery' ? 'bg-accent-500/10' : 'bg-warning-500/10'
                    }`}>
                      {alert.type === 'zone_violation' ? <MapPin className="w-4 h-4 text-error-500" /> :
                       alert.type === 'low_battery' ? <Battery className="w-4 h-4 text-accent-400" /> :
                       <AlertTriangle className="w-4 h-4 text-warning-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{alert.message}</p>
                      <p className="text-dark-500 text-xs">{new Date(alert.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="px-4 py-4 space-y-2">
            {users.map(u => (
              <div key={u.id} className="bg-dark-800 rounded-xl p-4 border border-dark-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-dark-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{u.full_name || 'Utilisateur'}</p>
                  <p className="text-dark-500 text-xs">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {u.deposit_paid && <CreditCard className="w-4 h-4 text-primary-400" />}
                  {u.is_admin && <Shield className="w-4 h-4 text-accent-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
