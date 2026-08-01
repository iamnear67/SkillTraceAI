import React from 'react';
import { examsData, ExamData } from '../data/exams';
import { Compass, BookOpen, Clock, Zap } from 'lucide-react';

interface HeroProps {
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
  monthsRemaining: number;
  setMonthsRemaining: (months: number) => void;
  hoursPerDay: number;
  setHoursPerDay: (hours: number) => void;
  onStartDiagnostic: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedExamId,
  setSelectedExamId,
  monthsRemaining,
  setMonthsRemaining,
  hoursPerDay,
  setHoursPerDay,
  onStartDiagnostic
}) => {
  const selectedExam = examsData.find(e => e.id === selectedExamId) || examsData[0];

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header section with brand and description */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
          <Zap size={14} color="#8b5cf6" style={{ filter: 'drop-shadow(0 0 5px #8b5cf6)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Powered by Antigravity Core
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
          Exam Feasibility Engine
        </h1>
        <p style={{ maxWidth: '600px', margin: '0.5rem auto 0', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Traditional exam prep treats everyone as equal. We model your intrinsic learning rate, memory decay, and topic yields to design the mathematically optimal coverage roadmap.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
            <Zap size={20} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Novel Learning Task</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Tracks how you digest an entirely unfamiliar synthetic syntax to estimate your exact raw learning speed and revision effectiveness.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
            <Compass size={20} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>15-Class Cognitive Profile</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Maps micro-skills like symbolic reasoning, multi-step logic, and data interpretation, linking them directly to entrance exam categories.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
            <BookOpen size={20} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Yield Curve Prediction</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Simulates dynamic Gompertz growth and FSRS memory decay to determine your score projection range with 95% Bayesian intervals.
          </p>
        </div>
      </div>

      {/* Main configuration panel */}
      <div className="glass-card glowing" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), rgba(0,0,0,0) 60%), var(--color-bg-surface)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={22} color="#3b82f6" /> Config Target & Parameters
        </h2>

        <div className="grid-cols-12">
          {/* Target Exam Dropdown */}
          <div className="col-span-6 form-group">
            <label htmlFor="target-exam">Target UG Entrance Exam</label>
            <select
              id="target-exam"
              className="form-input"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              style={{ width: '100%', cursor: 'pointer', appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem' }}
            >
              {examsData.map(exam => (
                <option key={exam.id} value={exam.id} style={{ background: '#0a0e1f', color: '#fff' }}>
                  {exam.exam_name} ({exam.category})
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Conducting Body: <strong style={{ color: 'var(--text-main)' }}>{selectedExam.conducting_body}</strong> • Selection: <strong style={{ color: 'var(--text-main)' }}>{selectedExam.selection_model}</strong>
            </span>
          </div>

          {/* Prep Constraints Input Block */}
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Months remaining slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                <label style={{ flexGrow: 1 }}>Months Remaining</label>
                <span className="glow-text-primary" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{monthsRemaining} Months</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock size={16} color="var(--text-muted)" />
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={monthsRemaining}
                  onChange={(e) => setMonthsRemaining(parseInt(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Daily study capacity slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                <label style={{ flexGrow: 1 }}>Study Hours Per Day</label>
                <span className="glow-text-accent" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{hoursPerDay} Hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock size={16} color="var(--text-muted)" />
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

          </div>
        </div>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button onClick={onStartDiagnostic} className="btn-primary" style={{ gap: '0.75rem', fontSize: '1.1rem', padding: '0.85rem 2.5rem' }}>
            <span>Initiate Cognitive Diagnostic</span>
            <Zap size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};
