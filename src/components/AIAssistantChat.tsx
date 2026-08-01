import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Lightbulb, Loader2 } from 'lucide-react';
import { TaskItem } from '../utils/tasklistEngine';
import { getStrategyAdvice } from '../utils/aiService';

interface AIAssistantChatProps {
  tasks: TaskItem[];
  onUpdateTasks: (updatedTasks: TaskItem[]) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ tasks, onUpdateTasks }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: 'This is a prototype AI Assistant, built to add items and shift priorities in the tasklist only.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Prioritize Mathematics & Physics for JEE',
    'Focus on High-Yield 80/20 topics only',
    'Prioritize Legal Aptitude for CLAT'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Call Groq API
    const advice = await getStrategyAdvice(query);
    
    // Process Keywords to filter/re-order tasks
    let updatedTasks = [...tasks];
    const kws = advice.keywords;
    
    if (kws.includes('pareto') || kws.includes('80/20') || kws.includes('high-yield') || query.toLowerCase().includes('80/20')) {
        const matched = updatedTasks.filter(t => t.category === 'PARETO_80_20');
        const rest = updatedTasks.filter(t => t.category !== 'PARETO_80_20');
        updatedTasks = [...matched, ...rest];
    } else if (kws.length > 0) {
        // Boost tasks that match any keyword
        const matched = updatedTasks.filter(t => 
          kws.some(k => t.subtopicName.toLowerCase().includes(k) || t.examName.toLowerCase().includes(k))
        );
        const rest = updatedTasks.filter(t => !matched.includes(t));
        updatedTasks = [...matched, ...rest];
        
        // If absolutely no match, add a custom AI task
        if (matched.length === 0) {
          const customTask: TaskItem = {
            id: `TASK_AI_${Date.now()}`,
            examName: 'Target Focus',
            subtopicName: kws.join(', '),
            category: 'DEEP_MASTERY',
            title: `[AI Custom] ${query.slice(0, 30)}...`,
            description: `Personalized AI task based on your directive: "${query}".`,
            estimatedHours: 3.5,
            scoreBoostPercent: 4.0,
            completed: false,
            practiceUrl: `https://www.google.com/search?q=${encodeURIComponent(query + ' practice questions PYQ')}`
          };
          updatedTasks = [customTask, ...updatedTasks];
        }
    }

    onUpdateTasks(updatedTasks);

    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: advice.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '450px', padding: '0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(59, 130, 246, 0.08)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={16} color="#3b82f6" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>AI Strategy Assistant</span>
          <span style={{ fontSize: '0.65rem', color: '#60a5fa' }}>Customizes Main Task List in real-time</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex', gap: '0.5rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Sparkles size={12} color="#3b82f6" />
              </div>
            )}

            <div style={{
              padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', lineHeight: 1.4,
              background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'var(--color-bg-panel)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)',
              color: '#fff'
            }}>
              {msg.text}
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right', marginTop: '0.2rem' }}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <User size={12} color="#a78bfa" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            style={{
              fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)',
              color: 'var(--text-muted)', whiteSpace: 'nowrap', cursor: 'pointer'
            }}
          >
            <Lightbulb size={9} style={{ verticalAlign: 'middle', marginRight: '0.2rem' }} />{p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div style={{ padding: '0.65rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Tell AI your goals, exams, or focus areas..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          style={{
            flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)',
            borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.8rem', outline: 'none'
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading}
          className="btn-primary"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
        >
          {isLoading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
};
