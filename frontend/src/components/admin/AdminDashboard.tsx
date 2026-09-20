import React, { useState, useEffect } from 'react';
import type { ReportDetailsResponse, DashboardStats, ReportStatus } from '../../types/safety';
import { SubstationQrGenerator } from './SubstationQrGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, Search, Eye, X } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'qr'>('overview');
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<ReportDetailsResponse[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Selected Detail Modal
  const [selectedReportItem, setSelectedReportItem] = useState<ReportDetailsResponse | null>(null);
  
  // Action Form State
  const [actionStatus, setActionStatus] = useState<ReportStatus>('NEW');
  const [rootCause, setRootCause] = useState<string>('');
  const [correctiveAction, setCorrectiveAction] = useState<string>('');
  const [preventiveAction, setPreventiveAction] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [savingAction, setSavingAction] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`),
        fetch(`${API_BASE}/api/admin/reports`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenReportModal = (item: ReportDetailsResponse) => {
    setSelectedReportItem(item);
    setActionStatus(item.report.status || 'NEW');
    setRootCause(item.correctiveAction?.rootCause || '');
    setCorrectiveAction(item.correctiveAction?.correctiveAction || '');
    setPreventiveAction(item.correctiveAction?.preventiveAction || '');
    setRemarks(item.correctiveAction?.remarks || '');
  };

  const handleSaveAction = async () => {
    if (!selectedReportItem?.report.id) return;
    setSavingAction(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/reports/${selectedReportItem.report.id}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: actionStatus,
          rootCause,
          correctiveAction,
          preventiveAction,
          remarks,
          updatedBy: 'Admin Supervisor',
        }),
      });

      if (res.ok) {
        await fetchDashboardData();
        setSelectedReportItem(null);
      }
    } catch (err) {
      console.error('Failed to update corrective action:', err);
    } finally {
      setSavingAction(false);
    }
  };

  // Filter Reports
  const filteredReports = reports.filter((item) => {
    const r = item.report;
    const matchesSearch =
      !searchQuery ||
      r.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.employeeName && r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.employeeId && r.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = !selectedType || r.type === selectedType;
    const matchesStatus = !selectedStatus || r.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const COLORS = ['#F59E0B', '#F97316', '#EF4444', '#06B6D4', '#10B981'];

  const categoryChartData = [
    { name: 'Near Miss', count: stats?.nearMissCount || 0 },
    { name: 'Incident', count: stats?.incidentCount || 0 },
    { name: 'Accident', count: stats?.accidentCount || 0 },
    { name: 'PPE Defect', count: stats?.ppeCount || 0 },
    { name: 'Tool Defect', count: stats?.toolCount || 0 },
  ];

  const divisionChartData = Object.entries(stats?.reportsByDivision || {}).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Admin Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">SAFETY MANAGEMENT DASHBOARD</h1>
            <p className="text-xs text-slate-400">Live Incident Monitoring & Root-Cause Lifecycle Control</p>
          </div>
        </div>

        {/* Tab Buttons & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'reports' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reports Table ({filteredReports.length})
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'qr' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Substation QR
            </button>
          </div>

          <button
            onClick={onLogout}
            className="bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Reports</p>
          <p className="text-2xl font-black text-white mt-1">{stats?.totalReports || 0}</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-amber-400 uppercase">Near Misses</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{stats?.nearMissCount || 0}</p>
        </div>

        <div className="bg-slate-900 border border-orange-500/30 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-orange-400 uppercase">Incidents</p>
          <p className="text-2xl font-black text-orange-400 mt-1">{stats?.incidentCount || 0}</p>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-rose-400 uppercase">Accidents / Injuries</p>
          <p className="text-2xl font-black text-rose-500 mt-1">{stats?.accidentCount || 0}</p>
        </div>

        <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-cyan-400 uppercase">PPE & Tools</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{(stats?.ppeCount || 0) + (stats?.toolCount || 0)}</p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-emerald-400 uppercase">Closed / Resolved</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.closedReports || 0}</p>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">
              Safety Reports by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">
              Incidents & Hazards by Division
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={divisionChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'reports' || activeTab === 'overview') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ticket #, name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="NEAR_MISS">Near Miss</option>
                <option value="INCIDENT">Incident</option>
                <option value="ACCIDENT">Accident</option>
                <option value="TOOL">Tool Defect</option>
                <option value="PPE">PPE Defect</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="ACTION_REQUIRED">ACTION REQUIRED</option>
                <option value="ACTION_TAKEN">ACTION TAKEN</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Worker ID / Name</th>
                  <th className="p-3">Substation / Location</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredReports.map((item) => {
                  const r = item.report;
                  return (
                    <tr key={r.id || r.reportNumber} className="hover:bg-slate-850 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">{r.reportNumber}</td>
                      <td className="p-3 font-semibold">{r.type}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{r.employeeName || 'Field Lineman'}</div>
                        <div className="text-[10px] text-slate-400">{r.employeeId || 'N/A'}</div>
                      </td>
                      <td className="p-3 max-w-xs truncate">
                        <div className="font-semibold text-white">{r.location}</div>
                        <div className="text-[10px] text-slate-400">{r.division}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          r.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          r.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'CLOSED' ? 'bg-emerald-500/20 text-emerald-300' :
                          r.status === 'ACTION_TAKEN' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {r.status || 'NEW'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenReportModal(item)}
                          className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 transition-all flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'qr' && <SubstationQrGenerator />}

      {selectedReportItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 w-full max-w-3xl shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-extrabold">{selectedReportItem.report.reportNumber}</span>
                <h3 className="text-xl font-black text-white">{selectedReportItem.report.type} Report Review</h3>
              </div>
              <button onClick={() => setSelectedReportItem(null)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Worker Information:</span>
                  <p className="text-white font-bold">{selectedReportItem.report.employeeName} ({selectedReportItem.report.employeeId})</p>
                  <p className="text-slate-300">Phone: {selectedReportItem.report.employeePhone || 'N/A'}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Substation Location & Date:</span>
                  <p className="text-white font-bold">{selectedReportItem.report.location} ({selectedReportItem.report.division})</p>
                  <p className="text-slate-300">{selectedReportItem.report.date} at {selectedReportItem.report.time}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Description:</span>
                  <p className="text-slate-200 leading-relaxed">{selectedReportItem.report.description}</p>
                </div>

                {selectedReportItem.idCardImage && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">ID Card Attachment:</span>
                    <img src={selectedReportItem.idCardImage} alt="ID Card" className="w-32 h-20 object-cover rounded-lg border border-slate-700" />
                  </div>
                )}

                {selectedReportItem.evidenceImages && selectedReportItem.evidenceImages.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Evidence Gallery ({selectedReportItem.evidenceImages.length} photos):</span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedReportItem.evidenceImages.map((img, i) => (
                        <img key={i} src={img} alt={`Evidence ${i}`} className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Workflow Status & Action Taken
                </h4>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lifecycle Status</label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value as ReportStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="ACTION_REQUIRED">ACTION REQUIRED</option>
                    <option value="ACTION_TAKEN">ACTION TAKEN</option>
                    <option value="CLOSED">CLOSED & RESOLVED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Root Cause Analysis</label>
                  <textarea
                    rows={2}
                    placeholder="Enter root cause..."
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Corrective Action Implemented</label>
                  <textarea
                    rows={2}
                    placeholder="Action taken to fix defect..."
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preventive Action Plan</label>
                  <input
                    type="text"
                    placeholder="Long term preventive measure..."
                    value={preventiveAction}
                    onChange={(e) => setPreventiveAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <button
                  onClick={handleSaveAction}
                  disabled={savingAction}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl shadow mt-2"
                >
                  {savingAction ? 'Saving...' : 'Save & Update Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
