# 🧠 SkillTrace AI — Multimodal Student Competency Vectorization & Career Feasibility Engine
> **SFHS C.O.D.E. Hack 7.0 (2026)** — Sub-Theme 2: *AI for Smarter Learning*
**SkillTrace AI** is a multimodal intelligence platform designed to eliminate manual credential entry for secondary school students. By integrating Multimodal Vision AI with Socratic evaluation engines, SkillTrace AI parses competition certificates, academic marksheets, and diagnostic test metrics in real time—mapping candidate 5-pillar competency vectors directly to target career paths, university streams, and All-India Rank (AIR) feasibility predictions.
---
## 🌟 Key Features
1. **Multimodal Vision AI Certificate Intelligence**:
   - Parses raw photos, PDFs, and competition marksheets using OCR intelligence.
   - Extracts validated credentials, issuing authorities, and date markers without hallucinated data.
2. **Socratic TeachBack AI Evaluator**:
   - Tests student conceptual understanding by probing for student-led explanations.
   - Identifies underlying misconceptions, computes a mastery score (0-100%), and provides vivid real-world analogies.
3. **5-Pillar Competency Vector Analysis**:
   - Evaluates students across Analytical Reasoning, Theoretical Math, Applied Physics, Verbal Logic, Spatial Reasoning, and Pattern Recognition.
   - Dynamically updates live SVG/Recharts Radar charts and AIR feasibility matrices.
4. **Interactive Dashboard & Hash Mode**:
   - **Demo Profile Mode**: Pre-loaded student personas (Arjun Sharma, Priya Patel, Ananya Roy, Rohan Verma, Kabir Das).
   - **Custom Hash Mode**: In "Make your own" mode without uploaded certificates, metrics render as **editable hash placeholders (`Welcome back, ##### 👋`, `##%`, `AIR ###`)** that users can click and edit directly on-screen.
5. **Direct Data Mapping & PDF CV Generator**:
   - Inputs and parameter adjustments in the Entrance Engine instantly map to Dashboard KPIs.
   - One-click **📄 Download PDF / CV** export formatting student competency portfolios for university admissions.
6. **Unified Multi-Page Architecture**:
   - **Home Screen (`index.html`)**: Landing page with hackathon theme, problem/solution, and architecture.
   - **Dashboard (`dashboard.html`)**: Main app with demo profile toggle, editable hashes, and PDF download.
   - **Entrance Engine (`entrance.html`)**: 5-mode test engine (AIR Tasklist, Psychometric Test, Prior Diagnostic, Entrance Module, Scholarships).
   
##Instructions to Open

# Clone the repository
git clone https://github.com/iamnear67/SkillTraceAI.git
cd SkillTraceAI
# Install Node dependencies
npm install
2. Run Frontend Development Server
bash
# Start Vite multi-page server
npm run dev
Open http://localhost:5173 in your browser.

3. Run FastAPI AI Service (Optional Backend)
bash
# Navigate to backend directory
cd server
# Install Python packages
pip install -r requirements.txt
# Start FastAPI server
python main.py
FastAPI server runs on http://localhost:8000.

👥 Team Details
Team Role	Identifier	Responsibilities
Team Lead & Core AI Engineer	1001A	Vision AI Certificate Parser, Groq LLM API Integration, Socratic TeachBack Prompting Architecture
Frontend Architect & UI/UX	1001B	Multi-Page Vite Setup, Dark Glassmorphism Design System, Recharts Competency Radar, Editable Hash Mode
Full Stack & Backend Developer	1001C	FastAPI Router, Parameters Pipeline (competency_service.py, normalizer.py), LocalStorage Persistence
QA, Data & Documentation	1001D	Dataset compiling (allExams.ts), Psychometric engine testing, Hackathon documentation, Presentation
🤖 AI Usage Disclosure
SkillTrace AI uses artificial intelligence responsibly and strictly within defined boundaries:

Large Language Models (LLMs):
Groq API (llama-3.3-70b-versatile): Powered by low-latency inference for real-time Socratic TeachBack evaluations, misconception detection, and dynamic career rationale synthesis.
Vision AI / OCR Intelligence:
Automated certificate metadata extraction parsing raw text, issuer validation, and skills mapping.
Rule Engine & Vector Normalizer:
Deterministic mathematical normalization models (normalizer.py, scorer.py) calculating competency scores to ensure non-hallucinated AIR rank estimation.
💡 Why SkillTrace AI is a Worthwhile Hackathon Innovation
The Problem
Secondary school students possess scattered achievements across coding competitions, Olympiads, science fairs, and online courses. Current admission and guidance portals rely on manual self-reporting, leading to:

High friction and loss of credential verification.
Static, non-adaptive career recommendations that ignore real candidate trajectory.
Inability to estimate competitive entrance exam feasibility (AIR ranks) before taking high-stakes exams.
The Innovation
SkillTrace AI bridges this critical gap through three novel architectural breakthroughs:

Zero-Friction Vision Verification: Instead of filling out endless forms, students simply upload photo/PDF certificates. Vision AI parses and validates credentials into structured competency vectors automatically.
Interactive Socratic TeachBack: Unlike passive quizzes, SkillTrace AI forces active recall. Students explain concepts in their own words, while the AI detects conceptual gaps, calculates comprehension depth, and adjusts study tasklists dynamically.
Real-Time Competency-to-AIR Mapping: SkillTrace AI translates 5-pillar skill vectors into expected All-India Ranks (AIR) across top competitive exams (JEE, NEET, CUET, SAT, NDA) with actionable skill-gap roadmaps.
By transforming unstructured student accomplishments into a single, verifiable, and predictive intelligence dashboard, SkillTrace AI empowers students and educators with actionable insights for smarter, personalized learning.

📄 License
Developed for SFHS C.O.D.E. Hack 7.0 (2026).

