import React from 'react';
import { Lock, FlaskConical } from 'lucide-react';

export const Mode4Placeholder: React.FC = () => (
  <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', minHeight: '400px', textAlign: 'center' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Lock size={32} color="#f59e0b" />
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>Phase 3 — Novel Synthetic Learning Task</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', lineHeight: 1.6 }}>
      In this upcoming phase, you will learn a novel synthetic rule system (<strong style={{ color: '#f59e0b' }}>Kyrosian Kinetic Dynamics</strong>) that no student has ever seen before. You will be tested at delayed intervals (<strong style={{ color: '#f59e0b' }}>6 hours, 2 days, 1 week, and 1 month</strong>) to calculate your exact raw learning speed (<strong style={{ color: '#f59e0b' }}>α</strong>) and memory decay rate (<strong style={{ color: '#f59e0b' }}>λ</strong>).
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
        <FlaskConical size={11} style={{ verticalAlign: 'middle', marginRight: '0.2rem' }} /> Delayed Recall (6h, 2d, 1w, 1m)
      </span>
      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
        Gompertz Learning Curves M(k)
      </span>
      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
        FSRS Memory Retention R(t)
      </span>
    </div>
  </div>
);

export const Mode5Placeholder: React.FC = () => (
  <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', minHeight: '400px', textAlign: 'center' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Lock size={32} color="#ef4444" />
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>Phase 5 — Learning & Decay Testing</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', lineHeight: 1.6 }}>
      This module will test delayed memory recall intervals and calibrate user learning rate (α) and decay rate (λ).
    </p>
  </div>
);

export const PortfolioPlaceholder: React.FC = () => (
  <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', minHeight: '400px', textAlign: 'center' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(100, 116, 139, 0.1)', border: '1px solid rgba(100, 116, 139, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Lock size={32} color="#94a3b8" />
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>Phase 2 — Portfolio</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', lineHeight: 1.6 }}>
      Portfolio tracking and candidate credentials manager coming soon.
    </p>
  </div>
);
