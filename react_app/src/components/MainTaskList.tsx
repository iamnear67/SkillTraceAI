import React, { useState } from 'react';
import { TaskItem, MockTestUpload } from '../utils/tasklistEngine';
import { generateQuizQuestions, getTaskInsights, QuizQuestion } from '../utils/aiService';
import { CheckSquare, Square, Upload, ExternalLink, CheckCircle2, Lock, Bot, Send, Brain, Trophy, Loader2 } from 'lucide-react';

interface MainTaskListProps {
  tasks: TaskItem[];
  mockUploads: MockTestUpload[];
  onToggleTask: (taskId: string) => void;
  onAddMockUpload: (upload: MockTestUpload) => void;
}

export const MainTaskList: React.FC<MainTaskListProps> = ({
  tasks,
  mockUploads,
  onToggleTask,
  onAddMockUpload
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form state
  const [mockExamName, setMockExamName] = useState('JEE Main');
  const [mockTestName, setMockTestName] = useState('');
  const [mockScore, setMockScore] = useState('');
  const [mockTotal, setMockTotal] = useState('300');

  // Task Details & Chat State
  const [activeTaskDetails, setActiveTaskDetails] = useState<TaskItem | null>(null);
  const [taskChatMsg, setTaskChatMsg] = useState('');
  const [taskChatHistory, setTaskChatHistory] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Task Quiz State
  const [activeQuizTask, setActiveQuizTask] = useState<TaskItem | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTestName || !mockScore) return;

    const newUpload: MockTestUpload = {
      id: `MOCK_${Date.now()}`,
      examName: mockExamName,
      testName: mockTestName,
      scoreObtained: parseFloat(mockScore),
      totalMarks: parseFloat(mockTotal) || 300,
      dateUploaded: new Date().toLocaleDateString()
    };

    onAddMockUpload(newUpload);
    setShowUploadModal(false);
    setMockTestName('');
    setMockScore('');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  // Task Details Handlers
  const handleOpenTaskDetails = (task: TaskItem) => {
    setActiveTaskDetails(task);
    setTaskChatHistory([
      { sender: 'ai', text: `Hi! I am analyzing your task: "${task.title}". Ask me anything about this subtopic or how to prepare for it.` }
    ]);
  };

  const handleSendTaskChat = async () => {
    if (!taskChatMsg.trim() || !activeTaskDetails) return;
    
    const query = taskChatMsg;
    const updatedHistory: { sender: 'user' | 'ai', text: string }[] = [...taskChatHistory, { sender: 'user', text: query }];
    
    setTaskChatHistory(updatedHistory);
    setTaskChatMsg('');
    setIsChatLoading(true);

    const aiResponse = await getTaskInsights(
      activeTaskDetails.examName,
      activeTaskDetails.subtopicName,
      taskChatHistory,
      query
    );

    setTaskChatHistory([...updatedHistory, { sender: 'ai', text: aiResponse }]);
    setIsChatLoading(false);
  };

  // Task Quiz Handlers
  const handleOpenQuiz = async (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation(); // prevent opening details
    if (task.completed) return; // already done

    setActiveQuizTask(task);
    setIsQuizLoading(true);
    setQuizQuestions([]);
    setQuizScore(null);

    // Fetch live questions from Groq API
    const qs = await generateQuizQuestions(task.examName, task.subtopicName);
    
    setQuizQuestions(qs);
    setCurrentQuizQ(0);
    setQuizAnswers([]);
    setIsQuizLoading(false);
  };

  const handleAnswerQuiz = (optIdx: number) => {
    const newAnswers = [...quizAnswers, optIdx];
    setQuizAnswers(newAnswers);

    if (currentQuizQ < 9) {
      setCurrentQuizQ(currentQuizQ + 1);
    } else {
      // Calculate final score
      let correct = 0;
      newAnswers.forEach((ans, i) => {
        if (ans === quizQuestions[i].ans) correct++;
      });
      setQuizScore(correct);

      if (correct >= 8) {
        onToggleTask(activeQuizTask!.id);
      }
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '450px', padding: '0', overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.08)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Main AI Task List</span>
            <span style={{ fontSize: '0.65rem', color: '#34d399' }}>{completedCount} / {tasks.length} Tasks Completed</span>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}
        >
          <Upload size={12} />
          <span>Upload Test/Mock</span>
        </button>
      </div>

      {/* Task List */}
      <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No tasks generated yet. Ask AI Assistant on the left or complete Phase 4 Prior Knowledge Test!
          </div>
        ) : (
          tasks.map(task => {
            const isDone = task.completed;
            const categoryBadgeColor = task.category === 'DEEP_MASTERY' ? '#ef4444' : task.category === 'PARETO_80_20' ? '#f59e0b' : '#3b82f6';

            return (
              <div
                key={task.id}
                onClick={() => handleOpenTaskDetails(task)}
                style={{
                  padding: '0.75rem 0.9rem', borderRadius: '8px',
                  background: isDone ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-bg-panel)',
                  border: isDone ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid var(--color-border)',
                  opacity: isDone ? 0.45 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  cursor: 'pointer'
                }}
              >
                {/* Checkbox triggers quiz if incomplete */}
                <button
                  onClick={(e) => handleOpenQuiz(e, task)}
                  disabled={isDone}
                  style={{
                    background: 'transparent', border: 'none', padding: 0, marginTop: '2px',
                    cursor: isDone ? 'not-allowed' : 'pointer', color: isDone ? '#10b981' : '#60a5fa'
                  }}
                  title={isDone ? 'Completed (Locked)' : 'Take 10-Q validation quiz to complete'}
                >
                  {isDone ? <CheckCircle2 size={18} color="#10b981" /> : <Square size={18} />}
                </button>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 700,
                      color: isDone ? 'var(--text-muted)' : '#fff',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: `${categoryBadgeColor}15`, color: categoryBadgeColor, border: `1px solid ${categoryBadgeColor}30`, fontWeight: 700 }}>
                      +{task.scoreBoostPercent}%
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, textDecoration: isDone ? 'line-through' : 'none' }}>
                    {task.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <span>Est: {task.estimatedHours} hrs</span>
                      <span>Exam: {task.examName}</span>
                    </div>

                    <a
                      href={task.practiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        fontSize: '0.68rem', color: '#60a5fa', fontWeight: 700, textDecoration: 'none',
                        background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)',
                        padding: '0.15rem 0.45rem', borderRadius: '4px'
                      }}
                    >
                      <span>Practice Topic</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Details Modal */}
      {activeTaskDetails && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--color-bg-surface)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Task Insights</span>
            </div>
            <button onClick={() => setActiveTaskDetails(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>{activeTaskDetails.title}</h4>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span><strong>Lacking In:</strong> Concept Application</span>
              <span><strong>Est. Time:</strong> {activeTaskDetails.estimatedHours} hrs</span>
              <span><strong>Boost:</strong> +{activeTaskDetails.scoreBoostPercent}%</span>
            </div>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {taskChatHistory.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', lineHeight: 1.4,
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'rgba(255,255,255,0.05)',
                  color: '#fff', border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '0.65rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ask AI what to do for this task..."
              value={taskChatMsg}
              onChange={(e) => setTaskChatMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTaskChat()}
              disabled={isChatLoading}
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.5rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
            />
            <button onClick={handleSendTaskChat} disabled={isChatLoading} className="btn-primary" style={{ padding: '0.5rem 0.85rem' }}>
              {isChatLoading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* Task Quiz Modal (Full Screen Overlay) */}
      {activeQuizTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {isQuizLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                <Loader2 size={40} color="#3b82f6" className="spin" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>AI is Scouring the Web...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Generating live PYQ (Past Year Questions) for <strong>{activeQuizTask.subtopicName}</strong>...
                </p>
              </div>
            ) : quizScore === null && quizQuestions.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <CheckSquare size={18} color="#10b981" /> Task Validation Quiz
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                    Question {currentQuizQ + 1} of 10
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
                  {quizQuestions[currentQuizQ].q}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {quizQuestions[currentQuizQ].opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerQuiz(i)}
                      style={{
                        padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)',
                        borderRadius: '8px', color: '#ddd', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    >
                      {String.fromCharCode(65 + i)}) {opt}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  You must score 80%+ (8/10) to mark this task complete.
                </div>
              </>
            ) : quizScore !== null ? (
              <>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Trophy size={48} color={quizScore >= 8 ? '#10b981' : '#f59e0b'} />
                  <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Quiz Completed</h2>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: quizScore >= 8 ? '#10b981' : '#f59e0b' }}>
                    {quizScore} / 10
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {quizScore >= 8
                      ? 'Outstanding! You scored 80%+ and have demonstrated mastery. This task is now marked as complete.'
                      : 'You scored below 80%. Review the concepts, practice more questions using the practice link, and attempt again later to complete this task.'}
                  </p>
                  <button
                    onClick={() => setActiveQuizTask(null)}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.5rem' }}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Upload Modal (Existing) */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Same as before... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} color="#3b82f6" /> Upload Test / Mock Result
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Target Exam</label>
                <input type="text" value={mockExamName} onChange={e => setMockExamName(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#0a0e1f', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Test Name</label>
                <input type="text" value={mockTestName} onChange={e => setMockTestName(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#0a0e1f', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Score Obtained</label>
                  <input type="number" value={mockScore} onChange={e => setMockScore(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#0a0e1f', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Total Marks</label>
                  <input type="number" value={mockTotal} onChange={e => setMockTotal(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#0a0e1f', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
