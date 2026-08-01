import React, { useState } from 'react';
import { X, ShieldCheck, Save, Type, AlertCircle } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSiteText: (textConfig: { siteName: string; announcement: string; headerTagline: string }) => void;
  currentConfig: { siteName: string; announcement: string; headerTagline: string };
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ 
  isOpen, onClose, onUpdateSiteText, currentConfig 
}) => {
  const [siteName, setSiteName] = useState(currentConfig.siteName);
  const [announcement, setAnnouncement] = useState(currentConfig.announcement);
  const [headerTagline, setHeaderTagline] = useState(currentConfig.headerTagline);
  const [savedMsg, setSavedMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteText({ siteName, announcement, headerTagline });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <form onSubmit={handleSave} className="glass-card animate-slide-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.3)' }}>
            <ShieldCheck size={22} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>Global Admin Controls</h2>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Dynamic Text & Site Customization</span>
          </div>
        </div>

        {savedMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '6px', fontSize: '0.85rem' }}>
            ✓ Site text config updated across all modules!
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Application Title</label>
          <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Header Banner Announcement</label>
          <input type="text" value={announcement} onChange={e => setAnnouncement(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Main Tagline</label>
          <textarea value={headerTagline} onChange={e => setHeaderTagline(e.target.value)} rows={3} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Cancel</button>
          <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Save size={16} /> Save Admin Settings
          </button>
        </div>
      </form>
    </div>
  );
};
