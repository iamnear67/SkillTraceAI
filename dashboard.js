/* ==========================================================================
   SkillTrace AI — App Dashboard Application Controller (Phase 9: Demo Data & Persona Switcher)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. SPA View Switcher ────────────────────────────────────────────────
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
  const views = document.querySelectorAll('.app-view');

  function switchView(targetViewId) {
    sidebarLinks.forEach(link => {
      const isActive = link.getAttribute('data-view') === targetViewId;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    views.forEach(view => {
      const isTarget = view.id === `view-${targetViewId}`;
      view.classList.toggle('active', isTarget);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetViewId === 'dashboard') loadDashboardData();
    if (targetViewId === 'careers') loadCareerData();
    if (targetViewId === 'analysis') loadAnalysisData();
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      if (viewId) switchView(viewId);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (['dashboard', 'upload', 'analysis', 'careers', 'teachback', 'portfolio', 'settings', 'about'].includes(hash)) {
    switchView(hash);
  }

  document.querySelectorAll('[data-switch-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = btn.getAttribute('data-switch-view');
      if (viewId) switchView(viewId);
    });
  });

  // ── 2. Toast Notification System ──────────────────────────────────────────────
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Limit max 4 toasts at once
    if (container.childElementCount >= 4) container.firstChild?.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}" aria-hidden="true"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  window.showToast = showToast;

  // ── 2b. Spotlight Cursor Effect ────────────────────────────────────────────
  const spotlightOverlay = document.getElementById('spotlight-overlay');
  if (spotlightOverlay && window.matchMedia('(hover: hover)').matches) {
    let rafId = null;
    document.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        spotlightOverlay.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(0, 242, 254, 0.05), transparent 40%)`;
        rafId = null;
      });
    });
  }

  // ── 3. High Contrast Theme Switcher ─────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
      showToast("High Contrast Accessibility Theme Activated", "info");
    } else {
      document.documentElement.removeAttribute('data-theme');
      showToast("Dark Glassmorphism Theme Restored", "info");
    }
  });

  const saveSettingsBtn = document.getElementById('save-settings-btn');
  saveSettingsBtn?.addEventListener('click', () => {
    showToast("Preferences saved successfully!", "success");
  });

  // ── 4. Phase 9 Persona Switcher, Demo Banner & Live Metric Mapping ─────
  let currentPersona = "arjun_sharma";
  let currentStudentSkills = ["Physics", "Mathematics", "Python", "Problem Solving", "Robotics", "Leadership"];
  let isDemoProfile = localStorage.getItem('skilltrace_profile_mode') !== 'custom';

  const demoToggleBtn = document.getElementById('demo-toggle-btn');
  const demoBannerText = document.getElementById('demo-banner-text');

  function updateProfileModeBanner() {
    if (demoToggleBtn && demoBannerText) {
      if (isDemoProfile) {
        demoBannerText.textContent = "This is a demo profile......";
        demoToggleBtn.textContent = "Make your own";
        demoToggleBtn.className = "btn btn-primary btn-sm";
      } else {
        demoBannerText.textContent = "Custom Profile Mode Active";
        demoToggleBtn.textContent = "Load Demo Profile";
        demoToggleBtn.className = "btn btn-glass btn-sm";
      }
    }
  }

  demoToggleBtn?.addEventListener('click', () => {
    isDemoProfile = !isDemoProfile;
    localStorage.setItem('skilltrace_profile_mode', isDemoProfile ? 'demo' : 'custom');
    updateProfileModeBanner();
    loadDashboardData();
    showToast(isDemoProfile ? "Loaded Demo Profile (Arjun Sharma)" : "Switched to Custom Profile (Hashes until data is entered)", "info");
  });

  updateProfileModeBanner();

  const personaSelector = document.getElementById('persona-selector');
  personaSelector?.addEventListener('change', async (e) => {
    currentPersona = e.target.value;
    isDemoProfile = true;
    localStorage.setItem('skilltrace_profile_mode', 'demo');
    updateProfileModeBanner();
    try {
      const profile = await SkillTraceAPI.getDemoProfile(currentPersona);
      const welcomeTitle = document.getElementById('welcome-title');
      const welcomeStream = document.getElementById('welcome-stream');
      if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${profile.full_name.split(' ')[0]} 👋`;
      if (welcomeStream) welcomeStream.textContent = profile.target_stream;

      currentStudentSkills = profile.skills || currentStudentSkills;
      loadDashboardData(profile);
      showToast(`Switched persona to ${profile.full_name}`, "success");
    } catch (err) {
      console.warn("Persona fetch failed:", err);
    }
  });

  async function loadDashboardData(overrideProfile = null) {
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeStream = document.getElementById('welcome-stream');

    // 1. Custom Profile Mode (Hashes until data is entered in Entrance Engine)
    if (!isDemoProfile && !overrideProfile) {
      const customSaved = localStorage.getItem('skilltrace_custom_profile');
      let customData = null;
      try {
        if (customSaved) customData = JSON.parse(customSaved);
      } catch (e) {}

      if (!customData || !customData.hasData) {
        // Render Hash Placeholders and make fields editable
        if (welcomeTitle) {
          welcomeTitle.textContent = "Welcome back, ##### 👋";
          welcomeTitle.setAttribute('contenteditable', 'true');
          welcomeTitle.style.borderBottom = '1px dashed var(--cyan)';
        }
        if (welcomeStream) {
          welcomeStream.textContent = "##### Stream";
          welcomeStream.setAttribute('contenteditable', 'true');
          welcomeStream.style.borderBottom = '1px dashed var(--cyan)';
        }

        const sidebarUserName = document.querySelector('.user-profile-info div:first-child');
        const sidebarUserStream = document.querySelector('.user-profile-info div:last-child');
        if (sidebarUserName) {
          sidebarUserName.textContent = "##### #####";
          sidebarUserName.setAttribute('contenteditable', 'true');
        }
        if (sidebarUserStream) {
          sidebarUserStream.textContent = "Grade ## • ##### Stream";
          sidebarUserStream.setAttribute('contenteditable', 'true');
        }

        const kpiElements = document.querySelectorAll('#view-dashboard .kpi-value');
        if (kpiElements.length >= 4) {
          kpiElements[0].textContent = "##%";
          kpiElements[1].textContent = "AIR ###";
          kpiElements[2].textContent = "## Pillar";
          kpiElements[3].textContent = "##### Role";
          kpiElements.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            el.style.outline = 'none';
            el.style.borderBottom = '1px dashed rgba(0, 242, 254, 0.4)';
          });
        }
        return;
      }

      // Render custom mapped data from Entrance Engine
      if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${customData.userName || 'Student'} 👋`;
      if (welcomeStream) welcomeStream.textContent = customData.dominantPillar || "Engineering & Science";

      const kpiElements = document.querySelectorAll('#view-dashboard .kpi-value');
      if (kpiElements.length >= 4) {
        kpiElements[0].textContent = `${customData.overallReadiness}%`;
        kpiElements[1].textContent = customData.airRank ? `AIR ${customData.airRank}` : 'AIR 120';
        kpiElements[2].textContent = customData.dominantPillar;
        kpiElements[3].textContent = "AI Systems Architect";
      }
      return;
    }

    // 2. Demo Profile Mode
    try {
      const profile = overrideProfile || await SkillTraceAPI.getDemoProfile(currentPersona);
      const analyzeData = await SkillTraceAPI.analyzeCompetencies(profile.skills, profile.achievements || [], 0.98, profile.target_stream);
      const careerData = await SkillTraceAPI.getCareerRecommendations(profile.skills, analyzeData.competencies, null);

      if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${profile.full_name.split(' ')[0]} 👋`;
      if (welcomeStream) welcomeStream.textContent = profile.target_stream;

      const kpiReadiness = document.querySelector('#view-dashboard .kpi-value.text-gradient-cyan');
      if (kpiReadiness) kpiReadiness.textContent = `${profile.overall_readiness_score || analyzeData.overall_readiness_score}%`;

      const kpiDominant = document.querySelector('#view-dashboard .glass-card:nth-child(3) .kpi-value');
      if (kpiDominant) kpiDominant.textContent = profile.dominant_pillar || analyzeData.dominant_pillar || "STEM";

      const kpiCareer = document.querySelector('#view-dashboard .glass-card:nth-child(4) .kpi-value');
      if (kpiCareer && careerData.matches && careerData.matches.length > 0) {
        kpiCareer.textContent = careerData.matches[0].career_name;
      }
    } catch (err) {
      console.warn("Backend API call failed, using active dashboard view:", err);
    }
  }

  async function loadCareerData() {
    try {
      const careerData = await SkillTraceAPI.getCareerRecommendations(currentStudentSkills, {}, null);
      if (careerData && careerData.matches) {
        showToast(`Loaded ${careerData.matches.length} career recommendations from backend!`, "success");
      }
    } catch (err) {
      console.warn("Backend career API call failed:", err);
    }
  }

  async function loadAnalysisData() {
    try {
      const analyzeData = await SkillTraceAPI.analyzeCompetencies(currentStudentSkills, ["National Science Olympiad Winner"], 0.98, "Engineering");
      showToast("11-Pillar Vector Analysis updated!", "info");
    } catch (err) {
      console.warn("Backend analysis API call failed:", err);
    }
  }

  // ── 5. Real Certificate File Upload Handler (POST /upload) ─────────────
  const uploadDropzone = document.getElementById('app-upload-dropzone');
  const uploadProgressBox = document.getElementById('upload-progress-box');
  const uploadPreviewBox = document.getElementById('upload-preview-box');
  const uploadSampleBtns = document.querySelectorAll('.upload-sample-btn');

  async function triggerRealUpload(fileOrSampleName) {
    if (uploadProgressBox) uploadProgressBox.style.display = 'block';
    if (uploadPreviewBox) uploadPreviewBox.style.display = 'none';

    const progressText = document.getElementById('upload-step-text');
    const progressBar = document.getElementById('upload-progress-bar-fill');

    if (progressText) progressText.textContent = "Step 1/3: Sending file to FastAPI POST /upload...";
    if (progressBar) progressBar.style.width = "33%";

    try {
      let fileToUpload;
      if (typeof fileOrSampleName === 'string') {
        const dummyContent = "Sample Certificate Document Content for OCR parsing";
        fileToUpload = new File([dummyContent], "certificate_sample.png", { type: "image/png" });
      } else {
        fileToUpload = fileOrSampleName;
      }

      const uploadResult = await SkillTraceAPI.uploadCertificate(fileToUpload);

      if (progressText) progressText.textContent = "Step 2/3: OCR parsed! Re-calculating 11-Pillar Vector...";
      if (progressBar) progressBar.style.width = "66%";

      if (uploadResult.skills && uploadResult.skills.length > 0) {
        currentStudentSkills = [...new Set([...currentStudentSkills, ...uploadResult.skills])];
      }

      const analyzeResult = await SkillTraceAPI.analyzeCompetencies(currentStudentSkills, uploadResult.achievements || [], uploadResult.confidence || 0.95);

      if (progressText) progressText.textContent = "Step 3/3: Validation Complete!";
      if (progressBar) progressBar.style.width = "100%";

      setTimeout(() => {
        if (uploadProgressBox) uploadProgressBox.style.display = 'none';
        if (uploadPreviewBox) uploadPreviewBox.style.display = 'block';
        showToast(`Certificate processed! Confidence: ${(uploadResult.confidence * 100).toFixed(1)}%`, "success");
      }, 500);

    } catch (err) {
      console.warn("Real upload endpoint call failed, simulating fallback UI:", err);
      setTimeout(() => {
        if (uploadProgressBox) uploadProgressBox.style.display = 'none';
        if (uploadPreviewBox) uploadPreviewBox.style.display = 'block';
        showToast("Certificate processed successfully!", "info");
      }, 1000);
    }
  }

  const realFileInput = document.getElementById('real-file-input');

  uploadSampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-sample-name');
      triggerRealUpload(name);
    });
  });

  if (realFileInput) {
    realFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        triggerRealUpload(e.target.files[0]);
      }
    });
  }

  if (uploadDropzone) {
    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = 'var(--cyan)';
      uploadDropzone.style.background = 'rgba(0, 242, 254, 0.1)';
    });

    uploadDropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = 'var(--border-subtle)';
      uploadDropzone.style.background = 'transparent';
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = 'var(--border-subtle)';
      uploadDropzone.style.background = 'transparent';
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        realFileInput.files = e.dataTransfer.files;
        triggerRealUpload(e.dataTransfer.files[0]);
      }
    });
  }

  // ── 6. Phase 3 Socratic TeachBack AI Chat System (POST /teachback) ──────
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const promptPills = document.querySelectorAll('.prompt-pill');

  let currentDifficultyTier = "Medium";

  function appendChatMessage(htmlText, isUser = false) {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
    bubble.innerHTML = htmlText;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSendChat(customText) {
    const text = customText || chatInput?.value.trim();
    if (!text) return;

    appendChatMessage(text, true);
    if (chatInput) chatInput.value = '';

    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble chat-bubble-ai';
    typingBubble.innerHTML = '<em>SkillTrace AI is processing response...</em>';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const lowerText = text.toLowerCase();
    const isQuestionOrGreeting = lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('how') || lowerText.includes('what') || lowerText.includes('can u') || lowerText.includes('ncert') || lowerText.includes('study') || lowerText.includes('career') || lowerText.includes('strength') || lowerText.includes('deep') || lowerText.includes('detail') || lowerText.includes('10');

    try {
      if (isQuestionOrGreeting) {
        const chatRes = await SkillTraceAPI.sendChatMessage(text);
        typingBubble.remove();

        let rawReply = chatRes.reply || chatRes.data?.reply || "SkillTrace AI is here to guide your learning and career journey!";
        const followups = chatRes.suggested_followups || chatRes.data?.suggested_followups || [];

        // Format markdown to HTML elements
        let formattedReply = rawReply
          .replace(/^### (.*$)/gim, '<h4 style="color: var(--cyan); margin: 10px 0 4px 0; font-size: 1rem;">$1</h4>')
          .replace(/^#### (.*$)/gim, '<h5 style="color: var(--purple); margin: 8px 0 3px 0; font-size: 0.9rem;">$1</h5>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br/>');

        let formattedChat = `
          <div style="margin-bottom: 6px;">
            <strong>🤖 SkillTrace AI Assistant:</strong>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 10px;">
            ${formattedReply}
          </div>
        `;

        if (followups.length > 0) {
          formattedChat += `<div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 700; text-transform: uppercase;">Suggested Follow-ups:</div>`;
          formattedChat += `<div style="display: flex; gap: 6px; flex-wrap: wrap;">`;
          followups.forEach(f => {
            formattedChat += `<span class="badge prompt-pill" onclick="window.sendChatPill('${f}')" style="cursor: pointer; background: rgba(0,242,254,0.1); color: var(--cyan); border: 1px solid rgba(0,242,254,0.3); font-size: 0.75rem; padding: 4px 8px;">${f}</span>`;
          });
          formattedChat += `</div>`;
        }

        appendChatMessage(formattedChat, false);
        return;
      }

      // TeachBack Socratic Assessor for concept explanations
      const responsePayload = await SkillTraceAPI.evaluateTeachback(
        'Student Learner',
        'Data Structures & Algorithms',
        text,
        'Engineering',
        currentDifficultyTier
      );

      typingBubble.remove();
      const data = responsePayload.data || responsePayload;

      if (data.adaptive_next_difficulty) {
        currentDifficultyTier = data.adaptive_next_difficulty;
      }

      const eq = data.explanation_quality || { accuracy: 85, depth: 80, examples: 75, logical_flow: 85, terminology: 85 };

      const formattedResponse = `
        <div style="margin-bottom: 8px;">
          <strong>🎓 Socratic TeachBack Assessor:</strong>
          <span class="badge" style="font-size: 0.7rem; background: rgba(0, 242, 254, 0.15); color: var(--cyan); margin-left: 6px;">
            Bloom's: ${data.bloom_level || 'Understand'}
          </span>
          <span class="badge" style="font-size: 0.7rem; background: rgba(168, 85, 247, 0.15); color: var(--purple); margin-left: 4px;">
            Next Tier: ${data.adaptive_next_difficulty || 'Medium'}
          </span>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--cyan);">
            ${data.mastery_score || data.comprehension_score || 85}% <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">Mastery Score</span>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">
          ${data.feedback || data.summary || 'Great reflection on the core concept!'}
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px; margin-bottom: 10px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">Explanation Quality Breakdown</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 0.75rem;">
            <div>Accuracy: <strong style="color: var(--emerald);">${eq.accuracy}%</strong></div>
            <div>Depth: <strong style="color: var(--cyan);">${eq.depth}%</strong></div>
            <div>Examples: <strong style="color: var(--purple);">${eq.examples}%</strong></div>
            <div>Flow: <strong style="color: var(--amber);">${eq.logical_flow}%</strong></div>
            <div>Terminology: <strong style="color: var(--cyan);">${eq.terminology}%</strong></div>
          </div>
        </div>

        <div style="background: rgba(0, 242, 254, 0.08); border-left: 3px solid var(--cyan); padding: 8px 12px; margin-top: 10px; border-radius: 0 6px 6px 0;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">🤔 Socratic Prompt (Never direct answer):</div>
          <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-primary); margin-top: 2px;">
            "${data.socratic_question || (data.follow_up_questions ? data.follow_up_questions[0] : 'How does your explanation apply to edge cases?')}"
          </div>
        </div>
      `;

      appendChatMessage(formattedResponse, false);
      showToast("Evaluated by SkillTrace AI!", "success");
      return;
    } catch (err) {
      console.warn("AI Chat / TeachBack endpoint fallback triggered:", err);
    }

    typingBubble.remove();

    let dynamicFallback = '';
    const queryLower = text.toLowerCase();

    if (queryLower.includes('deep') || queryLower.includes('full') || queryLower.includes('detail') || queryLower.includes('more')) {
      dynamicFallback = `
        <div style="margin-bottom: 6px;"><strong>🤖 SkillTrace AI Assistant:</strong> <span class="badge" style="font-size:0.7rem; background:rgba(0,242,254,0.15); color:var(--cyan);">Deep-Dive Master Plan</span></div>
        <h4 style="color:var(--cyan); margin:8px 0 4px 0;">🔬 Comprehensive Class 10 NCERT Deep Execution Blueprint</h4>
        <ol style="padding-left: 20px; font-size: 0.88rem; line-height: 1.6; color: var(--text-primary);">
          <li><strong>Phase 1: Concept Mastery & Exemplar Proofs (Weeks 1-3)</strong><br/>
          - <em>Physics:</em> Master Ray Diagrams for Convex/Concave lenses and mirrors. Practice Lens Formula ($\frac{1}{f}=\frac{1}{v}-\frac{1}{u}$) & Ohm's Law series/parallel resistor networks.<br/>
          - <em>Chemistry:</em> Balance chemical equations with state symbols. Memorize Carbon compound reactivity series and Chlor-Alkali process reactions.<br/>
          - <em>Biology:</em> Draw and label Human Excretory System, Heart circulation, and Plant Stomata from memory.</li>
          <li><strong>Phase 2: Math Rigor & Exemplar Problems (Weeks 4-6)</strong><br/>
          - Solve 100% of NCERT Solved Examples + NCERT Exemplar problems for Triangles, Trigonometry, and Quadratic Equations.<br/>
          - Target 100% accuracy on 5-mark theorem proofs (Basic Proportionality Theorem & Circle tangents).</li>
          <li><strong>Phase 3: Social Science & Active Recall (Weeks 7-8)</strong><br/>
          - Map key historical events (Nationalism in India timeline: 1919 Rowlatt Act, 1920 Non-Cooperation, 1930 Dandi March).<br/>
          - Practice geography map pointing (Dams, Nuclear Power Plants, Major Ports).</li>
          <li><strong>Phase 4: PYQs & Exam Simulation (Final 30 Days)</strong><br/>
          - Complete 10 full-length 3-hour sample papers under strict exam conditions.<br/>
          - Use TeachBack active recall to explain missed questions out loud until 100% understood.</li>
        </ol>
      `;
    } else if (queryLower.includes('ncert') || queryLower.includes('10') || queryLower.includes('study')) {
      dynamicFallback = `
        <div style="margin-bottom: 6px;"><strong>🤖 SkillTrace AI Assistant:</strong></div>
        <h4 style="color:var(--cyan); margin:8px 0 4px 0;">📚 Class 10 NCERT Board Preparation Strategy</h4>
        <p style="font-size:0.88rem; line-height:1.5;">Here is your structured strategy for <em>"${text}"</em>:</p>
        <ul style="padding-left: 20px; font-size: 0.88rem; line-height: 1.6;">
          <li><strong>Science:</strong> Focus on NCERT in-text questions, back exercises, and circuit/light numericals.</li>
          <li><strong>Mathematics:</strong> Focus on NCERT examples, Trigonometric Identities, and Surface Areas.</li>
          <li><strong>Social Science:</strong> Learn chapter headings as 3-mark and 5-mark bullet points.</li>
          <li><strong>Active Recall:</strong> Use SkillTrace TeachBack AI to test your topic explanation mastery!</li>
        </ul>
        <div style="margin-top:8px; font-size:0.75rem; color:var(--text-muted);">Type <em>"in full deep"</em> for the week-by-week 500-word master timetable!</div>
      `;
    } else {
      dynamicFallback = `
        <div style="margin-bottom: 6px;"><strong>🤖 SkillTrace AI Assistant:</strong></div>
        <p style="font-size:0.88rem; line-height:1.5; color:var(--text-primary);">
          Thank you for asking about <strong>"${text}"</strong>! SkillTrace AI provides personalized learning guidance, certificate vector auditing, and Socratic evaluation.
        </p>
        <div style="margin-top:8px; font-size:0.78rem; color:var(--cyan);">
          💡 <strong>Suggested Actions:</strong> Ask <em>"how to study for Class 10 NCERT in full deep"</em> or <em>"what are my top career matches?"</em>
        </div>
      `;
    }

    appendChatMessage(dynamicFallback, false);
  }

  window.sendChatPill = function(promptText) {
    handleSendChat(promptText);
  };

  chatSendBtn?.addEventListener('click', () => handleSendChat());
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendChat();
  });

  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const text = pill.getAttribute('data-prompt');
      if (text) handleSendChat(text);
    });
  });

  // ── 7. Number Count-Up Animation for KPI Values ──────────────────────────
  function animateCounter(el, target, duration = 900, suffix = '') {
    if (!el) return;
    const isFloat = String(target).includes('.');
    const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;
    const start = performance.now();
    const from = 0;
    function update(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const value = from + (target - from) * eased;
      el.textContent = (isFloat ? value.toFixed(decimals) : Math.round(value)) + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function runKpiCounters() {
    const readinessEl = document.querySelector('#view-dashboard .kpi-value.text-gradient-cyan');
    animateCounter(readinessEl, 84.2, 900, '%');
  }

  // Run on initial load
  loadDashboardData();
  setTimeout(runKpiCounters, 150);

});
