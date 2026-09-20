import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportSubmissionPayload } from '../../types/safety';
import { CameraIdUploader } from './CameraIdUploader';
import { EvidencePhotoPicker } from './EvidencePhotoPicker';
import { AlertTriangle, ArrowLeft, Send, Forward } from 'lucide-react';

interface NearMissReportFormProps {
  initialLocation?: string;
  initialDivision?: string;
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
  onCancel: () => void;
}

export const NearMissReportForm: React.FC<NearMissReportFormProps> = ({
  initialLocation = '',
  initialDivision = 'South Delhi',
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ReportSubmissionPayload>({
    type: 'NEAR_MISS',
    employeeId: '',
    employeeName: '',
    employeePhone: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: initialLocation,
    division: initialDivision,
    subdivision: '',
    activity: '',
    potentialHazard: '',
    immediateAction: '',
    description: '',
    severity: 'HIGH',
    evidenceImages: [],
  });

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
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <span>{t('nearMissTitle')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('nearMissDesc')}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {t('stepEmployeeInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeId')}</label>
            <input
              type="text"
              required
              placeholder="e.g. EMP-9021"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeName')}</label>
            <input
              type="text"
              placeholder="e.g. Suresh Verma"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeePhone')}</label>
            <input
              type="tel"
              placeholder="e.g. 9988776655"
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
              placeholder="e.g. Substation 66kV - Nehru Place Grid"
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
              <option value="South Delhi">South Delhi</option>
              <option value="West Delhi">West Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="East Delhi">East Delhi</option>
              <option value="North Delhi">North Delhi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {t('stepReportDetails')}
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('activity')}</label>
          <input
            type="text"
            placeholder="e.g. Circuit Breaker Isolator Alignment"
            value={formData.activity}
            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('potentialHazard')}</label>
          <textarea
            rows={2}
            placeholder="What could have happened? (e.g., Flashover due to false open indicator)"
            value={formData.potentialHazard}
            onChange={(e) => setFormData({ ...formData, potentialHazard: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">{t('immediateAction')}</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, immediateAction: 'N/A' })}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Forward className="w-3 h-3" />
              <span>{t('skip')}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Action taken on-site (e.g., Applied discharge rod & stopped work)"
            value={formData.immediateAction}
            onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('description')}</label>
          <textarea
            rows={3}
            placeholder="Detailed description of the near miss event..."
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
