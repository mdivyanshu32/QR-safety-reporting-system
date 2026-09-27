import React, { useState, useEffect } from 'react';
import { Phone, ShieldAlert, Plus, Trash2, MapPin, Building, Ambulance, Flame, Search, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface EmergencyContact {
  id?: number;
  area: string;
  contactType: string;
  title: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  updatedAt?: string;
}

const DEFAULT_AREAS = ['South Delhi', 'West Delhi', 'Central Delhi', 'East Delhi', 'North Delhi'];

export const EmergencyDirectory: React.FC = () => {
  const { language } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Contact Form State
  const [newContact, setNewContact] = useState<EmergencyContact>({
    area: 'South Delhi',
    contactType: 'Control Room',
    title: '',
    phone: '',
    alternatePhone: '',
    address: '',
  });
  const [saving, setSaving] = useState<boolean>(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const url = selectedArea === 'All Areas'
        ? '/api/emergency'
        : `/api/emergency?area=${encodeURIComponent(selectedArea)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (e) {
      console.error('Failed to fetch emergency contacts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [selectedArea]);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.title || !newContact.phone) return;

    setSaving(true);
    try {
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewContact({
          area: 'South Delhi',
          contactType: 'Control Room',
          title: '',
          phone: '',
          alternatePhone: '',
          address: '',
        });
        fetchContacts();
      }
    } catch (e) {
      console.error('Error saving contact:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this emergency response number?')) return;
    try {
      const res = await fetch(`/api/emergency/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchContacts();
      }
    } catch (e) {
      console.error('Error deleting contact:', e);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getContactIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'FIRE STATION': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'AMBULANCE': return <Ambulance className="w-5 h-5 text-emerald-400" />;
      case 'SAFETY OFFICER': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      default: return <Building className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'क्षेत्र-वार आपातकालीन हेल्पलाइन निर्देशिका' : 'Area-Wise Emergency Directory'}</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Instant 24x7 electrical grid control room, fire response, trauma ambulance, and safety officer contact hotline saved area-wise.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-500 hover:bg-red-400 text-slate-950 font-black text-sm px-4 py-3 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>{language === 'hi' ? '+ नया नंबर जोड़ें' : '+ Add Emergency Contact'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by substation name, phone number, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none shadow-inner"
          />
        </div>

        <div>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-amber-400 focus:border-red-500 focus:outline-none shadow-inner"
          >
            <option value="All Areas">🌍 All Areas / Divisions</option>
            {DEFAULT_AREAS.map((a) => (
              <option key={a} value={a}>📍 {a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium animate-pulse">
          Loading Emergency Numbers...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No emergency numbers found for this area. Click "+ Add Emergency Contact" to save one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-900 border border-slate-800 hover:border-red-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition-all relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {getContactIcon(contact.contactType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                        {contact.contactType}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" /> {contact.area}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1 leading-snug">
                      {contact.title}
                    </h3>
                  </div>
                </div>

                {contact.id && (
                  <button
                    onClick={() => handleDeleteContact(contact.id!)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {contact.address && (
                <p className="text-xs text-slate-400 font-medium pl-1">
                  🏢 {contact.address}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 stroke-[3]" />
                  <span>CALL {contact.phone}</span>
                </a>

                {contact.alternatePhone && (
                  <a
                    href={`tel:${contact.alternatePhone}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Alt: {contact.alternatePhone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>Save New Emergency Contact</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Select Area / Division *</label>
                  <select
                    value={newContact.area}
                    onChange={(e) => setNewContact({ ...newContact, area: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  >
                    {DEFAULT_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Contact Type *</label>
                  <select
                    value={newContact.contactType}
                    onChange={(e) => setNewContact({ ...newContact, contactType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  >
                    <option value="Control Room">Control Room</option>
                    <option value="Fire Station">Fire Station</option>
                    <option value="Ambulance">Ambulance</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Substation In-Charge">Substation In-Charge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Title / Substation Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Okhla 220kV Main Dispatch Control Room"
                  required
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Primary Helpline Phone *</label>
                  <input
                    type="text"
                    placeholder="e.g. +91-11-26910022"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Alternate Phone (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1800-11-9090"
                    value={newContact.alternatePhone}
                    onChange={(e) => setNewContact({ ...newContact, alternatePhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Address / Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Phase 3 Industrial Area, New Delhi"
                  value={newContact.address}
                  onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-500 hover:bg-red-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Area Contact'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
