import React, { useState, useEffect, useRef } from 'react';
import { Rule, Question, syntheticRules, syntheticQuestions, diagnosticQuestions } from '../data/questions';
import { ArrowRight, BookOpen, Clock, HelpCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface DiagnosticProps {
  onComplete: (
    phase1Answers: { id: string; correct: boolean; timeSec: number }[],
    phase2Answers: { id: string; correct: boolean; timeSec: number }[]
  ) => void;
}

export const Diagnostic: React.FC<DiagnosticProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<'intro_p1' | 'questions_p1' | 'intro_p2' | 'questions_p2'>('intro_p1');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Tracking answers
  const [p1Answers, setP1Answers] = useState<{ id: string; correct: boolean; timeSec: number }[]>([]);
  const [p2Answers, setP2Answers] = useState<{ id: string; correct: boolean; timeSec: number }[]>([]);

  // Revision state for Phase 1
  const [showRevisionCard, setShowRevisionCard] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  // Timers
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<any>(null);

  // Start question timer when a question is loaded
  useEffect(() => {
    if (currentPhase === 'questions_p1' || currentPhase === 'questions_p2') {
      setElapsedTime(0);
      setSelectedOption(null);
      setShowRevisionCard(false);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPhase, questionIndex]);

  const activeQuestions = currentPhase === 'questions_p1' ? syntheticQuestions : diagnosticQuestions;
  const activeQuestion = activeQuestions[questionIndex];

  const handleSelectOption = (optionKey: string) => {
    if (showRevisionCard) return; // lock selection when revision is showing
    setSelectedOption(optionKey);
  };

  const handleNext = () => {
    if (!selectedOption || !activeQuestion) return;

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = selectedOption === activeQuestion.correct_option;
    const timeTaken = Math.max(1, elapsedTime);

    if (currentPhase === 'questions_p1') {
      // Phase 1 (synthetic learning task): If got wrong, we trigger the revision screen
      if (!isCorrect && activeQuestion.revision_card && !showRevisionCard) {
        setWasCorrect(false);
        setShowRevisionCard(true);
        // We log it as wrong, but wait until they dismiss the revision to go next
        return;
      }

      // Save answer
      const updatedP1Answers = [
        ...p1Answers,
        { id: activeQuestion.id, correct: showRevisionCard ? false : isCorrect, timeSec: timeTaken }
      ];
      setP1Answers(updatedP1Answers);

      // Reset revision
      setShowRevisionCard(false);

      // Check transition to next question or next phase
      if (questionIndex < syntheticQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        // Go to Phase 2 introduction
        setCurrentPhase('intro_p2');
        setQuestionIndex(0);
      }
    } else {
      // Phase 2 (cognitive diagnostic)
      const updatedP2Answers = [
        ...p2Answers,
        { id: activeQuestion.id, correct: isCorrect, timeSec: timeTaken }
      ];
      setP2Answers(updatedP2Answers);

      // Transition to next question or complete
      if (questionIndex < diagnosticQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        // Stop timer and submit
        if (timerRef.current) clearInterval(timerRef.current);
        onComplete(p1Answers, updatedP2Answers);
      }
    }
  };

  // Helper to get total progress percentage
  const getProgressPercent = () => {
    const totalQuestions = syntheticQuestions.length + diagnosticQuestions.length;
    const completed = p1Answers.length + p2Answers.length;
    return (completed / totalQuestions) * 100;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Progress header */}
      {(currentPhase === 'questions_p1' || currentPhase === 'questions_p2') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Assessment Progress</span>
            <span>Question {p1Answers.length + p2Answers.length + 1} of {syntheticQuestions.length + diagnosticQuestions.length}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${getProgressPercent()}%`, background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))' }} />
          </div>
        </div>
      )}

      {/* Screen 1: Phase 1 Introduction & Rules */}
      {currentPhase === 'intro_p1' && (
        <div className="glass-card glowing-accent animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={24} color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Phase 1: Novel Syntax Learning Task</h2>
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            To measure your intrinsic **learning speed**, **forgetting curve**, and **revision retention**, you will be presented with a set of synthetic mathematical rules representing a mock science system: <strong style={{ color: 'var(--text-main)' }}>Kyrosian Kinetic-Aether Dynamics</strong>.
          </p>

          <h4 style={{ fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.4rem' }}>
            Please study these 4 rules carefully:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {syntheticRules.map(rule => (
              <div key={rule.id} style={{ background: 'var(--color-bg-panel)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--color-accent)' }}>
                <h5 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{rule.title}</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{rule.content}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifySelf: 'end', marginTop: '1rem' }}>
            <button onClick={() => setCurrentPhase('questions_p1')} className="btn-primary" style={{ gap: '0.5rem' }}>
              <span>Enter Phase 1 Practice</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Phase 2 Introduction */}
      {currentPhase === 'intro_p2' && (
        <div className="glass-card glowing animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HelpCircle size={24} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Phase 2: Cognitive Micro-Diagnostic</h2>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Excellent! Phase 1 is complete. We will now administer a 15-question micro-diagnostic cover test.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Each question tests a distinct cognitive aptitude category (e.g., conceptual math, symbolic reasoning, processing speed, and logical deduction). We measure both correctness and reaction latency to construct your exact cognitive map.
          </p>

          <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
            <Lightbulb size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>Tip:</strong> Move through the questions at a natural pace. Speed is factored into processing agility, but accuracy remains a major contributor.
            </div>
          </div>

          <div style={{ display: 'flex', justifySelf: 'end', marginTop: '1rem' }}>
            <button onClick={() => setCurrentPhase('questions_p2')} className="btn-primary" style={{ gap: '0.5rem' }}>
              <span>Start Cognitive Battery</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Question Display for Phase 1 & 2 */}
      {(currentPhase === 'questions_p1' || currentPhase === 'questions_p2') && activeQuestion && (
        <div className="glass-card animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '380px' }}>
          
          {/* Question header info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: currentPhase === 'questions_p1' ? '#a78bfa' : '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {currentPhase === 'questions_p1' ? 'Phase 1: Novel Syntax' : 'Phase 2: Cognitive Skill'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>Time: <strong style={{ color: elapsedTime > 30 ? 'var(--color-danger)' : 'var(--text-main)' }}>{elapsedTime}s</strong></span>
            </div>
          </div>

          {/* Prompt */}
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
            {activeQuestion.prompt}
          </div>

          {/* Options stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.5rem 0' }}>
            {activeQuestion.options.map((option, idx) => {
              const optionKey = option.charAt(0); // A, B, C, D
              const isSelected = selectedOption === optionKey;
              
              // Define styling states
              let cardBg = 'var(--color-bg-panel)';
              let borderCol = 'var(--color-border)';

              if (isSelected) {
                cardBg = 'rgba(139, 92, 246, 0.08)';
                borderCol = 'var(--color-accent)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(optionKey)}
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderCol}`,
                    padding: '1rem',
                    borderRadius: '8px',
                    cursor: showRevisionCard ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.05)' : 'none'
                  }}
                  className={showRevisionCard ? '' : 'option-card-hover'}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--text-muted)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isSelected ? '#a78bfa' : 'var(--text-muted)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                    flexShrink: 0
                  }}>
                    {optionKey}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: isSelected ? '#fff' : 'var(--text-muted)' }}>{option.substring(3)}</span>
                </div>
              );
            })}
          </div>

          {/* Revision Card Modal Overlay */}
          {showRevisionCard && activeQuestion.revision_card && (
            <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'slideIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
                <AlertTriangle size={18} />
                <h5 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Incorrect Answer - Conceptual Revision</h5>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {activeQuestion.revision_card}
              </p>
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '0.25rem' }}>
                <button
                  onClick={handleNext}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', gap: '0.4rem', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', color: '#fca5a5' }}
                >
                  <span>Acknowledge & Continue</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Submit / Next Button */}
          {!showRevisionCard && (
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="btn-primary"
                style={{
                  padding: '0.7rem 2rem',
                  fontSize: '0.95rem',
                  opacity: selectedOption ? 1 : 0.5,
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                  gap: '0.5rem'
                }}
              >
                <span>{questionIndex === activeQuestions.length - 1 && currentPhase === 'questions_p2' ? 'Complete Test' : 'Submit Answer'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Internal CSS for Hover */}
      <style>{`
        .option-card-hover:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </div>
  );
};
