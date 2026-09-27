import React, { useState } from 'react';
import { Wrench, ShieldCheck, Camera, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { ReportSubmissionPayload } from '../types/safety';

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  passed: boolean;
  notes: string;
}

interface ToolChecklistProps {
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
}

export const ToolChecklist: React.FC<ToolChecklistProps> = ({ onSubmit }) => {
  const { language } = useLanguage();
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [location, setLocation] = useState<string>('Main Substation Yard');
  const [division, setDivision] = useState<string>('South Delhi');
  const [recipientEmail, setRecipientEmail] = useState<string>('safety.officer@powergrid.in');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'vde_tools',
      titleEn: '1000V Insulated VDE Pliers / Screwdrivers crack-free inspection',
      titleHi: '1000V इंसुलेटेड पेचकस और प्लायर्स पर कोई दरार या क्षति नहीं है',
      category: 'Hand Tools',
      passed: true,
      notes: '',
    },
    {
      id: 'gloves',
      titleEn: 'Dielectric High Voltage Gloves (Valid Test Date & No Air Leak)',
      titleHi: 'हाई वोल्टेज दस्ताने (वैध टेस्ट तारीख एवं एयर लीक फ्री)',
      category: 'PPE / Insulation',
      passed: true,
      notes: '',
    },
    {
      id: 'grounding_rod',
      titleEn: 'HT Discharge Rod & Earthing Cable Clamp Cleanliness & Grip',
      titleHi: 'HT डिस्चार्ज रॉड और अर्थिंग केबल क्लैंप मजबूत एवं साफ़ है',
      category: 'Earthing Equipment',
      passed: true,
      notes: '',
    },
    {
      id: 'multimeter',
      titleEn: 'Multimeter & High Voltage Detector Calibration Validity Tag',
      titleHi: 'मल्टीमीटर और हाई वोल्टेज डिटेक्टर पर कैलिब्रेशन टैग लगा है',
      category: 'Testing Instruments',
      passed: true,
      notes: '',
    },
    {
      id: 'ladder',
      titleEn: 'FRP Fiberglass Insulated Extension Ladder Rungs & Anti-Slip Shoes',
      titleHi: 'FRP फाइबरग्लास सीढ़ी के डंडे और रबर शूज पूरी तरह सुरक्षित हैं',
      category: 'Climbing Tools',
      passed: true,
      notes: '',
    },
    {
      id: 'harness',
      titleEn: 'Full Body Safety Harness Double Lanyard & Shock Absorber Stitching',
      titleHi: 'फुल बॉडी सेफ्टी हार्नेस डबल लैनयार्ड और शॉक एब्जॉर्बर सही है',
      category: 'Fall Protection',
      passed: true,
      notes: '',
    },
    {
      id: 'crane_hook',
      titleEn: 'Crane / Pulley Hook Safety Latch Lock Functional',
      titleHi: 'क्रेन / पुली हुक का सेफ्टी लैच लॉक सही काम कर रहा है',
      category: 'Lifting Gear',
      passed: true,
      notes: '',
    },
    {
      id: 'torch_illumination',
      titleEn: 'Explosion-Proof LED Headlamp / Handheld Searchlight Battery',
      titleHi: 'एक्सप्लोजन-प्रूफ LED सर्चलाइट और हेडलैम्प बैटरी चार्ज्ड है',
      category: 'Night Safety Gear',
      passed: true,
      notes: '',
    },
  ]);

  const toggleItem = (id: string, passState: boolean) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, passed: passState } : it))
    );
  };

  const handleNotesChange = (id: string, text: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, notes: text } : it))
    );
  };

  const passedCount = items.filter((i) => i.passed).length;
  const failCount = items.length - passedCount;
  const scorePercent = Math.round((passedCount / items.length) * 100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEvidenceImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const summaryText = items
      .map(
        (i) =>
          `• [${i.passed ? 'PASS' : 'FAIL'}] ${i.titleEn}${
            i.notes ? ` (Note: ${i.notes})` : ''
          }`
      )
      .join('\n');

    const payload: ReportSubmissionPayload = {
      type: 'TOOL',
      employeeName: employeeName || 'Electrical Field Technician',
      employeeId: employeeId || 'EMP-CHECKLIST',
      location,
      division,
      toolType: 'Whole Electrical Safety Kit Checklist',
      problemType: failCount > 0 ? 'Defective Tool Identified in Checklist' : 'Routine Inspection Passed',
      severity: failCount > 2 ? 'HIGH' : failCount > 0 ? 'MEDIUM' : 'LOW',
      description: `Electrical Tool Safety Checklist Inspection Score: ${scorePercent}% (${passedCount}/${items.length} Passed).\n\nDetails:\n${summaryText}`,
      immediateAction: failCount > 0 ? 'Defective items tagged OUT OF SERVICE immediately.' : 'All tools certified safe for field operation.',
      evidenceImages,
      recipientEmail,
    };

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'टूल्स एवं सुरक्षा उपकरण की पूरी चेकलिस्ट' : 'Complete Electrical Tool Safety Checklist'}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Verify 1000V insulation, dielectric gloves, earthing rods, and safety harness before entering high voltage yards.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right shrink-0">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Inspection Score</span>
          <span className={`text-2xl font-black ${scorePercent === 100 ? 'text-emerald-400' : scorePercent >= 75 ? 'text-amber-400' : 'text-rose-500'}`}>
            {scorePercent}% ({passedCount}/{items.length})
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitChecklist} className="space-y-6">
        {/* Basic Info & Email Field */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Inspector Details & Editable Email Notification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Worker Name *</label>
              <input
                type="text"
                placeholder="e.g. Divyanshu Sharma"
                required
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Employee ID *</label>
              <input
                type="text"
                placeholder="e.g. EMP-9081"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Location / Substation *</label>
              <input
                type="text"
                placeholder="e.g. Okhla 220kV Grid Yard"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Division *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
              >
                <option value="South Delhi">South Delhi</option>
                <option value="West Delhi">West Delhi</option>
                <option value="Central Delhi">Central Delhi</option>
                <option value="East Delhi">East Delhi</option>
                <option value="North Delhi">North Delhi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Notification Email Target (Editable - Instant Mail Alert sent on submission)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. safety.officer@powergrid.in, inspector@discom.com"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-2.5 text-amber-300 font-medium focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Checklist Verification Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              2. 8-Point Tool Safety Verification Items
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              Tap PASS or FAIL for each item
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.passed
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-rose-950/30 border-rose-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {language === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                        item.passed
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleItem(item.id, false)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                        !item.passed
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>FAIL</span>
                    </button>
                  </div>
                </div>

                {!item.passed && (
                  <div className="mt-3 pt-2 border-t border-rose-500/20">
                    <input
                      type="text"
                      placeholder="Specify defect reason (e.g. Insulation cracked near tip, expiry date passed)..."
                      value={item.notes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      className="w-full bg-slate-900 border border-rose-500/40 rounded-lg px-3 py-2 text-xs text-rose-200 placeholder-rose-400/50"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Defect Photo Attachments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span>3. Upload Tool Inspection / Defect Evidence Photos</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {evidenceImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700">
                <img src={img} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            ))}

            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-amber-400 transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">+ Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base py-4 rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <ShieldCheck className="w-6 h-6" />
          <span>{submitting ? 'Submitting Inspection Checklist...' : 'SUBMIT TOOL SAFETY INSPECTION CHECKLIST'}</span>
        </button>
      </form>
    </div>
  );
};
