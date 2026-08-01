import React, { useState } from 'react';
import { Play, Clock, ArrowRight, Brain, AlertTriangle } from 'lucide-react';

interface Mode4DecayTestProps {
  onComplete: (alpha: number, lambda: number) => void;
}

export const Mode4DecayTest: React.FC<Mode4DecayTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'learning' | 'jump_6h' | 'jump_2d' | 'jump_1w' | 'jump_1m' | 'results'>('intro');
  const [learningTime, setLearningTime] = useState(60); // 60 seconds to memorize
  const [scores, setScores] = useState({ h6: 0, d2: 0, w1: 0, m1: 0 });
  const [currentQ, setCurrentQ] = useState(0);

  // The Kyrosian Rules with Concrete Worked Examples (Synthetic Task)
  const syntheticRules = [
    {
      rule: "Rule 1: If an operand is Omega (Ω), the Delta (Δ) operator evaluates to the inverse of the second operand.",
      example: "Worked Example: In expression 'Ω Δ 8', operand 1 is Ω and operand 2 is 8. Therefore, Ω Δ 8 = 1/8 = 0.125."
    },
    {
      rule: "Rule 2: If both operands are Sigma (Σ), the Gamma (Γ) operator yields 42.",
      example: "Worked Example: In expression 'Σ Γ Σ', both operands are Σ, so the expression evaluates to exactly 42."
    },
    {
      rule: "Rule 3: A Kyrosian vector collapses if its magnitude exceeds the threshold of Pi (π ≈ 3.14159).",
      example: "Worked Example: Vector A has magnitude 4.15 (4.15 > 3.14159) → Vector Collapses. Vector B has magnitude 2.70 → Remains Stable."
    },
    {
      rule: "Rule 4: The state of a node is 'Active' only if it has exactly two 'Dormant' neighbors.",
      example: "Worked Example: Node X has neighbors [Dormant, Dormant, Active] (2 Dormant) → Node X is ACTIVE. Node Y has [Dormant, Active, Active] (1 Dormant) → Node Y is INACTIVE."
    }
  ];

  const questions = {
    h6: {
      q: "Under Kyrosian rules, what does the Delta (Δ) operator evaluate to if EXACTLY one operand is Omega (Ω)?",
      opts: ["Yields 42", "The inverse of the second operand", "Collapses the vector", "Remains active"],
      ans: 1
    },
    d2: {
      q: "When does the Gamma (Γ) operator yield 42?",
      opts: ["When magnitude exceeds Pi", "When exactly one operand is Omega", "When both operands are Sigma (Σ)", "When it has two Dormant neighbors"],
      ans: 2
    },
    w1: {
      q: "When does a Kyrosian vector collapse?",
      opts: ["When it reaches 42", "When its magnitude exceeds the threshold of Pi (π)", "When it is Dormant", "When both operands are Omega"],
      ans: 1
    },
    m1: {
      q: "A node is 'Active' only if it has exactly how many 'Dormant' neighbors?",
      opts: ["Zero", "One", "Two", "Three"],
      ans: 2
    }
  };

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'learning' && learningTime > 0) {
      timer = setTimeout(() => setLearningTime(t => t - 1), 1000);
    } else if (phase === 'learning' && learningTime === 0) {
      setPhase('jump_6h');
    }
    return () => clearTimeout(timer);
  }, [phase, learningTime]);

  const handleAnswer = (jumpPhase: 'h6' | 'd2' | 'w1' | 'm1', ansIdx: number) => {
    const isCorrect = ansIdx === questions[jumpPhase].ans;
    setScores(prev => ({ ...prev, [jumpPhase]: isCorrect ? 1 : 0 }));
    
    if (jumpPhase === 'h6') setPhase('jump_2d');
    else if (jumpPhase === 'd2') setPhase('jump_1w');
    else if (jumpPhase === 'w1') setPhase('jump_1m');
    else {
      // Calculate Alpha and Lambda
      setPhase('results');
    }
  };

  const calculateRates = () => {
    // Simulated Alpha (Learning rate): based on initial + 6h accuracy
    const alpha = (scores.h6 === 1) ? 1.4 : 0.8;
    
    // Simulated Lambda (Decay rate): based on performance degradation over time
    const totalDecay = (1 - scores.d2) + (1 - scores.w1) + (1 - scores.m1);
    const lambda = 0.02 + (totalDecay * 0.05); // Lower is better retention
    
    return { alpha, lambda };
  };

  const renderQuiz = (jumpPhase: 'h6' | 'd2' | 'w1' | 'm1', title: string) => (
    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={20} color="#f59e0b" /> Time Jump: {title}
      </h2>
      <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6 }}>{questions[jumpPhase].q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions[jumpPhase].opts.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(jumpPhase, i)}
            className="btn-secondary" 
            style={{ textAlign: 'left', padding: '1rem', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.03)' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '2rem' }}>
      
      {phase === 'intro' && (
        <div className="glass-card animate-slide-in" style={{ maxWidth: '600px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Brain size={36} color="#f59e0b" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Phase 3 & 5: Learning & Decay</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              You will now be shown a novel synthetic logical system that no student has ever seen before (Kyrosian Rules). 
              <br/><br/>
              You will have 60 seconds to memorize it. Then, we will simulate the passage of time (6 hours, 2 days, 1 week, 1 month) to calculate your exact raw learning speed (α) and memory decay rate (λ).
            </p>
          </div>
          <button onClick={() => setPhase('learning')} className="btn-primary" style={{ padding: '0.8rem 2rem', alignSelf: 'center', display: 'flex', gap: '0.5rem' }}>
            <Play size={18} /> Begin Learning
          </button>
        </div>
      )}

      {phase === 'learning' && (
        <div className="glass-card animate-slide-in" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#f59e0b', margin: 0 }}>Memorize: Kyrosian Rules</h2>
            <div style={{ fontSize: '1.2rem', color: learningTime < 10 ? '#ef4444' : '#fff', fontWeight: 800 }}>
              00:{learningTime.toString().padStart(2, '0')}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)', maxHeight: '420px', overflowY: 'auto' }}>
            {syntheticRules.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{item.rule}</div>
                <div style={{ color: '#60a5fa', fontSize: '0.8rem', background: 'rgba(59,130,246,0.1)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.2)' }}>
                  💡 <strong>{item.example}</strong>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={14} color="#f59e0b" /> Focus deeply. This cannot be paused.
            </div>
            <button onClick={() => setPhase('jump_6h')} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Skip Timer <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {phase === 'jump_6h' && renderQuiz('h6', '+6 Hours Later')}
      {phase === 'jump_2d' && renderQuiz('d2', '+2 Days Later')}
      {phase === 'jump_1w' && renderQuiz('w1', '+1 Week Later')}
      {phase === 'jump_1m' && renderQuiz('m1', '+1 Month Later')}

      {phase === 'results' && (() => {
        const { alpha, lambda } = calculateRates();
        return (
          <div className="glass-card animate-slide-in" style={{ maxWidth: '600px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Test Complete</h2>
            
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', padding: '1.5rem', borderRadius: '12px', flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: '#60a5fa', marginBottom: '0.5rem' }}>Learning Rate (α)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{alpha.toFixed(2)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Higher is better</div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '1.5rem', borderRadius: '12px', flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: '#f87171', marginBottom: '0.5rem' }}>Decay Rate (λ)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{lambda.toFixed(2)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Lower is better</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Your tasklist has been automatically re-calibrated. 
              {alpha > 1 ? " Your high learning rate reduces estimated task completion times." : " Your task estimates have been stabilized."}
              {lambda > 0.05 ? " Spaced repetition tasks will be injected to counter high memory decay." : " Your strong retention means fewer review tasks are needed."}
            </p>

            <button onClick={() => onComplete(alpha, lambda)} className="btn-primary" style={{ padding: '1rem 2rem' }}>
              Save & Return to Dashboard
            </button>
          </div>
        );
      })()}

    </div>
  );
};
