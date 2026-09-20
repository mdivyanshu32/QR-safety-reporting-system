import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CameraIdUploaderProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export const CameraIdUploader: React.FC<CameraIdUploaderProps> = ({ value, onChange }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
        {t('uploadIdCard')} <span className="text-slate-400 font-normal">(Optional / इच्छानुसार)</span>
      </label>

      {value ? (
        <div className="relative rounded-xl border border-emerald-500/50 bg-slate-900 p-3 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={value} 
              alt="ID Card Preview" 
              className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow" 
            />
            <div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>ID Card Captured</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Photo ready for verification</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('retakePhoto')}</span>
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/60 hover:bg-slate-900 rounded-xl p-5 text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 transition-colors">
            <Camera className="w-6 h-6" />
          </div>

          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
            Tap to Snap / Upload Gate Pass or ID Card
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports Camera snapshot or Gallery selection
          </p>
        </div>
      )}
    </div>
  );
};
