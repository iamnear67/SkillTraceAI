import React, { useState } from 'react';
import { scholarshipsData, Scholarship } from '../data/scholarships';
import { GraduationCap, ExternalLink, ShieldCheck, IndianRupee, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const Mode6Scholarships: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(scholarshipsData.map(s => s.category)))];

  const filtered = selectedCategory === 'ALL'
    ? scholarshipsData
    : scholarshipsData.filter(s => s.category === selectedCategory);

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '1rem auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
          <GraduationCap size={14} color="#8b5cf6" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Phase 6 — Government & CSR Scholarships
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
          College & External Scholarships
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Explore merit-based, need-based, and institutional financial aid grants available for top UG entrance candidates.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
              background: selectedCategory === cat ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'rgba(255,255,255,0.04)',
              border: selectedCategory === cat ? 'none' : '1px solid var(--color-border)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scholarships Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(sch => (
          <div key={sch.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {/* Category badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{sch.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sch.provider}</span>
              </div>
              <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {sch.category}
              </span>
            </div>

            {/* Financial Aid Banner */}
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <IndianRupee size={20} color="#10b981" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Financial Aid Benefit</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>{sch.financial_aid.breakdown}</span>
              </div>
            </div>

            {/* Target Courses */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Courses:</span>
              {sch.target_courses.map(course => (
                <span key={course} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--color-border)', color: '#ddd' }}>
                  {course}
                </span>
              ))}
            </div>

            {/* Key Requirements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {sch.eligibility_criteria.academic_performance?.min_percentage_10_2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="#3b82f6" />
                  <span>Min 10+2 Marks: <strong style={{ color: '#fff' }}>{sch.eligibility_criteria.academic_performance.min_percentage_10_2}%</strong></span>
                </div>
              )}
              {sch.eligibility_criteria.max_family_income_inr && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={13} color="#f59e0b" />
                  <span>Max Annual Family Income: <strong style={{ color: '#fff' }}>₹{sch.eligibility_criteria.max_family_income_inr.toLocaleString()}</strong></span>
                </div>
              )}
              {sch.eligibility_criteria.institutional_requirement && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={13} color="#10b981" />
                  <span>{sch.eligibility_criteria.institutional_requirement}</span>
                </div>
              )}
            </div>

            {/* Official Link Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '0.5rem' }}>
              <a
                href={sch.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none', gap: '0.4rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                <span>Official Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
