import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Shield, CreditCard, Users, BarChart3, Smartphone, Navigation, Battery, Clock, Award, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const slides = [
  {
    id: 0,
    title: 'WattGo',
    subtitle: 'Scooters Electriques Partages pour Etudiants',
    tagline: 'Oujda, Maroc',
    icon: Zap,
    gradient: 'from-primary-500 to-primary-700',
    content: 'hero' as const,
  },
  {
    id: 1,
    title: 'Le Probleme',
    subtitle: 'La mobilite etudiante a Oujda',
    icon: MapPin,
    gradient: 'from-accent-500 to-accent-700',
    content: 'problem' as const,
  },
  {
    id: 2,
    title: 'Notre Solution',
    subtitle: 'WattGo - Scooters electriques en libre-service',
    icon: Zap,
    gradient: 'from-primary-500 to-primary-700',
    content: 'solution' as const,
  },
  {
    id: 3,
    title: 'Comment ca marche',
    subtitle: '4 etapes simples',
    icon: Navigation,
    gradient: 'from-blue-500 to-blue-700',
    content: 'howitworks' as const,
  },
  {
    id: 4,
    title: 'Application Mobile',
    subtitle: 'Experience utilisateur fluide',
    icon: Smartphone,
    gradient: 'from-primary-500 to-primary-700',
    content: 'app' as const,
  },
  {
    id: 5,
    title: 'Carte Interactive',
    subtitle: 'Trouvez un scooter en temps reel',
    icon: MapPin,
    gradient: 'from-emerald-500 to-emerald-700',
    content: 'map' as const,
  },
  {
    id: 6,
    title: 'Reservation & Deverrouillage',
    subtitle: 'Simple et rapide',
    icon: Shield,
    gradient: 'from-blue-500 to-blue-700',
    content: 'booking' as const,
  },
  {
    id: 7,
    title: 'Course en Cours',
    subtitle: 'Suivi en temps reel',
    icon: Clock,
    gradient: 'from-primary-500 to-primary-700',
    content: 'ride' as const,
  },
  {
    id: 8,
    title: 'Paiement & Tarification',
    subtitle: 'Transparent et abordable',
    icon: CreditCard,
    gradient: 'from-accent-500 to-accent-700',
    content: 'payment' as const,
  },
  {
    id: 9,
    title: 'Abonnements',
    subtitle: 'Des prix pour les etudiants',
    icon: Award,
    gradient: 'from-primary-500 to-primary-700',
    content: 'subscriptions' as const,
  },
  {
    id: 10,
    title: 'Profil Etudiant',
    subtitle: 'Badges, historique et caution',
    icon: Users,
    gradient: 'from-blue-500 to-blue-700',
    content: 'profile' as const,
  },
  {
    id: 11,
    title: 'Dashboard Admin',
    subtitle: 'Gestion en temps reel',
    icon: BarChart3,
    gradient: 'from-dark-600 to-dark-800',
    content: 'admin' as const,
  },
  {
    id: 12,
    title: 'Stack Technique',
    subtitle: 'Technologies modernes',
    icon: Battery,
    gradient: 'from-primary-500 to-primary-700',
    content: 'tech' as const,
  },
  {
    id: 13,
    title: 'WattGo',
    subtitle: 'La mobilite etudiante reimaginee',
    icon: Zap,
    gradient: 'from-primary-500 to-primary-700',
    content: 'closing' as const,
  },
];

function ProblemSlide() {
  const points = [
    { icon: '🚌', text: 'Transport public limite a Oujda' },
    { icon: '🚶', text: 'Longues distances entre campus et ville' },
    { icon: '💰', text: 'Cout eleve des taxis pour les etudiants' },
    { icon: '🌱', text: 'Besoin de solutions de mobilite ecologique' },
    { icon: '📱', text: 'Aucune solution de mobilita partagee existante' },
  ];
  return (
    <div className="space-y-4">
      {points.map((p, i) => (
        <div key={i} className="flex items-center gap-4 bg-dark-800/50 rounded-xl px-5 py-4 border border-dark-700 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <span className="text-2xl">{p.icon}</span>
          <span className="text-dark-200 text-lg">{p.text}</span>
        </div>
      ))}
    </div>
  );
}

function SolutionSlide() {
  const features = [
    { icon: Zap, text: 'Scooters 100% electriques', color: 'text-primary-400' },
    { icon: MapPin, text: '8 stations a travers Oujda', color: 'text-blue-400' },
    { icon: Smartphone, text: 'Application mobile intuitive', color: 'text-accent-400' },
    { icon: Shield, text: 'Caution securisee (100-200 DH)', color: 'text-emerald-400' },
    { icon: CreditCard, text: 'Paiement flexible', color: 'text-primary-300' },
  ];
  return (
    <div className="space-y-3">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-4 bg-dark-800/50 rounded-xl px-5 py-4 border border-dark-700 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <f.icon className={`w-6 h-6 ${f.color}`} />
          <span className="text-dark-200 text-lg">{f.text}</span>
        </div>
      ))}
    </div>
  );
}

function HowItWorksSlide() {
  const steps = [
    { num: '1', title: 'Inscrivez-vous', desc: 'Carte etudiant + telephone + caution', icon: Users },
    { num: '2', title: 'Trouvez un scooter', desc: 'Carte interactive en temps reel', icon: MapPin },
    { num: '3', title: 'Reservez & deverrouillez', desc: 'Code PIN ou QR code', icon: Shield },
    { num: '4', title: 'Roulez & payez', desc: '2 DH/min, paiement flexible', icon: CreditCard },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {steps.map((s, i) => (
        <div key={i} className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700 text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <s.icon className="w-6 h-6 text-primary-400" />
          </div>
          <div className="text-primary-400 text-xs font-bold mb-1">ETAPE {s.num}</div>
          <h3 className="text-white font-semibold mb-1">{s.title}</h3>
          <p className="text-dark-400 text-sm">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function AppScreensSlide() {
  const screens = [
    { name: 'Splash', desc: 'Ecran de chargement anime', color: 'from-primary-500 to-primary-700' },
    { name: 'Login', desc: 'Authentification email', color: 'from-blue-500 to-blue-700' },
    { name: 'Inscription', desc: 'Carte etudiant + caution', color: 'from-accent-500 to-accent-700' },
    { name: 'Carte', desc: 'Stations en temps reel', color: 'from-emerald-500 to-emerald-700' },
    { name: 'Reservation', desc: 'Timer 5 min + PIN', color: 'from-primary-500 to-primary-700' },
    { name: 'Course', desc: 'Chronometre + prix live', color: 'from-blue-500 to-blue-700' },
    { name: 'Paiement', desc: 'Carte, virement, cash', color: 'from-accent-500 to-accent-700' },
    { name: 'Profil', desc: 'Badges + historique', color: 'from-emerald-500 to-emerald-700' },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {screens.map((s, i) => (
        <div key={i} className="bg-dark-800/50 rounded-xl p-3 border border-dark-700 text-center animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <p className="text-white text-sm font-medium">{s.name}</p>
          <p className="text-dark-500 text-[10px]">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function MapFeatureSlide() {
  return (
    <div className="space-y-4">
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold mb-3">Fonctionnalites Carte</h3>
        <div className="space-y-3">
          {[
            { icon: MapPin, text: '8 stations a Oujda', color: 'text-primary-400' },
            { icon: Zap, text: '20 scooters en temps reel', color: 'text-accent-400' },
            { icon: Battery, text: 'Niveau de batterie visible', color: 'text-emerald-400' },
            { icon: Navigation, text: 'Geolocalisation GPS', color: 'text-blue-400' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <f.icon className={`w-5 h-5 ${f.color}`} />
              <span className="text-dark-200">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold mb-2">Stations</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Universite Mohammed I', 'Place 9 Avril', 'Gare Routiere', 'Hay Al Amal', 'Faculte de Droit', 'Centre Ville', 'Sidi Yahia', 'ENCG Oujda'].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-dark-300">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingSlide() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { step: 'Confirmer', desc: 'Voir le scooter et le tarif', icon: Shield },
          { step: 'Timer 5 min', desc: 'Allez a la station', icon: Clock },
          { step: 'Deverrouiller', desc: 'Code PIN ou QR', icon: Zap },
        ].map((s, i) => (
          <div key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
            <s.icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">{s.step}</p>
            <p className="text-dark-500 text-xs">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
        <p className="text-primary-300 text-sm">Le scooter est reserve pendant 5 minutes. Si vous ne venez pas, la reservation est annulee automatiquement.</p>
      </div>
    </div>
  );
}

function RideSlide() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Chronometre', value: 'Temps reel', icon: Clock, color: 'text-primary-400' },
          { label: 'Prix live', value: '2 DH/min', icon: CreditCard, color: 'text-accent-400' },
          { label: 'GPS tracking', value: 'Position visible', icon: Navigation, color: 'text-blue-400' },
          { label: 'Batterie', value: 'Suivi en direct', icon: Battery, color: 'text-emerald-400' },
        ].map((f, i) => (
          <div key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <f.icon className={`w-6 h-6 ${f.color}`} />
            <div>
              <p className="text-white font-medium text-sm">{f.label}</p>
              <p className="text-dark-500 text-xs">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 text-center">
        <p className="text-dark-400 text-sm">Bouton</p>
        <p className="text-error-500 font-semibold mt-1">Terminer le trajet</p>
      </div>
    </div>
  );
}

function PaymentSlide() {
  return (
    <div className="space-y-4">
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold mb-4">Tarification</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Tarif standard</span>
            <span className="text-white font-bold text-xl">2 DH<span className="text-sm text-dark-400">/min</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Abonnement mensuel</span>
            <span className="text-primary-400 font-bold">1 DH/min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Abonnement semestriel</span>
            <span className="text-primary-400 font-bold">0.80 DH/min</span>
          </div>
        </div>
      </div>
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold mb-3">Modes de paiement</h3>
        <div className="space-y-2">
          {[
            { icon: CreditCard, text: 'Carte bancaire (Visa, Mastercard)' },
            { icon: Shield, text: 'Virement bancaire' },
            { icon: Users, text: 'Cash en agence' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 text-dark-200">
              <m.icon className="w-5 h-5 text-primary-400" />
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscriptionsSlide() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold text-lg mb-1">Mensuel</h3>
        <p className="text-primary-400 text-3xl font-bold mb-3">120 <span className="text-sm text-dark-400">DH</span></p>
        <ul className="space-y-2 text-sm">
          {['Courses illimitees', '1 DH/min', 'Priorite reservation', 'Support 24/7'].map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-dark-300">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-primary-500/10 rounded-2xl p-5 border border-primary-500/30 relative">
        <div className="absolute -top-2.5 right-4 bg-primary-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">POPULAIRE</div>
        <h3 className="text-white font-semibold text-lg mb-1">Semestriel</h3>
        <p className="text-primary-400 text-3xl font-bold mb-3">600 <span className="text-sm text-dark-400">DH</span></p>
        <ul className="space-y-2 text-sm">
          {['Economie 120 DH', '0.80 DH/min', 'Courses illimitees', 'Priorite reservation', 'Support 24/7', 'Badge exclusif'].map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-dark-200">
              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProfileSlide() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Infos personnelles', desc: 'Nom, telephone, carte' },
          { icon: Shield, label: 'Statut caution', desc: '100-200 DH requise' },
          { icon: Award, label: 'Badges fidelite', desc: 'Recompenses' },
        ].map((f, i) => (
          <div key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <f.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">{f.label}</p>
            <p className="text-dark-500 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-dark-800/50 rounded-2xl p-5 border border-dark-700">
        <h3 className="text-white font-semibold mb-3">Badges disponibles</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Premier trajet', desc: '1ere course terminee' },
            { name: '5 courses', desc: '5 courses completees' },
            { name: 'Eco Rider', desc: '10 courses ecologiques' },
            { name: 'Fidelite', desc: 'Abonnement actif' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2 bg-dark-900/50 rounded-lg px-3 py-2">
              <Award className="w-4 h-4 text-primary-400" />
              <div>
                <p className="text-white text-xs font-medium">{b.name}</p>
                <p className="text-dark-500 text-[10px]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSlide() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: MapPin, label: 'Carte temps reel', desc: 'Tous les scooters en direct', color: 'text-primary-400' },
          { icon: BarChart3, label: 'Statistiques', desc: 'Scooters, utilisateurs, alertes', color: 'text-blue-400' },
          { icon: Eye, label: 'Alertes GPS', desc: 'Sortie de zone detectee', color: 'text-error-500' },
          { icon: Users, label: 'Gestion utilisateurs', desc: 'Profils, paiements, caution', color: 'text-accent-400' },
        ].map((f, i) => (
          <div key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <f.icon className={`w-6 h-6 ${f.color} mb-2`} />
            <p className="text-white font-medium text-sm">{f.label}</p>
            <p className="text-dark-500 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
        <h3 className="text-white font-semibold text-sm mb-2">Indicateurs en temps reel</h3>
        <div className="flex gap-3">
          {[
            { label: 'Disponibles', color: '#10b981' },
            { label: 'Reserves', color: '#f97316' },
            { label: 'En cours', color: '#3b82f6' },
            { label: 'Maintenance', color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-dark-400 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechSlide() {
  const stack = [
    { category: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 8'] },
    { category: 'Carte', items: ['Leaflet', 'React-Leaflet', 'CARTO Dark Tiles'] },
    { category: 'Backend', items: ['Supabase Auth', 'PostgreSQL', 'Row Level Security', 'Edge Functions'] },
    { category: 'Infra', items: ['Real-time subscriptions', 'Auto profile triggers', 'Indexed queries'] },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {stack.map((s, i) => (
        <div key={i} className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <h3 className="text-primary-400 font-semibold text-sm mb-2">{s.category}</h3>
          <ul className="space-y-1.5">
            {s.items.map((item, j) => (
              <li key={j} className="flex items-center gap-2 text-dark-300 text-sm">
                <div className="w-1 h-1 bg-primary-400 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ClosingSlide() {
  return (
    <div className="text-center space-y-6">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-pulse-ring" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 mx-auto">
          <Zap className="w-12 h-12 text-white" fill="white" />
        </div>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">Watt<span className="text-primary-400">Go</span></h2>
        <p className="text-dark-400 text-lg">La mobilite etudiante reimaginee a Oujda</p>
      </div>
      <div className="flex justify-center gap-4">
        {[
          { icon: Zap, label: 'Electrique' },
          { icon: MapPin, label: 'Oujda' },
          { icon: Users, label: 'Etudiants' },
          { icon: Shield, label: 'Securise' },
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <f.icon className="w-5 h-5 text-primary-400" />
            <span className="text-dark-400 text-xs">{f.label}</span>
          </div>
        ))}
      </div>
      <p className="text-dark-500 text-sm">Merci pour votre attention</p>
    </div>
  );
}

const contentComponents: Record<string, () => React.ReactElement> = {
  problem: ProblemSlide,
  solution: SolutionSlide,
  howitworks: HowItWorksSlide,
  app: AppScreensSlide,
  map: MapFeatureSlide,
  booking: BookingSlide,
  ride: RideSlide,
  payment: PaymentSlide,
  subscriptions: SubscriptionsSlide,
  profile: ProfileSlide,
  admin: AdminSlide,
  tech: TechSlide,
  closing: ClosingSlide,
};

export default function PresentationPage() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrent(c => Math.min(c + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrent(c => Math.max(c - 1, 0));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const ContentComponent = contentComponents[slide.content];

  async function downloadPptx() {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pptx`;
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(apiUrl, { headers });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'WattGo-Presentation.pptx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col" onClick={() => setCurrent(c => Math.min(c + 1, slides.length - 1))}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-sm">Watt<span className="text-primary-400">Go</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); downloadPptx(); }}
            className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            PPTX
          </button>
          <span className="text-dark-500 text-xs">{current + 1} / {slides.length}</span>
          <div className="w-32 h-1 bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 overflow-y-auto" key={current}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className={`w-14 h-14 bg-gradient-to-br ${slide.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <slide.icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{slide.title}</h1>
            <p className="text-dark-400">{slide.subtitle}</p>
          </div>

          {/* Content */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            {ContentComponent && <ContentComponent />}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-dark-800">
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(c => Math.max(c - 1, 0)); }}
          className={`p-2 rounded-lg transition-all ${current === 0 ? 'text-dark-700' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
          disabled={current === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary-400 w-6' : 'bg-dark-600 hover:bg-dark-500'}`}
            />
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setCurrent(c => Math.min(c + 1, slides.length - 1)); }}
          className={`p-2 rounded-lg transition-all ${current === slides.length - 1 ? 'text-dark-700' : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
          disabled={current === slides.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
