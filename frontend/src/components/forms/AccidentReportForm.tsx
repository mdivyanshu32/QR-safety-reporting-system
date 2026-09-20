import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportSubmissionPayload } from '../../types/safety';
import { CameraIdUploader } from './CameraIdUploader';
import { EvidencePhotoPicker } from './EvidencePhotoPicker';
import { Activity, ArrowLeft, Send, Forward, Check } from 'lucide-react';

interface AccidentReportFormProps {
  initialLocation?: string;
  initialDivision?: string;
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
  onCancel: () => void;
}

export const AccidentReportForm: React.FC<AccidentReportFormProps> = ({
  initialLocation = '',
  initialDivision = 'Central Delhi',
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ReportSubmissionPayload>({
    type: 'ACCIDENT',
    employeeId: '',
    employeeName: '',
    employeePhone: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: initialLocation,
    division: initialDivision,
    subdivision: '',
    activity: '',
    injuryOccurred: true,
    bodyPart: 'Right Hand / Forearm',
    injuryType: 'Electrical Shock / Flash Burn',
    firstAid: true,
    hospitalRequired: false,
    immediateAction: 'First aid applied immediately. Rested in shade.',
    witnessDetails: '',
    description: '',
    severity: 'CRITICAL',
    evidenceImages: [],
  });

  const bodyParts = [
    'Right Hand / Forearm',
    'Left Hand / Forearm',
    'Face / Eyes',
    'Head / Neck',
    'Legs / Feet',
    'Chest / Back',
    'Whole Body',
  ];

  const injuryNatures = [
    'Electrical Shock / Flash Burn',
    'Physical Cut / Laceration',
    'Fall Injury / Fracture',
    'Eye Irritation / Spark In Eye',
    'Heat Stroke / Exhaustion',
    'Other Injury',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-rose-500" />
              <span>{t('accidentTitle')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('accidentDesc')}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          {t('stepEmployeeInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeId')}</label>
            <input
              type="text"
              required
              placeholder="e.g. EMP-1104"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeName')}</label>
            <input
              type="text"
              placeholder="e.g. Dharmendra Yadav"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeePhone')}</label>
            <input
              type="tel"
              placeholder="e.g. 9711223344"
              value={formData.employeePhone}
              onChange={(e) => setFormData({ ...formData, employeePhone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('location')}</label>
            <input
              type="text"
              required
              placeholder="e.g. Pole No 42 - Karol Bagh"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('division')}</label>
            <select
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="Central Delhi">Central Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="West Delhi">West Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="North Delhi">North Delhi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          {t('stepReportDetails')}
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('bodyPart')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {bodyParts.map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => setFormData({ ...formData, bodyPart: part })}
                className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between transition-colors ${
                  formData.bodyPart === part
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{part}</span>
                {formData.bodyPart === part && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('injuryType')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {injuryNatures.map((nature) => (
              <label
                key={nature}
                onClick={() => setFormData({ ...formData, injuryType: nature })}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  formData.injuryType === nature
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="injuryNature"
                  checked={formData.injuryType === nature}
                  onChange={() => {}}
                  className="accent-amber-500"
                />
                <span>{nature}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              id="firstAid"
              checked={formData.firstAid}
              onChange={(e) => setFormData({ ...formData, firstAid: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <label htmlFor="firstAid" className="text-xs font-semibold text-white cursor-pointer">
              {t('firstAid')}
            </label>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              id="hospital"
              checked={formData.hospitalRequired}
              onChange={(e) => setFormData({ ...formData, hospitalRequired: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <label htmlFor="hospital" className="text-xs font-semibold text-white cursor-pointer">
              {t('hospitalRequired')}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('immediateAction')}</label>
          <input
            type="text"
            placeholder="Action taken on-site (e.g. Burn spray applied, rested)"
            value={formData.immediateAction}
            onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">{t('witnessDetails')}</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, witnessDetails: 'None' })}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Forward className="w-3 h-3" />
              <span>{t('skip')}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Witness Name, Designation & Phone"
            value={formData.witnessDetails}
            onChange={(e) => setFormData({ ...formData, witnessDetails: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('description')}</label>
          <textarea
            rows={3}
            placeholder="Describe how the accident occurred..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <CameraIdUploader
          value={formData.idCardImage}
          onChange={(base64) => setFormData({ ...formData, idCardImage: base64 })}
        />
        <EvidencePhotoPicker
          value={formData.evidenceImages || []}
          onChange={(images) => setFormData({ ...formData, evidenceImages: images })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
        <span>{loading ? t('submitting') : t('submitReport')}</span>
      </button>
    </form>
  );
};
