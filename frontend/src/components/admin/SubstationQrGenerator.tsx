import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext';
import { QrCode, Printer, MapPin, Zap } from 'lucide-react';

export const SubstationQrGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [stationName, setStationName] = useState('Okhla_33kV_Grid_Substation');
  const [division, setDivision] = useState('South_Delhi');

  const originUrl = window.location.origin;
  const qrTargetUrl = `${originUrl}/report?location=${encodeURIComponent(stationName)}&division=${encodeURIComponent(division)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{t('qrGeneratorTitle')}</h3>
            <p className="text-xs text-slate-400">Generate zero-touch safety reporting posters for field stations</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>{t('generateQr')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('substationName')}</label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('division')}</label>
          <input
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div id="printable-qr-poster" className="bg-white text-slate-950 rounded-2xl p-6 sm:p-8 max-w-md mx-auto text-center border-4 border-amber-500 shadow-2xl space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-black">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-slate-950">
            ELECTRICAL SAFETY PORTAL
          </h2>
        </div>

        <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 inline-block">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>{stationName} ({division})</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-slate-900 inline-block shadow-md">
          <QRCodeSVG value={qrTargetUrl} size={180} level="H" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-black text-slate-900 uppercase tracking-wide">
            SCAN QR TO REPORT INCIDENT / HAZARD
          </p>
          <p className="text-xs text-slate-600 font-semibold">
            स्कैन करें और तुरंत आवाज़ से रिपोर्ट दर्ज करें
          </p>
        </div>

        <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-3">
          Instant Mobile Reporting • Zero Typing Needed • Official Safety System
        </div>
      </div>
    </div>
  );
};
