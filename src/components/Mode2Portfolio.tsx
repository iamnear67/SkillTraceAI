import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { 
  CheckCircle2, TrendingUp, Award, Zap, Brain, FileText, 
  ChevronRight, Share2, Download, ShieldCheck, Map, Edit3, Plus, X, Trash2, Check, AlertCircle
} from 'lucide-react';
import { 
  getStoredPortfolioData, saveStoredPortfolioData, Certificate, PortfolioDataStructure 
} from '../data/portfolioData';
import { GeminiService, getPhaseCompletionDetailedFeedback, verifyGroqConnection, PhaseAdviceDetails } from '../utils/aiService';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export const Mode2Portfolio: React.FC = () => {
  const [data, setData] = useState<PortfolioDataStructure>(getStoredPortfolioData);
  const { profile, radarData, certificates, examTrends, timeline } = data;

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<PhaseAdviceDetails | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ active: boolean; message: string } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modals State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editRole, setEditRole] = useState(profile.role);
  const [editSummary, setEditSummary] = useState(profile.summary);
  const [editCompetency, setEditCompetency] = useState(profile.overallCompetency);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certSkills, setCertSkills] = useState('');
  const [certArea, setCertArea] = useState('');

  // Check Groq API Connection on Mount
  useEffect(() => {
    verifyGroqConnection().then(res => setApiStatus(res));
  }, []);

  // Fetch AI Insights whenever profile or certificates change
  const fetchInsights = async () => {
    setIsGenerating(true);
    try {
      const summaryText = `Candidate: ${profile.name}, Role: ${profile.role}. Extracted Skills: ${certificates.flatMap(c => c.extractedSkills).join(', ')}. Verification Score: ${profile.verificationScore}%.`;
      const res = await getPhaseCompletionDetailedFeedback('Candidate Portfolio Profile', summaryText);
      setAiAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [data.profile, data.certificates]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Share button click
  const handleShare = async () => {
    const textToCopy = `Check out ${profile.name}'s Verified Competency Portfolio! Profile Score: Top 5%, Verification: ${profile.verificationScore}%. ${window.location.href}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const input = document.createElement('input');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      showToast("Portfolio link & summary copied to clipboard!");
    } catch (e) {
      showToast("Copied shareable link!");
    }
  };

  // Handle Export PDF button click
  const handleExportPDF = () => {
    showToast("Opening Save as PDF print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Handle Download Portfolio Backup JSON
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${profile.name.replace(/\s+/g, '_')}_Portfolio.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("Portfolio backup JSON downloaded!");
  };

  // Save Profile Edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortfolioDataStructure = {
      ...data,
      profile: {
        ...data.profile,
        name: editName,
        role: editRole,
        summary: editSummary,
        overallCompetency: Number(editCompetency)
      }
    };
    setData(updated);
    saveStoredPortfolioData(updated);
    setIsEditProfileOpen(false);
    showToast("Profile information updated!");
  };

  // Open Cert Modal for Adding or Editing
  const openCertModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCertId(cert.id);
      setCertName(cert.name);
      setCertIssuer(cert.issuer);
      setCertDate(cert.date);
      setCertSkills(cert.extractedSkills.join(', '));
      setCertArea(cert.competencyArea);
    } else {
      setEditingCertId(null);
      setCertName('');
      setCertIssuer('');
      setCertDate('');
      setCertSkills('');
      setCertArea('');
    }
    setIsCertModalOpen(true);
  };

  // Save Certificate
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = certSkills.split(',').map(s => s.trim()).filter(Boolean);
    let updatedCerts = [...data.certificates];

    if (editingCertId) {
      updatedCerts = updatedCerts.map(c => c.id === editingCertId ? {
        ...c,
        name: certName,
        issuer: certIssuer,
        date: certDate,
        extractedSkills: parsedSkills.length ? parsedSkills : ['General Competency'],
        competencyArea: certArea || 'Core Skills'
      } : c);
    } else {
      const newCert: Certificate = {
        id: `CERT_${Date.now()}`,
        name: certName || 'New Certificate',
        issuer: certIssuer || 'Educational Provider',
        date: certDate || 'Recent',
        verificationScore: 98,
        extractedSkills: parsedSkills.length ? parsedSkills : ['Verified Skill'],
        competencyArea: certArea || 'Core Competency'
      };
      updatedCerts.push(newCert);
    }

    const updatedData = { ...data, certificates: updatedCerts };
    setData(updatedData);
    saveStoredPortfolioData(updatedData);
    setIsCertModalOpen(false);
    showToast(editingCertId ? "Certificate updated!" : "New certificate added!");
  };

  // Delete Certificate
  const handleDeleteCert = (id: string) => {
    const updatedCerts = data.certificates.filter(c => c.id !== id);
    const updatedData = { ...data, certificates: updatedCerts };
    setData(updatedData);
    saveStoredPortfolioData(updatedData);
    showToast("Certificate removed.");
  };

  return (
    <motion.div 
      className="portfolio-container printable-area" 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
          background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
          padding: '0.85rem 1.5rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* 1. HERO PROFILE */}
      <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '3px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0a0e1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                {profile.name.split(' ').map(n => n[0]).join('') || 'AS'}
               </span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', borderRadius: '50%', padding: '0.4rem', border: '2px solid #0a0e1f' }}>
            <ShieldCheck size={16} color="#000" />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.25rem 0' }}>{profile.name}</h1>
                <button 
                  onClick={() => {
                    setEditName(profile.name);
                    setEditRole(profile.role);
                    setEditSummary(profile.summary);
                    setEditCompetency(profile.overallCompetency);
                    setIsEditProfileOpen(true);
                  }}
                  className="btn-secondary print-hide"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              </div>
              <h2 style={{ fontSize: '1rem', color: '#60a5fa', margin: '0 0 1rem 0', fontWeight: 600 }}>{profile.role}</h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }} className="print-hide">
              <button onClick={handleShare} className="btn-secondary" style={{ padding: '0.5rem 0.85rem' }} title="Copy Portfolio Link">
                <Share2 size={16} /> Share
              </button>
              <button onClick={handleDownloadBackup} className="btn-secondary" style={{ padding: '0.5rem 0.85rem' }} title="Download JSON Backup Data">
                <Download size={16} /> JSON Data
              </button>
              <button onClick={handleExportPDF} className="btn-primary" style={{ padding: '0.5rem 1rem' }} title="Print / Save as PDF">
                <Download size={16} /> Export PDF
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 0 1.5rem 0' }}>
            {profile.summary}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                {profile.overallCompetency}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Overall Competency</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Top 5%</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle2 size={28} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Evidence Verification</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{profile.verificationScore}% Verified</div>
              </div>
            </div>

            {/* Groq API Status Badge */}
            {apiStatus && (
              <div 
                title={apiStatus.message}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: apiStatus.active ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '8px', border: `1px solid ${apiStatus.active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}
              >
                {apiStatus.active ? <CheckCircle2 size={16} color="#10b981" /> : <AlertCircle size={16} color="#ef4444" />}
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AI Connection</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: apiStatus.active ? '#34d399' : '#f87171' }}>
                    {apiStatus.active ? 'Groq API Live' : 'API Offline'}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {apiStatus.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2 & 5. COMPETENCY RADAR & EXAM ANALYTICS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* 2. COMPETENCY RADAR */}
        <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Brain size={18} color="#8b5cf6" /> Core Competency Radar
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name={profile.name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 5. EXAM & TEST ANALYTICS */}
        <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} color="#34d399" /> Performance Velocity
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examTrends} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ background: '#0a0e1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="Math" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Physics" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Logic" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 3 & 8. SKILL MAP / EVIDENCE CONNECTIONS */}
      <motion.div variants={itemVariants} className="glass-card" style={{ overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Map size={18} color="#f59e0b" /> Evidence-to-Competency Mapping
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center', width: '22%' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Raw Evidence
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Certificates & Mock Tests</div>
          </div>
          <ChevronRight color="var(--text-muted)" />
          <div style={{ textAlign: 'center', width: '22%' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Extracted Skills
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OCR & AI Validation</div>
          </div>
          <ChevronRight color="var(--text-muted)" />
          <div style={{ textAlign: 'center', width: '22%' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Competencies
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Radar Metrics</div>
          </div>
          <ChevronRight color="var(--text-muted)" />
          <div style={{ textAlign: 'center', width: '22%' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Profile Score
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Top 5% Placement</div>
          </div>
        </div>
      </motion.div>

      {/* 4. CERTIFICATE EVIDENCE VAULT */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FileText size={20} color="#3b82f6" /> Certificate Evidence Vault
          </h3>
          <button 
            onClick={() => openCertModal()} 
            className="btn-primary print-hide" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Certificate
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {certificates.map(cert => (
            <div key={cert.id} className="glass-card" style={{ padding: '1.25rem', transition: 'transform 0.2s', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} color="#60a5fa" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ padding: '0.2rem 0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>
                    <ShieldCheck size={12} /> {cert.verificationScore}% OCR Verified
                  </div>
                  
                  <div className="print-hide" style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      onClick={() => openCertModal(cert)} 
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', padding: '0.25rem', color: '#aaa', cursor: 'pointer' }}
                      title="Edit Certificate"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCert(cert.id)} 
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '4px', padding: '0.25rem', color: '#f87171', cursor: 'pointer' }}
                      title="Delete Certificate"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>{cert.name}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Issued by <strong>{cert.issuer}</strong> • {cert.date}</div>
              
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Extracted Skills:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {cert.extractedSkills.map((s, idx) => (
                  <span key={idx} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6 & 7. TIMELINE & DETAILED AI INSIGHTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
        <motion.div variants={itemVariants} className="glass-card">
          <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} color="#a78bfa" /> Competency Journey
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((event, i) => (
              <div key={event.id} style={{ display: 'flex', gap: '1rem', position: 'relative', paddingBottom: i !== timeline.length - 1 ? '1.5rem' : '0' }}>
                {i !== timeline.length - 1 && (
                  <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: 0, width: '2px', background: 'rgba(255,255,255,0.1)' }} />
                )}
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid #0a0e1f', zIndex: 1 }}>
                  <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />
                </div>
                <div style={{ flex: 1, marginTop: '-2px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700, marginBottom: '0.1rem' }}>{event.year}</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700, marginBottom: '0.2rem' }}>{event.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DETAILED STRONG VS WEAK SECTION AI ANALYSIS */}
        <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(30,58,138,0.2) 0%, rgba(10,14,31,0) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Zap size={18} color="#f59e0b" /> Groq AI Profile Analysis
            </h3>
            <button 
              onClick={fetchInsights} 
              disabled={isGenerating}
              className="btn-secondary print-hide" 
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
            >
              Refresh
            </button>
          </div>
          
          {aiAnalysis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #3b82f6', fontSize: '0.85rem', color: '#ddd', lineHeight: 1.5 }}>
                {aiAnalysis.adviceParagraph}
              </div>

              {/* Strong Sections */}
              <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.05)', borderLeft: '3px solid #10b981', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: '0.7rem', color: '#34d399', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                  💪 Strong Sections (High Proficiency)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {aiAnalysis.strongSections.map((sec, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>
                      ✓ {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak Sections */}
              <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.05)', borderLeft: '3px solid #ef4444', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: '0.7rem', color: '#f87171', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                  ⚠️ Weak Sections (Requires Practice)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {aiAnalysis.weakSections.map((sec, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>
                      ! {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
              <div className="spin"><Zap size={20} color="#f59e0b" /></div>
              Sending portfolio data to Groq API...
            </div>
          )}
        </motion.div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <form onSubmit={handleSaveProfile} className="glass-card animate-slide-in" style={{ width: '100%', maxWidth: '550px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
            <button type="button" onClick={() => setIsEditProfileOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={18} color="#3b82f6" /> Edit Candidate Profile
            </h3>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Candidate Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Professional Title / Role</label>
              <input type="text" value={editRole} onChange={e => setEditRole(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Professional Summary</label>
              <textarea value={editSummary} onChange={e => setEditSummary(e.target.value)} rows={4} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Overall Competency Score (0-100)</label>
              <input type="number" min="0" max="100" value={editCompetency} onChange={e => setEditCompetency(Number(e.target.value))} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditProfileOpen(false)} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD/EDIT CERTIFICATE MODAL */}
      {isCertModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <form onSubmit={handleSaveCert} className="glass-card animate-slide-in" style={{ width: '100%', maxWidth: '550px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
            <button type="button" onClick={() => setIsCertModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#3b82f6" /> {editingCertId ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Certificate Title</label>
              <input type="text" placeholder="e.g. Advanced Physics Principles" value={certName} onChange={e => setCertName(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Issuing Organization</label>
                <input type="text" placeholder="e.g. MIT OpenCourseWare" value={certIssuer} onChange={e => setCertIssuer(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Date Issued</label>
                <input type="text" placeholder="e.g. Oct 2023" value={certDate} onChange={e => setCertDate(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Extracted Skills (comma-separated)</label>
              <input type="text" placeholder="Kinematics, Thermodynamics, Vector Calculus" value={certSkills} onChange={e => setCertSkills(e.target.value)} required style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Competency Area</label>
              <input type="text" placeholder="e.g. Applied Physics" value={certArea} onChange={e => setCertArea(e.target.value)} style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '6px', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsCertModalOpen(false)} className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>{editingCertId ? 'Update' : 'Add Credential'}</button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};
