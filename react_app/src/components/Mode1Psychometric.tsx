import React, { useState, useEffect } from 'react';
import { psychometricQuestions, PsychometricQuestion } from '../data/psychometric';
import { scorePsychometric, rankExams, PsychometricResult, ExamRecommendation } from '../utils/psychometricEngine';
import { getStoredInterestRecord, recordExamInterest, recordTestRetake, UserInterestRecord } from '../utils/userInterestModel';
import { allExams } from '../data/allExams';
import { ChevronRight, Sparkles, BarChart3, GraduationCap, ArrowRight, CheckCircle, Clock, RefreshCw, Plus } from 'lucide-react';

interface Mode1Props {
  savedResult?: PsychometricResult | null;
  savedRecommendations?: ExamRecommendation[];
  onComplete: (result: PsychometricResult, recommendations: ExamRecommendation[]) => void;
  onProceedToPriorTest?: () => void;
}

export const Mode1Psychometric: React.FC<Mode1Props> = ({
  savedResult,
  savedRecommendations,
  onComplete,
  onProceedToPriorTest
}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedLabel: string; timeSec: number }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [phase, setPhase] = useState<'intro' | 'testing' | 'results'>(() => {
    return (savedResult && savedRecommendations && savedRecommendations.length > 0) ? 'results' : 'intro';
  });

  const [result, setResult] = useState<PsychometricResult | null>(savedResult || null);
  const [recommendations, setRecommendations] = useState<ExamRecommendation[]>(savedRecommendations || []);
  const [interestRecord, setInterestRecord] = useState<UserInterestRecord | undefined>();

  useEffect(() => {
    if (savedResult && savedRecommendations && savedRecommendations.length > 0) {
      setResult(savedResult);
      setRecommendations(savedRecommendations);
      if (phase === 'intro') {
        setPhase('results');
      }
    }
  }, [savedResult, savedRecommendations]);

  // Remaining 90 exams state
  const [selectedAddExamId, setSelectedAddExamId] = useState<number>(0);

  const remainingExams = allExams.filter(ex => 
    !recommendations.some(r => r.exam.exam_id === ex.exam_id)
  );

  const handleAddExamFromDropdown = () => {
    if (selectedAddExamId === 0) return;
    const targetExam = allExams.find(e => e.exam_id === selectedAddExamId);
    if (!targetExam) return;

    const newRec: ExamRecommendation = {
      exam: targetExam,
      affinityScore: 0.70,
      matchPercent: 70.0,
      reasoning: `Manually added to target list from database. Category: ${targetExam.category}.`
    };

    const updatedRecs = [...recommendations, newRec];
    setRecommendations(updatedRecs);
    setSelectedAddExamId(0);
    if (result) {
      onComplete(result, updatedRecs);
    }
  };

  // Timed Question state
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    let interval: any = null;
    if (phase === 'testing') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeoutSkip();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, currentQ, selectedOption, answers]);

  const handleTimeoutSkip = () => {
    const question = psychometricQuestions[currentQ];
    const newAnswers = [...answers, { questionId: question.id, selectedLabel: 'TIMEOUT', timeSec: 30.0 }];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < psychometricQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(30);
      setStartTime(Date.now());
    } else {
      const res = scorePsychometric(newAnswers, psychometricQuestions);
      const recRecord = getStoredInterestRecord(res.vector);
      setInterestRecord(recRecord);
      const ranked = rankExams(res, recRecord);
      setResult(res);
      setRecommendations(ranked);
      setPhase('results');
      onComplete(res, ranked);
    }
  };

  const handleStart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setTimeLeft(30);
    setStartTime(Date.now());
    setPhase('testing');
  };

  const handleSelectOption = (label: string) => {
    setSelectedOption(label);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const timeSec = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));
    const question = psychometricQuestions[currentQ];

    const newAnswers = [...answers, { questionId: question.id, selectedLabel: selectedOption, timeSec }];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < psychometricQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(30);
      setStartTime(Date.now());
    } else {
      const res = scorePsychometric(newAnswers, psychometricQuestions);
      const recRecord = getStoredInterestRecord(res.vector);
      setInterestRecord(recRecord);
      const ranked = rankExams(res, recRecord);
      setResult(res);
      setRecommendations(ranked);
      setPhase('results');
      onComplete(res, ranked);
    }
  };

  const handleRetake = () => {
    if (result) {
      const recRecord = interestRecord || getStoredInterestRecord(result.vector);
      const updatedRecord = recordTestRetake(recRecord);
      setInterestRecord(updatedRecord);
    }
    handleStart();
  };

  const handleCardClick = (rec: ExamRecommendation) => {
    if (result) {
      const recRecord = interestRecord || getStoredInterestRecord(result.vector);
      const updated = recordExamInterest(rec.exam, recRecord);
      setInterestRecord(updated);
      const ranked = rankExams(result, updated);
      setRecommendations(ranked);
      onComplete(result, ranked);
    }
  };

  const handleProceed = () => {
    if (result && recommendations.length > 0) {
      onComplete(result, recommendations);
      if (onProceedToPriorTest) {
        onProceedToPriorTest();
      }
    }
  };

  const question: PsychometricQuestion = psychometricQuestions[currentQ];

  // ── INTRO SCREEN ──
  if (phase === 'intro') {
    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '720px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
            <Sparkles size={14} color="#8b5cf6" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Mode 1 — Psychometric Analysis
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
            Discover Your Exam Profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
            Answer 10 timed questions (30s per question) to determine your cognitive aptitude vector across 4 dimensions:
            <strong style={{ color: '#8b5cf6' }}> Quantitative</strong>,
            <strong style={{ color: '#3b82f6' }}> Legal</strong>,
            <strong style={{ color: '#10b981' }}> Management</strong>, and
            <strong style={{ color: '#f59e0b' }}> General</strong> reasoning.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Timed Assessment & Behavioral Learning:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              'Each item features a 30-second live timer to capture response latency insights',
              'Your initial vector is mapped against 100 competitive exams',
              'Behavioral learning algorithm adapts exam ranks based on demonstrated interest over time',
              'Option to retake test at any time to recalibrate your recommendations'
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleStart} className="btn-primary" style={{ gap: '0.75rem', fontSize: '1.05rem', padding: '0.85rem 2.5rem' }}>
            <span>Begin Psychometric Test</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── TESTING SCREEN ──
  if (phase === 'testing') {
    const progress = ((currentQ) / psychometricQuestions.length) * 100;
    const timerColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 12 ? '#f59e0b' : '#3b82f6';

    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '760px', margin: '2rem auto' }}>
        {/* Header & Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <BarChart3 size={16} color="#8b5cf6" />
            <span>Question {currentQ + 1} of {psychometricQuestions.length}</span>
          </div>
          {/* Live Countdown Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: `${timerColor}15`, border: `1px solid ${timerColor}30`, color: timerColor, fontWeight: 700, fontSize: '0.85rem' }}>
            <Clock size={14} className={timeLeft <= 5 ? 'animate-pulse' : ''} />
            <span>{timeLeft}s remaining</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'var(--color-border)' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: '2px', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', transition: 'width 0.4s ease' }} />
        </div>

        {/* Question Card */}
        <div className="glass-card glowing" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', lineHeight: 1.5, fontWeight: 600 }}>
            {question.prompt}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {question.options.map(opt => {
              const isSelected = selectedOption === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelectOption(opt.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '1rem 1.25rem', borderRadius: '10px', textAlign: 'left',
                    background: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'var(--color-bg-panel)',
                    border: isSelected ? '1.5px solid rgba(139, 92, 246, 0.5)' : '1px solid var(--color-border)',
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    fontSize: '0.9rem', lineHeight: 1.4
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? 'none' : '1px solid var(--color-border)',
                    fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-muted)'
                  }}>
                    {opt.label}
                  </div>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="btn-primary"
            style={{
              gap: '0.5rem', fontSize: '0.95rem', padding: '0.7rem 1.8rem',
              opacity: selectedOption ? 1 : 0.4, cursor: selectedOption ? 'pointer' : 'not-allowed'
            }}
          >
            <span>{currentQ < psychometricQuestions.length - 1 ? 'Next Question' : 'Analyze Results'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (phase === 'results' && result) {
    const maxScore = Math.max(result.vector.V_QUANT, result.vector.V_LAW, result.vector.V_MGMT, result.vector.V_GEN, 1);

    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '1rem auto' }}>
        {/* Aptitude Vector Summary */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#8b5cf6" /> Your Aptitude Vector
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.3rem 0.7rem', borderRadius: '6px', color: '#a78bfa', fontWeight: 700 }}>
                Dominant: {result.dominantDimension}
              </span>
              <button onClick={handleRetake} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}>
                <RefreshCw size={12} />
                <span>Retake Test</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {result.dimensionBreakdown.map((dim, i) => {
              const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
              const color = colors[['V_QUANT', 'V_LAW', 'V_MGMT', 'V_GEN'].indexOf(dim.dimension)] || colors[i];
              const pct = maxScore > 0 ? (dim.score / maxScore) * 100 : 0;

              return (
                <div key={dim.dimension} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color }}>{dim.score}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dim.label}</span>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'var(--color-border)' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: color, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 10 Exam Recommendations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="#10b981" /> Top 10 Recommended Exams
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click any card to indicate interest & train pattern model
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {recommendations.map((rec, i) => {
              const matchColor = rec.matchPercent >= 85 ? '#10b981' : rec.matchPercent >= 70 ? '#3b82f6' : '#f59e0b';
              return (
                <div
                  key={rec.exam.exam_id}
                  onClick={() => handleCardClick(rec)}
                  className="glass-card exam-rec-card"
                  style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                >
                  {/* Rank badge */}
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '28px', height: '28px', borderRadius: '50%', background: `${matchColor}20`, border: `1px solid ${matchColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: matchColor }}>
                    {i + 1}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingRight: '2rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{rec.exam.exam_name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rec.exam.category} • {rec.exam.conducting_body}</span>
                  </div>

                  {/* Match meter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--color-border)' }}>
                      <div style={{ width: `${rec.matchPercent}%`, height: '100%', borderRadius: '3px', background: `linear-gradient(to right, ${matchColor}80, ${matchColor})`, transition: 'width 0.8s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: matchColor, whiteSpace: 'nowrap' }}>{rec.matchPercent}%</span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                    {rec.reasoning}
                  </p>

                  {/* Top colleges preview */}
                  {rec.exam.college_mapping.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {rec.exam.college_mapping[0].target_colleges.slice(0, 3).map(college => (
                        <span key={college} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--color-border)', color: 'var(--text-muted)' }}>
                          {college}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Exam from Remaining 90 */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} color="#3b82f6" /> Add Exam from Remaining 90 Dataset
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Select any exam from the complete 100-exam database to manually add it to your tracked target portfolio.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              id="add-remaining-exam-select"
              className="form-input"
              value={selectedAddExamId}
              onChange={(e) => setSelectedAddExamId(parseInt(e.target.value))}
              style={{ flex: 1, padding: '0.6rem 1rem', background: '#0a0e1f', color: '#fff', fontSize: '0.85rem' }}
            >
              <option value={0}>-- Select from remaining {remainingExams.length} exams --</option>
              {remainingExams.map(ex => (
                <option key={ex.exam_id} value={ex.exam_id}>
                  {ex.exam_name} ({ex.category}) — {ex.conducting_body}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddExamFromDropdown}
              disabled={selectedAddExamId === 0}
              className="btn-primary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', gap: '0.4rem', opacity: selectedAddExamId !== 0 ? 1 : 0.5 }}
            >
              <Plus size={15} />
              <span>Add Exam</span>
            </button>
          </div>
        </div>

        {/* Proceed button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={handleRetake} className="btn-secondary" style={{ gap: '0.5rem', padding: '0.85rem 1.5rem' }}>
            <RefreshCw size={16} />
            <span>Retake Test</span>
          </button>
          <button onClick={handleProceed} className="btn-primary" style={{ gap: '0.75rem', fontSize: '1.05rem', padding: '0.85rem 2.5rem' }}>
            <CheckCircle size={18} />
            <span>Continue to Prior Information Test</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
