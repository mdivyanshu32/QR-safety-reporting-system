import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportSubmissionPayload } from '../../types/safety';
import { CameraIdUploader } from './CameraIdUploader';
import { EvidencePhotoPicker } from './EvidencePhotoPicker';
import { Flame, ArrowLeft, Send, Forward } from 'lucide-react';

interface IncidentReportFormProps {
  initialLocation?: string;
  initialDivision?: string;
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
  onCancel: () => void;
}

export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  initialLocation = '',
  initialDivision = 'West Delhi',
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ReportSubmissionPayload>({
    type: 'INCIDENT',
    employeeId: '',
    employeeName: '',
    employeePhone: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: initialLocation,
    division: initialDivision,
    subdivision: '',
    activity: '',
    equipmentInvolved: 'Distribution Transformer LT Box',
    workStopped: true,
    injured: false,
    immediateAction: 'Feeder tripped from substation. Caution tape applied.',
    witnessDetails: '',
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
              <Flame className="w-6 h-6 text-orange-400" />
              <span>{t('incidentTitle')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('incidentDesc')}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
          {t('stepEmployeeInfo')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeId')}</label>
            <input
              type="text"
              required
              placeholder="e.g. EMP-3320"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeeName')}</label>
            <input
              type="text"
              placeholder="e.g. Vikram Singh"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('employeePhone')}</label>
            <input
              type="tel"
              placeholder="e.g. 9543210987"
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
              placeholder="e.g. 11kV Transformer - Dwarka Sec 10"
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
          {t('stepReportDetails')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('equipmentInvolved')}</label>
            <input
              type="text"
              placeholder="e.g. 11kV Feeder Line / LT Busbar"
              value={formData.equipmentInvolved}
              onChange={(e) => setFormData({ ...formData, equipmentInvolved: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('activity')}</label>
            <input
              type="text"
              placeholder="e.g. Fuse replacement under shutdown"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <input
            type="checkbox"
            id="workStopped"
            checked={formData.workStopped}
            onChange={(e) => setFormData({ ...formData, workStopped: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded"
          />
          <label htmlFor="workStopped" className="text-xs font-semibold text-white cursor-pointer">
            {t('workStopped')}
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">{t('immediateAction')}</label>
          <input
            type="text"
            placeholder="e.g. Feeder tripped, site barricaded"
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
            placeholder="Describe electrical flashover, tripping, or damage..."
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
