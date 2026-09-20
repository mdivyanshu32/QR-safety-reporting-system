import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Lock, MapPin, Zap } from 'lucide-react';

interface NavbarProps {
  currentLocation?: string;
  currentDivision?: string;
  onAdminClick: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  currentDivision,
  onAdminClick,
  onHomeClick,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-amber-500/30 px-3 py-2.5 sm:px-6 shadow-lg shadow-slate-950/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-slate-950 stroke-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
                {t('appTitle')}
              </h1>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {currentLocation && (
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full animate-pulse">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{currentLocation}</span>
            {currentDivision && <span className="opacity-75">({currentDivision})</span>}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🇮🇳 हिंदी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('adminAccess')}</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
