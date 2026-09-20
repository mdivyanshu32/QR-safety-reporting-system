import React from 'react';
import type { ReportDetailsResponse } from '../types/safety';
import { CheckCircle2, Home, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SuccessTicketProps {
  response: ReportDetailsResponse;
  onHomeClick: () => void;
}

export const SuccessTicket: React.FC<SuccessTicketProps> = ({ response, onHomeClick }) => {
  const report = response.report;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div id="printable-ticket" className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            REPORT SUBMITTED SUCCESSFULLY
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            Safety Ticket Issued
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Keep this tracking ID for official reference and safety audit
          </p>
        </div>

        <div className="bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-xl p-4 inline-block shadow-inner space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            OFFICIAL TRACKING NUMBER
          </span>
          <div className="text-3xl font-black font-mono text-amber-400 tracking-wider">
            {report.reportNumber}
          </div>
          <div className="pt-2 flex justify-center">
            <QRCodeSVG value={report.reportNumber} size={100} level="M" />
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left text-xs space-y-2.5">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-semibold">Report Category:</span>
            <span className="font-bold text-white">{report.type}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-semibold">Field Worker:</span>
            <span className="font-bold text-white">{report.employeeName || 'Field Lineman'} ({report.employeeId || 'N/A'})</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-semibold">Substation / Site:</span>
            <span className="font-bold text-white">{report.location} ({report.division})</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-semibold">Submission Time:</span>
            <span className="font-bold text-white">{report.date} at {report.time}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">Description:</span>
            <p className="text-slate-300 italic bg-slate-900 p-2.5 rounded border border-slate-800">
              "{report.description || 'Safety incident reported'}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket Receipt</span>
          </button>

          <button
            onClick={onHomeClick}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Back to Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
