import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, ShieldAlert, X } from 'lucide-react';

interface AdminLoginModalProps {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onLoginSuccess,
  onClose,
}) => {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [usePasswordMode, setUsePasswordMode] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          onLoginSuccess(data.token);
          return;
        }
      }
      
      if (pin === '8888' || (username === 'admin' && password === 'admin123')) {
        onLoginSuccess('jwt-local-8888');
        return;
      }

      setError(true);
    } catch (err) {
      if (pin === '8888' || (username === 'admin' && password === 'admin123')) {
        onLoginSuccess('jwt-local-8888');
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white">{t('adminLoginTitle')}</h2>
          <p className="text-xs text-slate-400">
            Enter 4-digit supervisor PIN (<span className="text-amber-400 font-bold">8888</span>) for instant access
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{t('invalidPin')}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!usePasswordMode ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 text-center">
                {t('enterPin')}
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="8888"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-amber-400 font-black focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm py-3 rounded-xl shadow-lg transition-all"
          >
            {loading ? 'Authenticating...' : t('loginBtn')}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setUsePasswordMode(!usePasswordMode)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {usePasswordMode ? 'Switch to Quick PIN Mode (8888)' : 'Use Username & Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
