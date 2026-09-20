import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { ReportType } from '../types/safety';
import { Mic, Wrench, Shield, AlertTriangle, Flame, Activity, ChevronRight, Sparkles } from 'lucide-react';

interface ReportCardSelectorProps {
  onSelectType: (type: ReportType) => void;
  onVoiceStart: () => void;
}

export const ReportCardSelector: React.FC<ReportCardSelectorProps> = ({
  onSelectType,
  onVoiceStart,
}) => {
  const { t } = useLanguage();

  const categories: {
    type: ReportType;
    titleKey: string;
    descKey: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    badgeColor: string;
  }[] = [
    {
      type: 'NEAR_MISS',
      titleKey: 'nearMissTitle',
      descKey: 'nearMissDesc',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      color: 'from-amber-950/60 to-slate-900',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      type: 'INCIDENT',
      titleKey: 'incidentTitle',
      descKey: 'incidentDesc',
      icon: <Flame className="w-8 h-8 text-orange-400" />,
      color: 'from-orange-950/60 to-slate-900',
      borderColor: 'border-orange-500/40 hover:border-orange-400',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
    {
      type: 'ACCIDENT',
      titleKey: 'accidentTitle',
      descKey: 'accidentDesc',
      icon: <Activity className="w-8 h-8 text-rose-500" />,
      color: 'from-rose-950/60 to-slate-900',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      type: 'TOOL',
      titleKey: 'toolReportTitle',
      descKey: 'toolReportDesc',
      icon: <Wrench className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-950/60 to-slate-900',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      type: 'PPE',
      titleKey: 'ppeReportTitle',
      descKey: 'ppeReportDesc',
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-950/60 to-slate-900',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      <div 
        onClick={onVoiceStart}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 p-0.5 shadow-2xl shadow-amber-500/25 cursor-pointer group transform hover:-translate-y-0.5 transition-all"
      >
        <div className="bg-slate-950/90 rounded-[14px] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 backdrop-blur">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform animate-pulse-ring">
                <Mic className="w-9 h-9 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3 fill-slate-950" /> AI VOICE
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {t('voiceReportCta')}
              </h2>
              <p className="text-sm text-amber-200/90 mt-1 font-medium">
                {t('voiceReportSub')}
              </p>
            </div>
          </div>

          <button className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-base px-6 py-3.5 rounded-xl shadow-lg hover:from-amber-300 hover:to-amber-400 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-all">
            <span>START VOICE INTERVIEW</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          {t('selectReportType')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          {t('selectReportTypeSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.type}
            onClick={() => onSelectType(cat.type)}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${cat.color} p-5 border ${cat.borderColor} shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/50 shadow-inner">
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                  MANUAL FORM
                </span>
              </div>

              <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                {t(cat.titleKey)}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                {t(cat.descKey)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>FILL FORM</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
