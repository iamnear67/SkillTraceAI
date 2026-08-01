import React, { useState, useEffect } from 'react';
import { CalibratedProfile, OptimizationResult, runStudyOptimizer } from '../utils/engine';
import { ExamData } from '../data/exams';
import { ShieldCheck, HelpCircle, Layers, Sliders, ChevronDown, ChevronUp, Clock, Target } from 'lucide-react';

interface OptimizerProps {
  profile: CalibratedProfile;
  exam: ExamData;
  initialMonths: number;
  initialHours: number;
}

export const Optimizer: React.FC<OptimizerProps> = ({
  profile,
  exam,
  initialMonths,
  initialHours
}) => {
  // Local state for simulator sliders
  const [daysRemaining, setDaysRemaining] = useState(initialMonths * 30);
  const [hoursPerDay, setHoursPerDay] = useState(initialHours);
  const [optResult, setOptResult] = useState<OptimizationResult | null>(null);
  
  // Collapse/Expand state for recommended action groups
  const [expandedGroups, setExpandedGroups] = useState({
    DEEP_MASTERY: true,
    PARETO_PRUNED: true,
    SKIM_ONLY: false,
    SKIP: false
  });

  // Re-run optimizer when profile, exam, or sliders change
  useEffect(() => {
    const result = runStudyOptimizer(profile, exam, { daysRemaining, hoursPerDay });
    setOptResult(result);
  }, [profile, exam, daysRemaining, hoursPerDay]);

  if (!optResult) return null;

  const { summary, allocations } = optResult;

  // Group allocations by recommended action
  const groups = {
    DEEP_MASTERY: allocations.filter(a => a.recommendation === 'DEEP_MASTERY'),
    PARETO_PRUNED: allocations.filter(a => a.recommendation === 'PARETO_PRUNED'),
    SKIM_ONLY: allocations.filter(a => a.recommendation === 'SKIM_ONLY'),
    SKIP: allocations.filter(a => a.recommendation === 'SKIP')
  };

  const toggleGroup = (key: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getFeasibilityStatusColors = (status: string) => {
    switch (status) {
      case 'HIGHLY_FEASIBLE': return { text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'FEASIBLE_WITH_EFFORT': return { text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      default: return { text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
    }
  };

  const statusColors = getFeasibilityStatusColors(summary.feasibility_status);

  return (
    <div className="grid-cols-12 animate-slide-in">
      
      {/* 1. Interactive Simulation Sidebar */}
      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card glowing" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--color-primary)" /> Roadmap Simulator
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Days remaining slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <label>Days Remaining</label>
                <span className="glow-text-primary" style={{ fontWeight: 700 }}>{daysRemaining} Days</span>
              </div>
              <input
                type="range"
                min="10"
                max="720"
                step="10"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>

            {/* Daily study hours slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <label>Study Hours/Day</label>
                <span className="glow-text-accent" style={{ fontWeight: 700 }}>{hoursPerDay} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-panel)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Total Available Time:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{Math.round(daysRemaining * hoursPerDay)} hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Total study tokens:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{summary.total_tokens_budget} tokens</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Engine utilization:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {Math.round((summary.allocated_tokens / summary.total_tokens_budget) * 100)}%
              </span>
            </div>
          </div>

        </div>

        {/* Dynamic target panel */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="var(--color-success)" /> Expected Performance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center', margin: '0.5rem 0' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected Score</span>
            <span className="glow-text-success" style={{ fontSize: '2.5rem', fontWeight: 900 }}>
              {summary.projected_score}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Target Cutoff: <strong>{exam.cutoff_tier1}</strong> / {exam.total_marks} marks
            </span>
          </div>

          <div style={{ border: `1px solid ${statusColors.border}`, borderRadius: '6px', padding: '0.6rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: statusColors.text, background: 'rgba(255, 255, 255, 0.02)', letterSpacing: '0.05em' }}>
            {summary.feasibility_status.replace(/_/g, ' ')}
          </div>

        </div>
      </div>

      {/* 2. Optimized Roadmap Breakdown (List of Recommendations) */}
      <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>Adaptive Roadmap for {exam.exam_name}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Allocating preparation energy dynamically across the syllabus domains to maximize cumulative score yield.
            </p>
          </div>

          {/* Group 1: Deep Mastery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              onClick={() => toggleGroup('DEEP_MASTERY')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px', padding: '0.85rem 1.25rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--color-success)" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Learn Deeply ({groups.DEEP_MASTERY.length} topics)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>HIGH YIELD TARGET</span>
                {expandedGroups.DEEP_MASTERY ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedGroups.DEEP_MASTERY && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem', animation: 'slideIn 0.3s ease' }}>
                {groups.DEEP_MASTERY.length === 0 ? (
                  <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No topics allocated for deep study.</div>
                ) : (
                  groups.DEEP_MASTERY.map(topic => (
                    <div key={topic.subtopic_id} style={{ background: 'var(--color-bg-panel)', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid var(--color-success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{topic.subtopic_name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Domain: {topic.domain} • {topic.reasoning}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', fontSize: '0.75rem' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>{topic.assigned_tokens} tokens</span>
                          <span style={{ color: 'var(--color-success)' }}>+{topic.expected_yield_marks} marks</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Group 2: Pareto Pruned */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              onClick={() => toggleGroup('PARETO_PRUNED')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '8px', padding: '0.85rem 1.25rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--color-primary)" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Learn Normally / Pareto ({groups.PARETO_PRUNED.length} topics)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>80/20 OPTIMAL COVERAGE</span>
                {expandedGroups.PARETO_PRUNED ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedGroups.PARETO_PRUNED && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem', animation: 'slideIn 0.3s ease' }}>
                {groups.PARETO_PRUNED.length === 0 ? (
                  <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No topics allocated for pareto study.</div>
                ) : (
                  groups.PARETO_PRUNED.map(topic => (
                    <div key={topic.subtopic_id} style={{ background: 'var(--color-bg-panel)', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{topic.subtopic_name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Domain: {topic.domain} • {topic.reasoning}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', fontSize: '0.75rem' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>{topic.assigned_tokens} tokens</span>
                          <span style={{ color: 'var(--color-primary)' }}>+{topic.expected_yield_marks} marks</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Group 3: Skim Only */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              onClick={() => toggleGroup('SKIM_ONLY')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '8px', padding: '0.85rem 1.25rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--color-warning)" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Skim Only / Formulas ({groups.SKIM_ONLY.length} topics)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>LOW STUDY EFFORT</span>
                {expandedGroups.SKIM_ONLY ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedGroups.SKIM_ONLY && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem', animation: 'slideIn 0.3s ease' }}>
                {groups.SKIM_ONLY.length === 0 ? (
                  <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No topics allocated for skimming.</div>
                ) : (
                  groups.SKIM_ONLY.map(topic => (
                    <div key={topic.subtopic_id} style={{ background: 'var(--color-bg-panel)', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid var(--color-warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{topic.subtopic_name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Domain: {topic.domain} • {topic.reasoning}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', fontSize: '0.75rem' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>{topic.assigned_tokens} tokens</span>
                          <span style={{ color: 'var(--color-warning)' }}>+{topic.expected_yield_marks} marks</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Group 4: Skip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              onClick={() => toggleGroup('SKIP')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.85rem 1.25rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="var(--text-muted)" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Postpone / Skip ({groups.SKIP.length} topics)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ZERO STUDY EFFORT</span>
                {expandedGroups.SKIP ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedGroups.SKIP && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem', animation: 'slideIn 0.3s ease' }}>
                {groups.SKIP.length === 0 ? (
                  <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No topics skipped.</div>
                ) : (
                  groups.SKIP.map(topic => (
                    <div key={topic.subtopic_id} style={{ background: 'var(--color-bg-panel)', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid var(--text-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{topic.subtopic_name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Domain: {topic.domain} • {topic.reasoning}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>0 tokens</span>
                          <span style={{ color: 'var(--text-muted)' }}>+{topic.expected_yield_marks} marks</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
