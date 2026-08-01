import React, { useState, useEffect } from 'react';
import { diagnosticQuestions, Question } from '../data/questions';
import { classPriors } from '../data/priors';
import { computeClassAbilities, predictSubtopicScores, ClassAbility, ExamSubtopicPredictions } from '../utils/priorTestEngine';
import { ExamRecommendation } from '../utils/psychometricEngine';
import { examsData } from '../data/exams';
import { BookOpen, ChevronRight, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Clock, Target, Sparkles, RefreshCw } from 'lucide-react';

interface Mode2Props {
  recommendations: ExamRecommendation[];
  cheatMode?: boolean;
  savedAbilities?: ClassAbility[];
  savedPredictions?: ExamSubtopicPredictions[];
  onComplete: (
    classAbilities: ClassAbility[],
    examPredictions: ExamSubtopicPredictions[],
    diagnosticAnswers: { id: string; correct: boolean; timeSec: number }[]
  ) => void;
}

// Helper: get class name from class_id
function getClassName(classId: string | undefined): string {
  if (!classId) return 'General';
  const prior = classPriors.find(p => p.class_id === classId);
  return prior ? prior.class_name : classId;
}

// Helper: parse option label from string like "A) 31_5"
function parseOptionLabel(optStr: string): string {
  const match = optStr.match(/^([A-D])\)/);
  return match ? match[1] : optStr.charAt(0);
}

// Helper: parse option text from string like "A) 31_5"
function parseOptionText(optStr: string): string {
  return optStr.replace(/^[A-D]\)\s*/, '');
}

export const Mode2PriorTest: React.FC<Mode2Props> = ({
  recommendations,
  cheatMode = false,
  savedAbilities,
  savedPredictions,
  onComplete
}) => {
  const [phase, setPhase] = useState<'intro' | 'testing' | 'results'>(() => {
    return (savedAbilities && savedAbilities.length > 0) ? 'results' : 'intro';
  });

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(25);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; timeSec: number }[]>([]);
  const [classAbilities, setClassAbilities] = useState<ClassAbility[]>(savedAbilities || []);
  const [examPredictions, setExamPredictions] = useState<ExamSubtopicPredictions[]>(savedPredictions || []);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  useEffect(() => {
    if (savedAbilities && savedAbilities.length > 0) {
      setClassAbilities(savedAbilities);
      if (savedPredictions) setExamPredictions(savedPredictions);
      if (phase === 'intro') {
        setPhase('results');
      }
    }
  }, [savedAbilities, savedPredictions]);

  const questions = diagnosticQuestions;
  const question: Question | undefined = questions[currentQ];

  useEffect(() => {
    let timer: any = null;
    if (phase === 'testing') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeoutSkip();
            return 25;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase, currentQ, selectedOption, answers]);

  const finalizeTest = (finalAnswers: { id: string; correct: boolean; timeSec: number }[]) => {
    const abilities = computeClassAbilities(finalAnswers);
    setClassAbilities(abilities);

    const predictions: ExamSubtopicPredictions[] = [];
    recommendations.forEach(rec => {
      const detailedExam = examsData.find(e =>
        e.exam_name.toLowerCase().includes(rec.exam.exam_name.toLowerCase().split(' ')[0]) ||
        rec.exam.exam_name.toLowerCase().includes(e.exam_name.toLowerCase().split(' ')[0])
      );
      if (detailedExam) {
        const pred = predictSubtopicScores(abilities, detailedExam.id);
        if (pred) predictions.push(pred);
      }
    });
    setExamPredictions(predictions);
    setPhase('results');
  };

  const handleTimeoutSkip = () => {
    if (!question) return;

    let newAnswers = [...answers, { id: question.id, correct: false, timeSec: 25.0 }];

    // If cheat mode is active, auto-fill remaining 2 questions for this class
    if (cheatMode) {
      const currentClassId = question.class_id;
      const classQs = questions.filter(q => q.class_id === currentClassId);
      classQs.forEach(q => {
        if (q.id !== question.id && !newAnswers.some(a => a.id === q.id)) {
          newAnswers.push({ id: q.id, correct: true, timeSec: 15.0 });
        }
      });
    }

    setAnswers(newAnswers);
    setSelectedOption(null);

    const nextIndex = cheatMode ? currentQ + 3 : currentQ + 1;

    if (nextIndex < questions.length) {
      setCurrentQ(nextIndex);
      setTimeLeft(25);
      setStartTime(Date.now());
    } else {
      finalizeTest(newAnswers);
    }
  };

  const handleStartTest = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setTimeLeft(25);
    setStartTime(Date.now());
    setPhase('testing');
  };

  const handleSelectOption = (label: string) => {
    setSelectedOption(label);
  };

  const handleNext = () => {
    if (!question) return;

    const timeSec = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));
    const chosenLabel = selectedOption || 'A';
    const isCorrect = selectedOption !== null && chosenLabel === question.correct_option;

    let newAnswers = [...answers, { id: question.id, correct: isCorrect, timeSec }];

    // If cheat mode is active, auto-fill remaining 2 questions for this class
    if (cheatMode) {
      const currentClassId = question.class_id;
      const classQs = questions.filter(q => q.class_id === currentClassId);
      classQs.forEach(q => {
        if (q.id !== question.id && !newAnswers.some(a => a.id === q.id)) {
          newAnswers.push({ id: q.id, correct: true, timeSec: 12.0 });
        }
      });
    }

    setAnswers(newAnswers);
    setSelectedOption(null);

    const nextIndex = cheatMode ? currentQ + 3 : currentQ + 1;

    if (nextIndex < questions.length) {
      setCurrentQ(nextIndex);
      setTimeLeft(25);
      setStartTime(Date.now());
    } else {
      finalizeTest(newAnswers);
    }
  };

  const handleProceed = () => {
    onComplete(classAbilities, examPredictions, answers);
  };

  // ── INTRO SCREEN ──
  if (phase === 'intro') {
    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '720px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
            <BookOpen size={14} color="#3b82f6" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Mode 2 — Prior Information Test
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
            15-Class Cognitive Diagnostic
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
            Answer one timed question (25s countdown) per cognitive class. Response latency and correctness dynamically update predicted % scores across your top 10 recommended exams.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1rem' }}>15 Cognitive Classes Tested:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {questions.map(q => (
              <span key={q.id} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                {getClassName(q.class_id)}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleStartTest} className="btn-primary" style={{ gap: '0.75rem', fontSize: '1.05rem', padding: '0.85rem 2.5rem' }}>
            <span>Begin Diagnostic</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── TESTING SCREEN ──
  if (phase === 'testing' && question) {
    const progress = (currentQ / questions.length) * 100;
    const timerColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : '#3b82f6';

    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '760px', margin: '2rem auto' }}>
        {/* Header with Timed Clock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} color="#3b82f6" />
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {getClassName(question.class_id)} ({currentQ + 1} / {questions.length})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: `${timerColor}15`, border: `1px solid ${timerColor}30`, color: timerColor, fontWeight: 700, fontSize: '0.85rem' }}>
            <Clock size={14} className={timeLeft <= 5 ? 'animate-pulse' : ''} />
            <span>{timeLeft}s remaining</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'var(--color-border)' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: '2px', background: 'linear-gradient(to right, #3b82f6, #10b981)', transition: 'width 0.4s ease' }} />
        </div>

        <div className="glass-card glowing" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff', lineHeight: 1.5, fontWeight: 600 }}>
            {question.prompt}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {question.options.map(optStr => {
              const label = parseOptionLabel(optStr);
              const text = parseOptionText(optStr);
              const isSelected = selectedOption === label;
              return (
                <button
                  key={label}
                  onClick={() => handleSelectOption(label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.85rem 1rem', borderRadius: '8px', textAlign: 'left',
                    background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-panel)',
                    border: isSelected ? '1.5px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--color-border)',
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.88rem'
                  }}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? 'none' : '1px solid var(--color-border)',
                    fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-muted)'
                  }}>
                    {label}
                  </div>
                  <span>{text}</span>
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
            style={{ gap: '0.5rem', fontSize: '0.95rem', padding: '0.7rem 1.8rem', opacity: selectedOption ? 1 : 0.4, cursor: selectedOption ? 'pointer' : 'not-allowed' }}
          >
            <span>{currentQ < questions.length - 1 ? 'Next' : 'Generate Predictions'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (phase === 'results') {
    return (
      <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '1rem auto' }}>
        {/* Class Abilities Summary */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#3b82f6" /> Cognitive Class Abilities
            </h2>
            <button onClick={handleStartTest} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}>
              <RefreshCw size={12} />
              <span>Retake Diagnostic</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
            {classAbilities.map(ca => {
              const pct = Math.round(ca.ability * 100);
              const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444';
              return (
                <div key={ca.class_id} style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{ca.class_name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--color-border)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: color, transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color, whiteSpace: 'nowrap' }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Exam Subtopic Predictions */}
        <h2 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={18} color="#10b981" /> Per-Exam Subtopic Predictions
        </h2>

        {examPredictions.length === 0 && (
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No detailed exam weightage data available for your recommended exams. Predictions will be available for exams with complete syllabus mappings.
          </div>
        )}

        {examPredictions.map(ep => {
          const isExpanded = expandedExam === ep.exam_id;
          const scoreColor = ep.aggregate_predicted_score_percent >= 65 ? '#10b981' : ep.aggregate_predicted_score_percent >= 40 ? '#f59e0b' : '#ef4444';

          return (
            <div key={ep.exam_id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedExam(isExpanded ? null : ep.exam_id)}
                style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{ep.exam_name}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`, color: scoreColor, fontWeight: 700 }}>
                    Avg: {ep.aggregate_predicted_score_percent}%
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ep.subtopic_predictions.length} subtopics</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', animation: 'slideIn 0.3s ease' }}>
                  {ep.subtopic_predictions.map(sp => {
                    const spColor = sp.predicted_percent >= 70 ? '#10b981' : sp.predicted_percent >= 45 ? '#f59e0b' : '#ef4444';
                    return (
                      <div key={sp.subtopic_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--color-bg-panel)' }}>
                        <span style={{ flex: 1, fontSize: '0.8rem', color: '#ddd' }}>{sp.subtopic_name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '0.1rem 0.35rem', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>{sp.complexity}</span>
                        <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'var(--color-border)' }}>
                          <div style={{ width: `${sp.predicted_percent}%`, height: '100%', borderRadius: '2px', background: spColor }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: spColor, width: '35px', textAlign: 'right' }}>{sp.predicted_percent}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Proceed button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={handleStartTest} className="btn-secondary" style={{ gap: '0.5rem', padding: '0.85rem 1.5rem' }}>
            <RefreshCw size={16} />
            <span>Retake Diagnostic</span>
          </button>
          <button onClick={handleProceed} className="btn-primary" style={{ gap: '0.75rem', fontSize: '1.05rem', padding: '0.85rem 2.5rem' }}>
            <CheckCircle size={18} />
            <span>View AIR & College Predictions</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
