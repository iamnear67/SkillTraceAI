import React, { useState, useMemo, useEffect } from 'react';
import { ExamRecommendation } from '../utils/psychometricEngine';
import { ClassAbility, ExamSubtopicPredictions } from '../utils/priorTestEngine';
import { generateFeasibilityReport, ExamFeasibilityReport } from '../utils/airEstimator';
import { examsData } from '../data/exams';
import { AIAssistantChat } from './AIAssistantChat';
import { MainTaskList } from './MainTaskList';
import { TaskItem, MockTestUpload, getStoredTaskList, saveTaskList, getStoredMockUploads, saveMockUploads, generateInitialTasks } from '../utils/tasklistEngine';
import { Trophy, ChevronDown, ChevronUp, GraduationCap, Target, MapPin, TrendingUp, Shield, AlertTriangle, XCircle, Sparkles, ListChecks, CheckCircle2, ExternalLink, FileText, Upload } from 'lucide-react';

interface Mode3Props {
  recommendations: ExamRecommendation[];
  classAbilities: ClassAbility[];
  examPredictions: ExamSubtopicPredictions[];
  hasPriorTestData?: boolean;
}

export const Mode3Dashboard: React.FC<Mode3Props> = ({
  recommendations,
  classAbilities,
  examPredictions,
  hasPriorTestData = true
}) => {
  const [expandedExam, setExpandedExam] = useState<number | null>(0);
  const [sampleModalExam, setSampleModalExam] = useState<ExamFeasibilityReport | null>(null);
  const [sampleScoreInput, setSampleScoreInput] = useState('');
  const [mockScoreOverrides, setMockScoreOverrides] = useState<Record<string, number>>({});

  // Main task list state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const stored = getStoredTaskList();
    if (stored.length > 0) return stored;
    return generateInitialTasks(recommendations);
  });

  // Mock test uploads state
  const [mockUploads, setMockUploads] = useState<MockTestUpload[]>(() => getStoredMockUploads());

  useEffect(() => {
    if (tasks.length === 0 && recommendations.length > 0) {
      setTasks(generateInitialTasks(recommendations));
    }
  }, [recommendations]);

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId && !t.completed) {
        return { ...t, completed: true, completedAt: new Date().toISOString() };
      }
      return t;
    });
    setTasks(updated);
    saveTaskList(updated);
  };

  const handleUpdateTasks = (updatedTasks: TaskItem[]) => {
    setTasks(updatedTasks);
    saveTaskList(updatedTasks);
  };

  const handleAddMockUpload = (upload: MockTestUpload) => {
    const updated = [...mockUploads, upload];
    setMockUploads(updated);
    saveMockUploads(updated);

    // Apply score override for that exam
    setMockScoreOverrides(prev => ({
      ...prev,
      [upload.examName]: Math.round((upload.scoreObtained / upload.totalMarks) * 100)
    }));
  };

  // Completion boost from tasklist
  const completedBoostPercent = useMemo(() => {
    return tasks.filter(t => t.completed).reduce((sum, t) => sum + t.scoreBoostPercent, 0);
  }, [tasks]);

  // Generate feasibility reports for ALL recommended/tracked exams
  const reports: (ExamFeasibilityReport & { matchPercent: number })[] = useMemo(() => {
    return recommendations.map((rec, idx) => {
      const examName = rec.exam ? rec.exam.exam_name : ((rec as any).exam_name || 'Target Exam');
      const category = rec.exam?.category || 'General';
      const conductingBody = rec.exam?.conducting_body || 'National Board';
      const collegeMapping = rec.exam?.college_mapping || [];

      // Category-based score variance from classAbilities
      let categoryAbilityPct = Math.round(rec.matchPercent * 0.75); // base fallback

      if (classAbilities.length > 0) {
        if (category.includes('Engineering')) {
          const quant = classAbilities.find(c => c.class_id === 'COG_01')?.ability || 0.6;
          const math = classAbilities.find(c => c.class_id === 'COG_08')?.ability || 0.6;
          categoryAbilityPct = Math.round(((quant + math) / 2) * 100);
        } else if (category.includes('Law')) {
          const legal = classAbilities.find(c => c.class_id === 'COG_05')?.ability || 0.65;
          const read = classAbilities.find(c => c.class_id === 'COG_04')?.ability || 0.65;
          categoryAbilityPct = Math.round(((legal + read) / 2) * 100);
        } else if (category.includes('Management')) {
          const di = classAbilities.find(c => c.class_id === 'COG_09')?.ability || 0.62;
          const logic = classAbilities.find(c => c.class_id === 'COG_02')?.ability || 0.62;
          categoryAbilityPct = Math.round(((di + logic) / 2) * 100);
        }
      }

      // If user submitted mock score override, use it!
      const overrideScore = mockScoreOverrides[examName];
      const basePercent = overrideScore !== undefined ? overrideScore : categoryAbilityPct;

      const predictedPercent = Math.min(99, Math.round(basePercent + completedBoostPercent));

      const detailedExam = examsData.find(e =>
        e.exam_name.toLowerCase().includes(examName.toLowerCase().split(' ')[0]) ||
        examName.toLowerCase().includes(e.exam_name.toLowerCase().split(' ')[0])
      );

      const report = generateFeasibilityReport(
        examName,
        predictedPercent,
        collegeMapping,
        category,
        conductingBody,
        detailedExam
      );

      return { ...report, matchPercent: rec.matchPercent };
    });
  }, [recommendations, classAbilities, examPredictions, hasPriorTestData, completedBoostPercent, mockScoreOverrides]);

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_MATCH': return { icon: Shield, color: '#10b981', label: 'Strong Match', bg: 'rgba(16, 185, 129, 0.08)' };
      case 'COMPETITIVE': return { icon: TrendingUp, color: '#3b82f6', label: 'Competitive', bg: 'rgba(59, 130, 246, 0.08)' };
      case 'STRETCH': return { icon: AlertTriangle, color: '#f59e0b', label: 'Stretch Target', bg: 'rgba(245, 158, 11, 0.08)' };
      default: return { icon: XCircle, color: '#ef4444', label: 'Unlikely', bg: 'rgba(239, 68, 68, 0.08)' };
    }
  };

  const handleSampleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleModalExam || !sampleScoreInput) return;
    const scoreVal = parseFloat(sampleScoreInput);
    if (isNaN(scoreVal)) return;

    setMockScoreOverrides(prev => ({
      ...prev,
      [sampleModalExam.exam_name]: scoreVal
    }));

    setSampleModalExam(null);
    setSampleScoreInput('');
  };

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '1rem auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '4px', color: '#34d399', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Trophy size={12} />
            Phase 1 — AIR, Expected Marks & Tasklist Dashboard
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
            AIR, Expected Marks & AI Tasklist
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Per-exam expected scores, distinct Expected & Optimistic AIRs, and high-yield study tasklists.
          </p>
        </div>

        <button 
          onClick={() => window.print()} 
          className="btn-primary print-hide" 
          style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem' }}
        >
          <FileText size={16} /> Download Portfolio PDF
        </button>
      </div>

      {!hasPriorTestData && (
        <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={20} color="#f59e0b" />
          <div style={{ fontSize: '0.85rem', color: '#ddd' }}>
            <strong style={{ color: '#fbbf24' }}>Prior Knowledge Test (Phase 4) Pending:</strong> Expected scores and AIR estimates currently display baseline placeholders (<code style={{ color: '#f59e0b' }}>--</code>). Complete Phase 4 to compute live rank predictions!
          </div>
        </div>
      )}

      {/* Top Section: AI Assistant Chat (Left) & Main Task List + Mock Uploads (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} color="#3b82f6" />
            <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0 }}>AI Strategy Assistant</h3>
          </div>
          <AIAssistantChat tasks={tasks} onUpdateTasks={handleUpdateTasks} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <ListChecks size={16} color="#10b981" />
            <h3 style={{ fontSize: '0.95rem', color: '#fff', margin: 0 }}>Main Study Task List & Test Uploads</h3>
          </div>
          <MainTaskList
            tasks={tasks}
            mockUploads={mockUploads}
            onToggleTask={handleToggleTask}
            onAddMockUpload={handleAddMockUpload}
          />
        </div>
      </div>

      {/* Exam Cards */}
      {reports.map((report, idx) => {
        const isExpanded = expandedExam === idx;
        const vc = getVerdictConfig(report.overall_verdict);
        const VerdictIcon = vc.icon;

        return (
          <div key={idx} className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Header Row */}
            <div
              style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: '#fff' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setExpandedExam(isExpanded ? null : idx)}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: vc.bg, border: `1px solid ${vc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VerdictIcon size={18} color={vc.color} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.15rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{report.exam_name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{report.exam_category} • {report.conducting_body}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* Quick stats with DISTINCT Expected & Optimistic AIRs */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Predicted Score</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: hasPriorTestData ? vc.color : 'var(--text-muted)' }}>
                      {hasPriorTestData ? (report.predicted_score_marks !== null ? `${report.predicted_score_marks}/${report.total_marks}` : `${report.predicted_score_percent}%`) : '--'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Expected AIR</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: hasPriorTestData ? '#fff' : 'var(--text-muted)' }}>
                      {hasPriorTestData ? report.air_estimate.estimated_air_mid.toLocaleString() : '--'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>Optimistic AIR</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: hasPriorTestData ? '#34d399' : 'var(--text-muted)' }}>
                      {hasPriorTestData ? report.air_estimate.optimistic_air.toLocaleString() : '--'}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: vc.bg, border: `1px solid ${vc.color}30`, color: vc.color, fontWeight: 700 }}>
                    {hasPriorTestData ? vc.label : 'Pending Test'}
                  </span>
                </div>

                <button onClick={() => setExpandedExam(isExpanded ? null : idx)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Action Bar: Practice Sample Paper & Input Score */}
            <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Targeting flagship cutoff ranks for {report.exam_name}?
              </span>
              <button
                onClick={() => {
                  window.open(report.sample_paper_url, '_blank');
                  setSampleModalExam(report);
                }}
                className="btn-primary"
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
              >
                <FileText size={12} />
                <span>Practice Sample Paper & Input Mock Score ↗</span>
              </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div style={{ padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'slideIn 0.3s ease' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-border)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {report.verdict_reasoning}
                </div>

                {/* College Tier Qualification Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GraduationCap size={15} color="#8b5cf6" /> Qualified College Tiers
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {report.college_predictions.map((pred, tIdx: number) => {
                      const tierColor = pred.qualifies ? '#10b981' : '#f59e0b';
                      return (
                        <div key={tIdx} style={{ padding: '0.75rem', borderRadius: '8px', background: `${tierColor}08`, border: `1px solid ${tierColor}25`, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{pred.tier_name}</span>
                            <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: `${tierColor}20`, color: tierColor, fontWeight: 700 }}>
                              {pred.qualifies ? 'Eligible' : 'Reach Target (Not Eligible)'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Cutoff / Requirement: {pred.rank_requirement}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                            {pred.colleges.map((c: string) => (
                              <span key={c} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--color-border)' }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Sample Paper Score Input Modal */}
      {sampleModalExam && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#34d399" /> Input Score for {sampleModalExam.exam_name}
              </h3>
              <button onClick={() => setSampleModalExam(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Sample paper opened in a new tab! After attempting, enter the percentage or score obtained below to recalculate your Expected & Optimistic AIR.
            </p>

            <form onSubmit={handleSampleScoreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Score Obtained (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 78"
                  value={sampleScoreInput}
                  onChange={(e) => setSampleScoreInput(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#0a0e1f', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSampleModalExam(null)} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>Update AIR & Tasklist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
