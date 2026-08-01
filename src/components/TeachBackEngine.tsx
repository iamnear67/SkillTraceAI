import React, { useState } from 'react';
import { GeminiService, TeachBackEvaluation } from '../utils/aiService';
import { Brain, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, Lightbulb, Loader2, ArrowRight } from 'lucide-react';

export const TeachBackEngine: React.FC = () => {
  const [topic, setTopic] = useState('Newtonian Mechanics & Force Equilibrium');
  const [studentExplanation, setStudentExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<TeachBackEvaluation | null>(null);

  const sampleTopics = [
    'Newtonian Mechanics & Force Equilibrium',
    'Bayesian Probability & Conditional Distribution',
    'Neural Network Backpropagation & Gradient Descent',
    'Kyrosian Memory Decay & Spaced Repetition kinetics',
    'Electrostatics & Gauss’s Law'
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentExplanation.trim()) return;

    setIsEvaluating(true);
    setResult(null);

    const res = await GeminiService.evaluateTeachBack(topic, studentExplanation);
    setResult(res);
    setIsEvaluating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 55) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-card animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', background: 'rgba(139,92,246,0.15)', borderRadius: '4px', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Brain size={14} /> TEACHBACK AI EVALUATION ENGINE
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, fontWeight: 900 }}>
            Explain-to-Master Active Learning
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Explain any topic in your own words. Gemini evaluates misconceptions, calculates your 0-100% mastery score, generates analogies & follow-up questions.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Target Topic</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {sampleTopics.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(t)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: topic === t ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.3)',
                  color: topic === t ? '#60a5fa' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Your Explanation (Explain as if teaching a peer)</label>
          <textarea
            value={studentExplanation}
            onChange={e => setStudentExplanation(e.target.value)}
            rows={5}
            placeholder="Type your detailed explanation of how this concept works, key formulas, and why it is significant..."
            required
            style={{ width: '100%', padding: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', lineHeight: 1.5 }}
          />
        </div>

        <button
          type="submit"
          disabled={isEvaluating || !studentExplanation.trim()}
          className="btn-primary"
          style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {isEvaluating ? (
            <>
              <Loader2 size={18} className="spin" /> Gemini AI Evaluating Comprehension...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Submit TeachBack for Gemini AI Evaluation
            </>
          )}
        </button>
      </form>

      {/* AI Evaluation Results */}
      {result && (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          
          {/* Score Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: `1px solid ${getScoreColor(result.masteryScore)}40` }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>COMPREHENSION MASTERY</span>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Topic: {topic}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: getScoreColor(result.masteryScore) }}>
                {result.masteryScore}%
              </span>
              <div style={{ fontSize: '0.75rem', color: getScoreColor(result.masteryScore), fontWeight: 700 }}>
                {result.masteryScore >= 85 ? 'Mastery Achieved' : result.masteryScore >= 70 ? 'Proficient' : 'Needs Review'}
              </div>
            </div>
          </div>

          {/* Explanation Analysis */}
          <div style={{ background: 'rgba(59,130,246,0.08)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ color: '#60a5fa', margin: '0 0 0.4rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> Student Explanation Analysis
            </h4>
            <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {result.explanationAnalysis}
            </p>
          </div>

          {/* Misconceptions & Gaps */}
          <div style={{ background: 'rgba(245,158,11,0.08)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
            <h4 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} /> Misconceptions & Gaps Identified
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {result.misconceptions.map((item, idx) => (
                <div key={idx} style={{ color: '#ddd', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#f59e0b' }}>•</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Question & Intuitive Analogy */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(139,92,246,0.08)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ color: '#a78bfa', margin: '0 0 0.4rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HelpCircle size={16} /> Gemini Probing Follow-Up Question
              </h4>
              <p style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1.4, margin: 0, fontWeight: 600 }}>
                "{result.followupQuestion}"
              </p>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#34d399', margin: '0 0 0.4rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lightbulb size={16} /> Intuitive Real-World Analogy
              </h4>
              <p style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1.4, margin: 0, fontStyle: 'italic' }}>
                "{result.analogy}"
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
