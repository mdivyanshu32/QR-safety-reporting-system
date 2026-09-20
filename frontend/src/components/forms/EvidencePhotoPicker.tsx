import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ImagePlus, X } from 'lucide-react';

interface EvidencePhotoPickerProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxPhotos?: number;
}

export const EvidencePhotoPicker: React.FC<EvidencePhotoPickerProps> = ({
  value = [],
  onChange,
  maxPhotos = 5,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...value];
    const remainingSlots = maxPhotos - newImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    let processedCount = 0;
    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          onChange(newImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {t('uploadEvidence')}
        </label>
        <span className="text-xs font-semibold text-amber-400">
          {value.length} / {maxPhotos} Photos
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
        {value.map((img, idx) => (
          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square shadow-md">
            <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 hover:text-rose-300 p-1 rounded-full shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {value.length < maxPhotos && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/60 hover:bg-slate-900 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
            />
            <ImagePlus className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-bold text-slate-300 text-center px-1">
              {t('addMorePhotos')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
