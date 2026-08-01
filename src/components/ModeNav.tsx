import React from 'react';
import { Brain, BookOpen, Trophy, FlaskConical, Briefcase, GraduationCap, Lock } from 'lucide-react';

interface ModeNavProps {
  activeMode: number;
  unlockedModes: Set<number>;
  completedModes: Set<number>;
  onSelectMode: (mode: number) => void;
}

const MODE_CONFIG = [
  { id: 1, modeNum: 1, title: 'AIR & Tasklist', subtitle: 'Dashboard & Predictions', icon: Trophy, color: '#10b981' },
  { id: 3, modeNum: 2, title: 'Psychometric Test', subtitle: 'Aptitude Vector Analysis', icon: Brain, color: '#8b5cf6' },
  { id: 4, modeNum: 3, title: 'Prior Knowledge', subtitle: '15-Class Diagnostic', icon: BookOpen, color: '#3b82f6' },
  { id: 5, modeNum: 4, title: 'Entrance', subtitle: 'Feasibility & Pipelines', icon: FlaskConical, color: '#f59e0b' },
  { id: 6, modeNum: 5, title: 'Scholarships', subtitle: 'Financial Aid & Grants', icon: GraduationCap, color: '#ec4899' }
];

export const ModeNav: React.FC<ModeNavProps> = ({ activeMode, unlockedModes, completedModes, onSelectMode }) => {
  return (
    <div className="mode-nav-container">
      {MODE_CONFIG.map(mode => {
        const isActive = activeMode === mode.id;
        const isUnlocked = unlockedModes.has(mode.id);
        const isCompleted = completedModes.has(mode.id);
        const Icon = mode.icon;

        return (
          <button
            key={mode.id}
            className={`mode-nav-card ${isActive ? 'mode-active' : ''} ${isCompleted ? 'mode-completed' : ''} ${!isUnlocked ? 'mode-locked' : ''}`}
            onClick={() => isUnlocked && onSelectMode(mode.id)}
            disabled={!isUnlocked}
            style={{
              '--mode-color': mode.color,
              cursor: isUnlocked ? 'pointer' : 'not-allowed',
              opacity: isUnlocked ? 1 : 0.4
            } as React.CSSProperties}
          >
            <div className="mode-nav-icon-wrap" style={{ background: `${mode.color}15`, border: `1px solid ${mode.color}30` }}>
              {isUnlocked ? (
                <Icon size={18} color={mode.color} />
              ) : (
                <Lock size={16} color="var(--text-muted)" />
              )}
            </div>
            <div className="mode-nav-text">
              <span className="mode-nav-number">Mode {mode.modeNum}</span>
              <span className="mode-nav-title">{mode.title}</span>
              <span className="mode-nav-subtitle">{mode.subtitle}</span>
            </div>
            {isCompleted && (
              <div className="mode-nav-check" style={{ background: mode.color }}>✓</div>
            )}
            {isActive && (
              <div className="mode-nav-active-indicator" style={{ background: mode.color }} />
            )}
          </button>
        );
      })}
    </div>
  );
};
