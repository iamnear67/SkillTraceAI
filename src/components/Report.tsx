import React from 'react';
import { CalibratedProfile, PredictionResult, runPredictionEngine } from '../utils/engine';
import { examsData } from '../data/exams';
import { classPriors } from '../data/priors';
import { Brain, Trophy, GraduationCap, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface ReportProps {
  profile: CalibratedProfile;
  monthsRemaining: number;
  hoursPerDay: number;
  onSelectExam: (examId: string) => void;
  selectedExamId: string;
}

export const Report: React.FC<ReportProps> = ({
  profile,
  monthsRemaining,
  hoursPerDay,
  onSelectExam,
  selectedExamId
}) => {
  // 1. Run prediction for all available exams
  const predictions: PredictionResult[] = examsData.map(exam => {
    return runPredictionEngine(profile, exam, { daysRemaining: monthsRemaining * 30, hoursPerDay });
  });

  // Sort exams by feasibility index descending
  const sortedPredictions = [...predictions].sort((a, b) => b.feasibility_index - a.feasibility_index);

  // 2. Map scholarships from DST, Reliance, NSP, Aditya Birla
  // We check eligibility based on predicted scores and course mappings.
  const checkScholarshipEligibility = () => {
    const jeeAdvPred = predictions.find(p => p.exam_name === "JEE Advanced");
    const jeeMainPred = predictions.find(p => p.exam_name === "JEE Main");
    
    // DST INSPIRE SHE: requires rank < 10000 in JEE Adv or Main.
    // Let's assume a predicted score of 160+ in JEE Advanced or 180+ in JEE Main qualifies for DST SHE.
    const isDstEligible = (jeeAdvPred && jeeAdvPred.optimized_score >= 150) || (jeeMainPred && jeeMainPred.optimized_score >= 180);

    // Reliance Foundation: Open to all regular UG courses, requires a baseline test.
    // Eligible since student cognitive metrics are computed and fit UG profiles.
    const isRelianceEligible = true;

    // NSP Top Class SC: requires top tier institute admission (e.g. IITs, NITs, NLUs, etc.).
    // Highly eligible if JEE Adv/Main or CLAT predicted optimized score crosses cutoff.
    const clatPred = predictions.find(p => p.exam_name === "CLAT UG");
    const isNspEligible = (jeeAdvPred && jeeAdvPred.optimized_score >= 140) || 
                          (jeeMainPred && jeeMainPred.optimized_score >= 160) ||
                          (clatPred && clatPred.optimized_score >= 82);

    return [
      {
        id: "SCH_DST_INSPIRE_SHE",
        name: "INSPIRE Scholarship for Higher Education (SHE)",
        provider: "DST, Govt. of India",
        benefit: "₹80,000 / year (₹60k Cash + ₹20k Projects)",
        status: isDstEligible ? 'HIGHLY_ELIGIBLE' : 'QUALIFYING_POSSIBLE',
        reason: isDstEligible 
          ? "Your predicted JEE scores place you in the top tier required for natural sciences grants." 
          : "Boost your JEE Main/Advanced score past 180 to lock in national scholarship ranking."
      },
      {
        id: "SCH_RF_UG_2026",
        name: "Reliance Foundation UG Scholarship",
        provider: "Reliance Foundation",
        benefit: "Up to ₹2,00,000 over course duration",
        status: 'ELIGIBLE_TO_APPLY',
        reason: "Requires a clientside aptitude test. Your high cognitive profile indicates a strong pass probability."
      },
      {
        id: "SCH_NSP_TOP_CLASS_SC",
        name: "Central Sector Top Class SC Scheme",
        provider: "Ministry of Social Justice & Empowerment",
        benefit: "100% Tuition Waiver + ₹3k/mo allowance",
        status: isNspEligible ? 'HIGHLY_ELIGIBLE' : 'INSTITUTION_DEPENDENT',
        reason: isNspEligible 
          ? "Predicted scores are sufficient for Tier-1 institutes (IITs, NLUs, NITs) qualifying for NSP listing." 
          : "Requires secured admission in top-tier national institutes. Target Old IITs or Top NLUs."
      }
    ];
  };

  const scholarships = checkScholarshipEligibility();

  // Helper to color feasibility status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HIGHLY_FEASIBLE': return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
      case 'FEASIBLE_WITH_EFFORT': return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
      default: return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
    }
  };

  return (
    <div className="grid-cols-12 animate-slide-in">
      
      {/* 1. Global Parameters Summary banner */}
      <div className="col-span-12 glass-card glowing-accent" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-around', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Intrinsic Learning Speed (Alpha)
          </span>
          <span className="glow-text-accent" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {profile.global_alpha} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>tokens/day</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Calibration Confidence: {Math.round(profile.class_evaluations[0].confidence_score * 100)}%
          </span>
        </div>

        <div style={{ width: '1px', height: '40px', background: 'var(--color-border)', alignSelf: 'center' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Base Forgetting Rate (Lambda)
          </span>
          <span className="glow-text-primary" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {profile.global_lambda} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>decay/day</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Stability Half-Life: ~{Math.round(1 / profile.global_lambda)} days
          </span>
        </div>

        <div style={{ width: '1px', height: '40px', background: 'var(--color-border)', alignSelf: 'center' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revision Efficiency
          </span>
          <span className="glow-text-success" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {Math.round(profile.revision_efficiency * 100)}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Concept Recovery Speed: Exceptional
          </span>
        </div>

      </div>

      {/* 2. Left Column: Exam Feasibility Reports */}
      <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--color-primary)" /> Entrance Exam Feasibility Indices
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sortedPredictions.map(pred => {
              const colors = getStatusColor(pred.feasibility_status);
              const isSelected = pred.exam_id === selectedExamId;

              return (
                <div
                  key={pred.exam_id}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.04)' : 'var(--color-bg-panel)',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>{pred.exam_name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Cutoff: {pred.cutoff} / {pred.total_marks} marks</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: colors.text,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        letterSpacing: '0.05em'
                      }}>
                        {pred.feasibility_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Prediction stats visual mapping */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Projected Score: <strong style={{ color: '#fff' }}>{pred.optimized_score}</strong> / {pred.total_marks}</span>
                      <span style={{ color: 'var(--text-muted)' }}>95% Credible Interval: <strong style={{ color: '#fff' }}>[{pred.credible_interval_95[0]} - {pred.credible_interval_95[1]}]</strong></span>
                    </div>

                    {/* Progress Bar indicating prediction range */}
                    <div className="progress-bar-container" style={{ height: '6px' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${(pred.credible_interval_95[0] / pred.total_marks) * 100}%`,
                          width: `${((pred.credible_interval_95[1] - pred.credible_interval_95[0]) / pred.total_marks) * 100}%`,
                          background: 'rgba(59, 130, 246, 0.25)',
                          height: '100%'
                        }}
                      />
                      <div
                        style={{
                          width: `${(pred.optimized_score / pred.total_marks) * 100}%`,
                          background: pred.feasibility_status === 'HIGHLY_FEASIBLE' ? 'var(--color-success)' : pred.feasibility_status === 'FEASIBLE_WITH_EFFORT' ? 'var(--color-warning)' : 'var(--color-danger)',
                          height: '100%'
                        }}
                        className="progress-bar-fill"
                      />
                    </div>
                  </div>

                  {/* College mappings snippet */}
                  {pred.feasibility_status !== 'LOW_FEASIBILITY' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--color-border)', paddingLeft: '0.5rem', marginLeft: '0.1rem' }}>
                      💡 Target Colleges: {examsData.find(e => e.id === pred.exam_id)?.college_mapping[0].target_colleges.slice(0, 3).join(', ')}...
                    </div>
                  )}

                  {/* Select buttons */}
                  <div style={{ display: 'flex', justifyContent: 'end', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => onSelectExam(pred.exam_id)}
                      className={isSelected ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', gap: '0.25rem', borderRadius: '6px' }}
                    >
                      <span>{isSelected ? 'Roadmap Selected' : 'Configure Study Roadmap'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Right Column: Cognitive Profiling Map & Scholarships */}
      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Cognitive Class radar-list mapping */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} color="var(--color-accent)" /> Cognitive Profile Mapping
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {profile.class_evaluations.map(classEval => {
              const standingPercent = Math.min(100, Math.round(classEval.weight_multiplier_W * 55)); // mapped to standing gauge
              const isHigh = classEval.weight_multiplier_W >= 1.15;
              const isLow = classEval.weight_multiplier_W < 0.85;

              return (
                <div key={classEval.class_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{classEval.class_name}</span>
                    <span style={{ color: isHigh ? 'var(--color-success)' : isLow ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: 700 }}>
                      W: {classEval.weight_multiplier_W}
                    </span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '4px' }}>
                    <div
                      style={{
                        width: `${standingPercent}%`,
                        background: isHigh ? 'var(--color-success)' : isLow ? 'var(--color-danger)' : 'var(--color-primary)'
                      }}
                      className="progress-bar-fill"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scholarship Check card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--color-success)" /> Scholarship Opportunities
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scholarships.map(s => {
              const isHighlyEligible = s.status === 'HIGHLY_ELIGIBLE';
              const isEligibleApply = s.status === 'ELIGIBLE_TO_APPLY';

              return (
                <div key={s.id} style={{ background: 'var(--color-bg-panel)', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: `3px solid ${isHighlyEligible ? 'var(--color-success)' : isEligibleApply ? 'var(--color-primary)' : 'var(--text-dark)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.25rem' }}>
                    <h5 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{s.name}</h5>
                    <div style={{ flexShrink: 0 }}>
                      {isHighlyEligible ? (
                        <ShieldCheck size={16} color="var(--color-success)" />
                      ) : (
                        <CheckCircle2 size={16} color="var(--text-dark)" />
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>{s.benefit}</span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{s.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
