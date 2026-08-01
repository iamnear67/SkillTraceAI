import React, { useState, useEffect } from 'react';
import { ModeNav } from './components/ModeNav';
import { Mode1Psychometric } from './components/Mode1Psychometric';
import { Mode2PriorTest } from './components/Mode2PriorTest';
import { Mode3Dashboard } from './components/Mode3Dashboard';
import { Mode6Scholarships } from './components/Mode6Scholarships';
import { Mode2Portfolio } from './components/Mode2Portfolio';
import { Mode5EntranceModule } from './components/Mode5EntranceModule';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

import { PsychometricResult, ExamRecommendation } from './utils/psychometricEngine';
import { ClassAbility, ExamSubtopicPredictions } from './utils/priorTestEngine';
import { saveDecayRates } from './utils/tasklistEngine';
import { getPhaseCompletionAdvice, getPhaseCompletionDetailedFeedback } from './utils/aiService';
import { 
  subscribeToAuthChanges, logoutUser, getStoredUserSession, UserProfileState 
} from './utils/firebase';
import { allExams } from './data/allExams';
import { Brain, RefreshCw, Zap, Key, X, Loader2, Sparkles, User, LogOut, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  // Tab Navigation state (persisted in localStorage)
  const [activeMode, setActiveMode] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('antigravity_active_tab');
      return saved ? parseInt(saved) : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_active_tab', String(activeMode));
    } catch {}
  }, [activeMode]);

  // Unlocked & Completed tabs
  const [unlockedModes, setUnlockedModes] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [completedModes, setCompletedModes] = useState<Set<number>>(new Set());

  // Cheat code state
  const [cheatCodeInput, setCheatCodeInput] = useState<string>('');
  const isCheatActive = cheatCodeInput.trim().toUpperCase() === 'Y67';

  // Auth & Admin State
  const [currentUser, setCurrentUser] = useState<UserProfileState | null>(() => getStoredUserSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const [siteTextConfig, setSiteTextConfig] = useState<{ siteName: string; announcement: string; headerTagline: string }>(() => {
    try {
      const saved = localStorage.getItem('antigravity_site_text_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      siteName: 'SKILLTRACE',
      announcement: 'SkillTrace Engine v2.5 Live',
      headerTagline: 'AI Entrance & Feasibility Platform'
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateSiteText = (newConfig: { siteName: string; announcement: string; headerTagline: string }) => {
    setSiteTextConfig(newConfig);
    try {
      localStorage.setItem('antigravity_site_text_config', JSON.stringify(newConfig));
    } catch (e) {}
  };

  // State outputs
  const [psychometricResult, setPsychometricResult] = useState<PsychometricResult | null>(null);
  
  // Default recommendations (top 10 initial from dataset)
  const [recommendations, setRecommendations] = useState<ExamRecommendation[]>(() => {
    return allExams.slice(0, 10).map(exam => ({
      exam,
      affinityScore: 0.85,
      matchPercent: 85.0,
      reasoning: `Recommended target exam. Category: ${exam.category}.`
    }));
  });

  const [classAbilities, setClassAbilities] = useState<ClassAbility[]>([]);
  const [examPredictions, setExamPredictions] = useState<ExamSubtopicPredictions[]>([]);
  const [hasCompletedPriorTest, setHasCompletedPriorTest] = useState<boolean>(false);

  // AI Advice Modal State
  const [phaseAdvice, setPhaseAdvice] = useState<{
    title: string;
    advice: string;
    strongSections: string[];
    weakSections: string[];
    isLoading: boolean;
  } | null>(null);

  const triggerPhaseAdvice = async (phaseName: string, summary: string) => {
    setPhaseAdvice({
      title: `${phaseName} Complete`,
      advice: 'Sending phase metrics to Groq API...',
      strongSections: [],
      weakSections: [],
      isLoading: true
    });
    const details = await getPhaseCompletionDetailedFeedback(phaseName, summary);
    setPhaseAdvice({
      title: `${phaseName} Complete`,
      advice: details.adviceParagraph,
      strongSections: details.strongSections,
      weakSections: details.weakSections,
      isLoading: false
    });
  };

  // --- Handlers ---

  const handlePsychometricComplete = (result: PsychometricResult, recs: ExamRecommendation[]) => {
    setPsychometricResult(result);
    setRecommendations(recs);
    setCompletedModes(prev => new Set([...prev, 3]));
    triggerPhaseAdvice("Phase 1: Psychometric Test", `User showed affinity for ${recs[0]?.exam?.category || 'various fields'}. Top recommendation: ${recs[0]?.exam?.exam_name || 'General'}.`);
  };

  const handlePriorTestComplete = (
    abilities: ClassAbility[],
    predictions: ExamSubtopicPredictions[],
    answers: { id: string; correct: boolean; timeSec: number }[]
  ) => {
    setClassAbilities(abilities);
    setExamPredictions(predictions);
    setHasCompletedPriorTest(true);
    setCompletedModes(prev => new Set([...prev, 4]));
    setActiveMode(1);
    
    const strong = abilities.filter(a => a.ability > 0.7).map(a => a.class_name).join(', ');
    const weak = abilities.filter(a => a.ability <= 0.5).map(a => a.class_name).join(', ');
    triggerPhaseAdvice("Phase 4: Prior Knowledge Diagnostic", `User baseline performance -> Strong abilities: ${strong || 'None'}. Weak abilities: ${weak || 'None'}. Tasklist generated.`);
  };

  const handleDecayTestComplete = (alpha: number, lambda: number) => {
    saveDecayRates(alpha, lambda);
    setCompletedModes(prev => new Set([...prev, 5]));
    setActiveMode(1);
    triggerPhaseAdvice("Phase 5: Learning & Decay Test", `Alpha (Learning Speed): ${alpha.toFixed(2)}, Lambda (Decay Rate): ${lambda.toFixed(2)}. Tasklist has been adjusted for these rates.`);
  };

  const handleReset = () => {
    setActiveMode(1);
    setCompletedModes(new Set());
    setPsychometricResult(null);
    setClassAbilities([]);
    setExamPredictions([]);
    setHasCompletedPriorTest(false);
    saveDecayRates(0, 0);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  return (
    <div>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => setCurrentUser(user)} 
      />

      {/* Admin Control Drawer Modal */}
      <AdminDashboardModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onUpdateSiteText={handleUpdateSiteText}
        currentConfig={siteTextConfig}
      />

      {/* AI Advice Modal */}
      {phaseAdvice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card animate-slide-in" style={{ width: '100%', maxWidth: '650px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            <button 
              onClick={() => setPhaseAdvice(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} color="#a78bfa" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{phaseAdvice.title}</h2>
                <span style={{ fontSize: '0.7rem', color: '#34d399' }}>AI Analysis via Groq API (llama3-70b)</span>
              </div>
            </div>

            {phaseAdvice.isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', padding: '2rem 0' }}>
                <Loader2 size={24} color="#8b5cf6" className="spin" />
                {phaseAdvice.advice}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    {phaseAdvice.advice}
                  </p>
                </div>

                {/* Strong & Weak Breakdown Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '0.85rem', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      💪 Strong Sections
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {phaseAdvice.strongSections.map((sec, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>
                          ✓ {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      ⚠️ Weak Sections
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {phaseAdvice.weakSections.map((sec, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>
                          ! {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!phaseAdvice.isLoading && (
              <button onClick={() => setPhaseAdvice(null)} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                Continue to Dashboard
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Background Gradients */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
        zIndex: -1, pointerEvents: 'none'
      }} />

      {/* Navbar */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(5, 8, 19, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 40,
        padding: '0.75rem 0'
      }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem' }}>
          
          {/* Top Left: Logo & Site Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {siteTextConfig.siteName}
              </span>
            </a>

            <a href="/" style={{ fontSize: '0.75rem', color: '#00f2fe', textDecoration: 'none', background: 'rgba(0,242,254,0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(0,242,254,0.3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ← Main Website Home
            </a>

            {/* Cheat Code Input Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
              <Key size={12} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Code (e.g. Y67)"
                value={cheatCodeInput}
                onChange={(e) => setCheatCodeInput(e.target.value)}
                style={{
                  width: '90px', background: 'transparent', border: 'none', outline: 'none',
                  color: isCheatActive ? '#f59e0b' : '#fff', fontSize: '0.75rem', fontWeight: isCheatActive ? 800 : 400
                }}
              />
              {isCheatActive && (
                <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', padding: '0.1rem 0.35rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Zap size={10} /> 1 Q/topic
                </span>
              )}
            </div>
          </div>

          {/* Top Right: User Profile, Auth, Admin Controls & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{currentUser.displayName}</span>
                </div>

                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminModalOpen(true)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <ShieldCheck size={13} /> Admin Panel
                  </button>
                )}

                <button 
                  onClick={handleLogout} 
                  title="Sign Out" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.6rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="btn-primary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
              >
                <User size={14} /> Sign In / Register
              </button>
            )}

            <a 
              href="/" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.4)', color: '#00f2fe', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800 }}
            >
              ← Home
            </a>

            {completedModes.size > 0 && (
              <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--color-border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s ease' }}>
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mode Navigation Bar */}
      <div className="app-container" style={{ padding: '1rem 1.5rem 0' }}>
        <ModeNav
          activeMode={activeMode}
          unlockedModes={unlockedModes}
          completedModes={completedModes}
          onSelectMode={setActiveMode}
        />
      </div>

      {/* Main Content */}
      <main className="app-container" style={{ padding: '0 1.5rem', minHeight: 'calc(100vh - 200px)' }}>
        
        {/* Tab 1: Dashboard (AIR, Expected Marks, Tasklist) */}
        {activeMode === 1 && (
          <Mode3Dashboard
            recommendations={recommendations}
            classAbilities={classAbilities}
            examPredictions={examPredictions}
            hasPriorTestData={hasCompletedPriorTest}
          />
        )}

        {/* Tab 2: Premium AI Portfolio */}
        {activeMode === 2 && <Mode2Portfolio />}

        {/* Tab 3: Psychometric Test */}
        {activeMode === 3 && (
          <Mode1Psychometric
            savedResult={psychometricResult}
            savedRecommendations={recommendations}
            onComplete={handlePsychometricComplete}
            onProceedToPriorTest={() => setActiveMode(4)}
          />
        )}

        {/* Tab 4: Prior Knowledge Diagnostic Test */}
        {activeMode === 4 && (
          <Mode2PriorTest
            recommendations={recommendations}
            cheatMode={isCheatActive}
            savedAbilities={classAbilities}
            savedPredictions={examPredictions}
            onComplete={handlePriorTestComplete}
          />
        )}

        {/* Tab 5: Unified Entrance Module (5 Sub-Pages & Parameters Pipeline) */}
        {activeMode === 5 && (
          <Mode5EntranceModule 
            recommendations={recommendations}
            onDecayTestComplete={handleDecayTestComplete}
          />
        )}

        {/* Tab 6: Scholarships Browser */}
        {activeMode === 6 && <Mode6Scholarships />}

      </main>
    </div>
  );
}
