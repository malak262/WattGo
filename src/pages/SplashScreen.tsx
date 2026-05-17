import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-pulse-ring" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Zap className="w-12 h-12 text-white" fill="white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
        Watt<span className="text-primary-400">Go</span>
      </h1>
      <p className="text-dark-400 text-sm mb-12">Scooters Electriques Partages</p>

      <div className="w-48 h-1 bg-dark-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-dark-500 text-xs mt-3">Chargement...</p>
    </div>
  );
}
