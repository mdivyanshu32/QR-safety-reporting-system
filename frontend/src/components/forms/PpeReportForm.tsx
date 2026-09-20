import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportSubmissionPayload } from '../../types/safety';
import { CameraIdUploader } from './CameraIdUploader';
import { EvidencePhotoPicker } from './EvidencePhotoPicker';
import { Shield, ArrowLeft, Send, Check } from 'lucide-react';

interface PpeReportFormProps {
  initialLocation?: string;
  initialDivision?: string;
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
  onCancel: () => void;
}

export const PpeReportForm: React.FC<PpeReportFormProps> = ({
  initialLocation = '',
  initialDivision = 'South Delhi',
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ReportSubmissionPayload>({
    type: 'PPE',
    employeeId: '',
    employeeName: '',
    employeePhone: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: initialLocation,
    division: initialDivision,
    subdivision: '',
    activity: '',
    ppeItem: 'Safety Gloves (11kV)',
    issueType: 'Puncture / Cracks',
    description: '',
    severity: 'HIGH',
    evidenceImages: [],
  });

  const ppeList = [
    { name: 'Helmet (Non-Conductive)', icon: '⛑️' },
    { name: 'Safety Gloves (11kV)', icon: '🧤' },
    { name: 'Safety Shoes (Dielectric)', icon: '🥾' },
    { name: 'Arc Flash Jacket', icon: '🦺' },
    { name: 'Safety Goggles', icon: '🥽' },
    { name: 'Full Body Harness', icon: '🧗' },
    { name: 'Insulated Raincoat', icon: '🧥' },
    { name: 'Other PPE Item', icon: '🛡️' },
  ];

  const ppeIssues = [
    'Puncture / Hairline Cracks',
    'Expired Dielectric Test Date',
    'Torn / Broken Strap or Buckle',
    'Missing Size / Item Not Available',
    'Worn-out Sole / Reduced Insulation',
    'Other Damage',
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
              <Shield className="w-6 h-6 text-emerald-400" />
              <span>{t('ppeReportTitle')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('ppeReportDesc')}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          {t('stepEmployeeInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeId')}</label>
            <input
              type="text"
              required
              placeholder="e.g. EMP-4109"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeName')}</label>
            <input
              type="text"
              placeholder="e.g. Amit Sharma"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeePhone')}</label>
            <input
              type="tel"
              placeholder="e.g. 9123456789"
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
              placeholder="e.g. Feeder 11kV - Janakpuri"
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
              <option value="West Delhi">West Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="North Delhi">North Delhi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          {t('selectPpe')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ppeList.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setFormData({ ...formData, ppeItem: item.name })}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                formData.ppeItem === item.name
                  ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-bold">{item.name}</span>
              </div>
              {formData.ppeItem === item.name && (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('selectPpeIssue')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ppeIssues.map((issue) => (
              <label
                key={issue}
                onClick={() => setFormData({ ...formData, issueType: issue })}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  formData.issueType === issue
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="ppeIssue"
                  checked={formData.issueType === issue}
                  onChange={() => {}}
                  className="accent-amber-500"
                />
                <span>{issue}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('description')}</label>
          <textarea
            rows={3}
            placeholder="Describe the PPE defect or issue..."
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
