import React, { useState, useEffect } from 'react';
import { GeminiService, CareerRecommendationItem } from '../utils/aiService';
import { Briefcase, Sparkles, Target, ArrowRight, CheckCircle2, BookOpen, Loader2 } from 'lucide-react';

interface CareerRecommendationViewProps {
  userSkills?: string[];
  userInterests?: string[];
}

export const CareerRecommendationView: React.FC<CareerRecommendationViewProps> = ({ 
  userSkills = ['Mathematics', 'Physics', 'Analytical Logic', 'Data Structures'],
  userInterests = ['Artificial Intelligence', 'Quantitative Finance', 'Robotics']
}) => {
  const [recommendations, setRecommendations] = useState<CareerRecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCareers = async () => {
    setIsLoading(true);
    const data = await GeminiService.generateCareerRecommendations(userSkills, userInterests);
    setRecommendations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <div className="glass-card animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', background: 'rgba(59,130,246,0.15)', borderRadius: '4px', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Briefcase size={14} /> DYNAMIC GEMINI CAREER INTELLIGENCE
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, fontWeight: 900 }}>
            AI Personalized Career Path Rationale
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Evaluates your skills, psychometrics, and evidence vector to output exact career justifications, skill gaps, and learning roadmaps.
          </p>
        </div>

        <button 
          onClick={fetchCareers} 
          disabled={isLoading}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}
        >
          {isLoading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} Re-analyze Career Paths
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Loader2 size={24} color="#3b82f6" className="spin" />
          <span>Gemini AI is synthesizing personalized career paths based on your RAG portfolio context...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recommendations.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Top Title & Match % */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>{item.careerTitle}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Career Path</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', color: '#34d399', fontWeight: 900 }}>{item.matchPercentage}%</span>
                  <div style={{ fontSize: '0.7rem', color: '#34d399' }}>Aptitude & Skill Match</div>
                </div>
              </div>

              {/* Why this career? */}
              <div style={{ background: 'rgba(59,130,246,0.08)', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ color: '#60a5fa', margin: '0 0 0.4rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Why this career?
                </h4>
                <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  {item.whyThisCareer}
                </p>
              </div>

              {/* Missing Skills & Learning Roadmap */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Missing Skills */}
                <div style={{ background: 'rgba(239,68,68,0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <h4 style={{ color: '#f87171', margin: '0 0 0.5rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Missing Skills & Gaps
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {item.missingSkills.map((sk, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>
                        ! {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Roadmap */}
                <div style={{ background: 'rgba(16,185,129,0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <h4 style={{ color: '#34d399', margin: '0 0 0.5rem 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    4-Step Learning Roadmap
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {item.learningRoadmap.map((step, rIdx) => (
                      <div key={rIdx} style={{ color: '#ddd', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#34d399', fontWeight: 800 }}>Step {rIdx + 1}:</span> {step}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
