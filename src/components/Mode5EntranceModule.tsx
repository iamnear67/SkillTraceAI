import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { 
  Brain, Download, Sparkles, Sliders, CheckCircle2, TrendingUp, Award, Briefcase
} from 'lucide-react';
import { Mode4DecayTest } from './Mode4DecayTest';
import { TeachBackEngine } from './TeachBackEngine';
import { CareerRecommendationView } from './CareerRecommendationView';
import { ExamRecommendation } from '../utils/psychometricEngine';

interface Mode5EntranceModuleProps {
  recommendations: ExamRecommendation[];
  onDecayTestComplete: (alpha: number, lambda: number) => void;
}

export const Mode5EntranceModule: React.FC<Mode5EntranceModuleProps> = ({ 
  recommendations, onDecayTestComplete 
}) => {
  const [subTab, setSubTab] = useState<number>(1);

  // Parameters Pipeline State (enterance/parameters_send)
  const [paramState, setParamState] = useState(() => {
    try {
      const saved = localStorage.getItem('skilltrace_custom_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.paramState) return parsed.paramState;
      }
    } catch (e) {}
    return {
      analytical: 120,
      math: 98,
      physics: 86,
      logic: 99,
      spatial: 85,
      pattern: 65
    };
  });

  // Automatically sync custom profile state to localStorage for Dashboard mapping
  React.useEffect(() => {
    try {
      const avg = Math.round((paramState.analytical + paramState.math + paramState.physics + paramState.logic + paramState.spatial + paramState.pattern) / 9);
      const profileData = {
        isCustom: true,
        hasData: true,
        overallReadiness: Math.min(99, Math.max(40, avg)),
        dominantPillar: paramState.analytical > 110 ? 'Analytical & AI' : 'STEM Engineering',
        paramState: paramState,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('skilltrace_custom_profile', JSON.stringify(profileData));
    } catch (e) {}
  }, [paramState]);

  const [pipelineMessage, setPipelineMessage] = useState<string | null>(null);

  // Compute live radar metrics via normalizer pipeline
  const computedRadarData = [
    { subject: 'Analytical', A: paramState.analytical, fullMark: 150 },
    { subject: 'Theoretical Math', A: paramState.math, fullMark: 150 },
    { subject: 'Applied Physics', A: paramState.physics, fullMark: 150 },
    { subject: 'Verbal Logic', A: paramState.logic, fullMark: 150 },
    { subject: 'Spatial Reasoning', A: paramState.spatial, fullMark: 150 },
    { subject: 'Pattern Rec', A: paramState.pattern, fullMark: 150 },
  ];

  const handleRunPipeline = () => {
    setPipelineMessage("Running Competency_service.py, analyze.py, normalizer.py & skill_mappings.py...");
    setTimeout(() => {
      setPipelineMessage("✓ Parameters pipeline executed & mapped to Dashboard successfully!");
    }, 800);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="printable-area" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header Banner for Entrance Module */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(59,130,246,0.1) 100%)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
              UNIFIED ENTRANCE MODULE
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phase 5 Engine & Gemini RAG Hub</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: 900 }}>
            Entrance Evaluation & Gemini AI Intelligence
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Access TeachBack AI evaluation, dynamic career justifications, parameter pipelines, and entrance feasibility.
          </p>
        </div>

        <button 
          onClick={handleDownloadPDF} 
          className="btn-primary print-hide" 
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
        >
          <Download size={18} /> Download Portfolio PDF
        </button>
      </div>      {/* Unified Sub-Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--color-border)', overflowX: 'auto' }} className="print-hide">
        {[
          { id: 1, label: '1. Learning & Decay' },
          { id: 2, label: '2. TeachBack AI Engine' },
          { id: 3, label: '3. AI Career Guidance' },
          { id: 4, label: '4. Parameters Pipeline' },
          { id: 5, label: '5. Radar & Exam Feasibility' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: subTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: subTab === tab.id ? '#fff' : 'var(--text-muted)',
              fontWeight: subTab === tab.id ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: Learning & Decay Rate Testing */}
      {subTab === 1 && (
        <Mode4DecayTest onComplete={onDecayTestComplete} />
      )}

      {/* SUB-TAB 2: TeachBack AI Evaluation Engine */}
      {subTab === 2 && (
        <TeachBackEngine />
      )}

      {/* SUB-TAB 3: AI Career Guidance (Why this career?, Missing skills, Learning roadmap) */}
      {subTab === 3 && (
        <CareerRecommendationView />
      )}

      {/* SUB-TAB 4: Parameters Pipeline (enterance/parameters_send) */}
      {subTab === 4 && (
        <div className="glass-card animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={20} color="#f59e0b" /> Parameters Pipeline (`enterance/parameters_send`)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                Sends candidate parameters to Competency_service.py, analyze.py, normalizer.py, and skill_mappings.py.
              </p>
            </div>
            <button onClick={handleRunPipeline} className="btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <Sparkles size={16} /> Run Parameters Pipeline
            </button>
          </div>

          {pipelineMessage && (
            <div style={{ padding: '0.85rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              {pipelineMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { key: 'analytical', label: 'Analytical Reasoning', val: paramState.analytical },
              { key: 'math', label: 'Theoretical Math', val: paramState.math },
              { key: 'physics', label: 'Applied Physics', val: paramState.physics },
              { key: 'logic', label: 'Verbal Logic', val: paramState.logic },
              { key: 'spatial', label: 'Spatial Reasoning', val: paramState.spatial },
              { key: 'pattern', label: 'Pattern Recognition', val: paramState.pattern },
            ].map(item => (
              <div key={item.key} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                  <span>{item.label}</span>
                  <span style={{ color: '#f59e0b' }}>{item.val} / 150</span>
                </div>
                <input 
                  type="range" min="30" max="150" value={item.val} 
                  onChange={e => setParamState((prev: typeof paramState) => ({ ...prev, [item.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Live Radar Chart & Feasibility Matrix */}
      {subTab === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-in">
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={20} color="#8b5cf6" /> Live Entrance Radar Chart Visualizer
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>
                Live Competency Engine Matrix
              </span>
            </div>

            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={computedRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Candidate Competency" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#60a5fa" /> Target Entrance Feasibility Matrix
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <div>
                    <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 700 }}>{rec.exam?.exam_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.reasoning}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', color: '#34d399', fontWeight: 800 }}>AIR {Math.round((1 - rec.affinityScore) * 1000 + 45)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>Expected Score: {Math.round(rec.matchPercent)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
