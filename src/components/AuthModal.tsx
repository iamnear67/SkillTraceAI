import React, { useState } from 'react';
import { X, Lock, Mail, User, Key, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { registerWithEmail, loginWithEmail, sendPasswordReset, UserProfileState } from '../utils/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfileState) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginWithEmail(email, password);
        onSuccess(user);
        onClose();
      } else if (mode === 'signup') {
        const user = await registerWithEmail(email, password, name);
        onSuccess(user);
        onClose();
      } else if (mode === 'forgot') {
        const msg = await sendPasswordReset(email);
        setInfoMsg(msg);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card animate-slide-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', border: '1px solid rgba(59,130,246,0.3)' }}>
            <ShieldCheck size={28} color="#60a5fa" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 0.25rem 0' }}>
            {mode === 'login' && 'Sign In to SkillTrace'}
            {mode === 'signup' && 'Create Candidate Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Official Firebase Native Authentication
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <button 
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', background: mode === 'login' ? 'var(--color-primary)' : 'transparent', color: mode === 'login' ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setInfoMsg(''); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', background: mode === 'signup' ? 'var(--color-primary)' : 'transparent', color: mode === 'signup' ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} /> {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                <User size={16} color="var(--text-muted)" />
                <input type="text" placeholder="Alex Sterling" value={name} onChange={e => setName(e.target.value)} required style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '0.85rem' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
              <Mail size={16} color="var(--text-muted)" />
              <input type="email" placeholder="candidate@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '0.85rem' }} />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                <Lock size={16} color="var(--text-muted)" />
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '0.85rem' }} />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right' }}>
              <button 
                type="button" 
                onClick={() => setMode('forgot')}
                style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary" 
            style={{ padding: '0.85rem', marginTop: '0.5rem', width: '100%', fontWeight: 700 }}
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};
