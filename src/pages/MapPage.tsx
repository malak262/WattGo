import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Zap, Battery, Navigation, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
}

interface Scooter {
  id: string;
  station_id: string;
  code: string;
  battery_level: number;
  status: string;
  latitude: number;
  longitude: number;
  pin_code: string;
}

const stationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const scooterIcon = new L.DivIcon({
  html: `<div style="background:#10b981;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

const OUJDA_CENTER: [number, number] = [34.6650, -1.9080];

function RecenterButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView(OUJDA_CENTER, 14)}
      className="absolute bottom-6 right-6 z-[1000] bg-dark-800 border border-dark-700 p-3 rounded-xl shadow-lg hover:bg-dark-700 transition-all"
    >
      <Navigation className="w-5 h-5 text-primary-400" />
    </button>
  );
}

export default function MapPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stationScooters, setStationScooters] = useState<Scooter[]>([]);
  const [showSheet, setShowSheet] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: stationData } = await supabase.from('stations').select('*');
    const { data: scooterData } = await supabase.from('scooters').select('*').eq('status', 'available');
    if (stationData) setStations(stationData);
    if (scooterData) setScooters(scooterData);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleStationClick(station: Station) {
    setSelectedStation(station);
    setStationScooters(scooters.filter(s => s.station_id === station.id));
    setShowSheet(true);
  }

  async function handleReserve(scooter: Scooter) {
    if (!profile?.deposit_paid) {
      navigate('/profile');
      return;
    }
    navigate(`/book/${scooter.id}`);
  }

  const availableCount = (stationId: string) =>
    scooters.filter(s => s.station_id === stationId).length;

  return (
    <div className="h-screen w-screen relative bg-dark-950">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-dark-950/90 backdrop-blur-md border-b border-dark-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-bold text-white">Watt<span className="text-primary-400">Go</span></span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 bg-dark-800 rounded-full flex items-center justify-center border border-dark-700"
          >
            <User className="w-4 h-4 text-dark-300" />
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={OUJDA_CENTER}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {stations.map(station => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={stationIcon}
            eventHandlers={{ click: () => handleStationClick(station) }}
          >
            <Popup>
              <div className="text-dark-900 font-semibold">{station.name}</div>
              <div className="text-dark-600 text-xs">{availableCount(station.id)} scooters disponibles</div>
            </Popup>
          </Marker>
        ))}
        {scooters.map(scooter => (
          <Marker
            key={scooter.id}
            position={[scooter.latitude, scooter.longitude]}
            icon={scooterIcon}
            eventHandlers={{ click: () => handleStationClick(stations.find(s => s.id === scooter.station_id)!) }}
          >
            <Popup>
              <div className="text-dark-900 font-semibold">{scooter.code}</div>
              <div className="text-dark-600 text-xs">Batterie: {scooter.battery_level}%</div>
            </Popup>
          </Marker>
        ))}
        <RecenterButton />
      </MapContainer>

      {/* Station info badge */}
      <div className="absolute top-16 left-4 z-[1000] bg-dark-800/90 backdrop-blur-md rounded-xl px-3 py-2 border border-dark-700 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary-400" />
        <span className="text-sm text-dark-200">Oujda</span>
        <span className="text-xs text-dark-400">{scooters.length} scooters</span>
      </div>

      {/* Bottom Sheet */}
      {showSheet && selectedStation && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-slide-up">
          <div className="bg-dark-900 border-t border-dark-700 rounded-t-2xl p-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{selectedStation.name}</h3>
                <p className="text-dark-400 text-sm">{selectedStation.address}</p>
              </div>
              <button
                onClick={() => setShowSheet(false)}
                className="text-dark-400 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg px-3 py-1.5 text-sm text-primary-400">
                {stationScooters.length} disponibles
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-dark-400">
                {selectedStation.capacity} places
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stationScooters.map(scooter => (
                <div key={scooter.id} className="flex items-center justify-between bg-dark-800 rounded-xl px-4 py-3 border border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{scooter.code}</p>
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3 text-primary-400" />
                        <span className="text-xs text-dark-400">{scooter.battery_level}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReserve(scooter)}
                    className="bg-primary-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-600 transition-all"
                  >
                    Reserver
                  </button>
                </div>
              ))}
              {stationScooters.length === 0 && (
                <p className="text-dark-500 text-sm text-center py-4">Aucun scooter disponible</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 z-[999] bg-dark-900/95 backdrop-blur-md border-t border-dark-800">
        <div className="flex items-center justify-around py-2 pb-4">
          <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-primary-400">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px]">Carte</span>
          </button>
          <button onClick={() => navigate('/rides')} className="flex flex-col items-center gap-1 text-dark-500">
            <Zap className="w-5 h-5" />
            <span className="text-[10px]">Courses</span>
          </button>
          <button onClick={() => navigate('/subscriptions')} className="flex flex-col items-center gap-1 text-dark-500">
            <Navigation className="w-5 h-5" />
            <span className="text-[10px]">Abonnements</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-dark-500">
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
