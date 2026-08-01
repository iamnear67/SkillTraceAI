# SkillTrace AI — Multimodal Competency Verification & Entrance Feasibility Platform

**SkillTrace AI** is an end-to-end AI platform that turns scattered student achievements, competition certificates, and diagnostic test results into verifiable skill intelligence, career roadmaps, and entrance feasibility predictions.

---

## 🌟 Architecture & Application Multi-Page Layout

The platform is structured into three primary multi-page views served seamlessly via Vite:

1. 🏠 **Main Website Landing Page (`index.html` / `http://localhost:5173/`)**
   - The primary home screen featuring the **SkillTrace AI** Vision AI showcase, hackathon background, problem & solution overview, and interactive feature cards.
   - Enlarged, prominent header buttons to launch the **Dashboard** and **Entrance Engine**.

2. 📊 **Application Dashboard (`dashboard.html` / `http://localhost:5173/dashboard.html`)**
   - **Floating Profile Banner**: Toggle between **Demo Profile (Arjun Sharma)** and **Custom Profile ("Make your own")**.
   - **Hash Placeholder Mode**: Displays `##%`, `AIR ###`, and `##` placeholders when custom profile has no uploaded credentials or test entries.
   - **Direct Metric Mapping**: Dynamically updates KPIs and competency vectors as soon as data is entered or uploaded in the Entrance Engine.
   - **PDF CV Export**: One-click student competency CV report export (`📄 Download PDF / CV`).

3. 🧪 **Entrance Module Engine (`entrance.html` / `http://localhost:5173/entrance.html`)**
   - 5 streamlined modes:
     1. **Mode 1: AIR & Tasklist** — Expected All India Rank predictions and adaptive study schedule.
     2. **Mode 2: Psychometric Test** — Aptitude vector analysis and interest profiling.
     3. **Mode 3: Prior Knowledge Diagnostic** — 15-class academic baseline test.
     4. **Mode 4: Entrance Module** — 5 unified sub-tabs:
        - *Learning & Decay Analysis* (Forgetting curve & retention speed calibration)
        - *TeachBack AI Evaluator* (Socratic explanation evaluation & misconception detection)
        - *AI Career Guidance* (Skill-gap roadmaps & career matching)
        - *Parameters Pipeline* (Direct parameter sliders connected to Python backend engines)
        - *Competency Radar & Feasibility* (Live SVG/Recharts competency chart + target exam AIR matrix)
     5. **Mode 5: Scholarships** — Financial aid and grant finder.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+
- **Python**: 3.9+

### 1. Install Dependencies & Start Frontend Dev Server

```bash
# Install NPM packages
npm install

# Start Vite Multi-Page Dev Server
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

### 2. Start Python FastAPI AI Backend (Optional)

```bash
# Navigate to server directory
cd server

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI service
python main.py
```

The FastAPI AI service will run on `http://localhost:8000`.

---

## 📂 Project Structure

```
webpage-add/
├── index.html               # Main Website Landing Page (Home Screen)
├── dashboard.html           # Main Application Dashboard
├── entrance.html            # Entrance Module & Feasibility Engine (React App)
├── styles.css               # Global SkillTrace AI Dark Glassmorphic Stylesheet
├── app.js                   # Landing Page Controller & Animations
├── dashboard.js             # Dashboard Controller, Demo Switcher & Metric Mapper
├── api.js                   # API Client & Backend Integration Bridge
├── vite.config.ts           # Vite Multi-Page Configuration
├── package.json             # NPM Dependencies & Scripts
├── src/                     # React Application Source Code
│   ├── App.tsx              # Top-level navigation & Mode Switcher
│   ├── components/          # React Components
│   │   ├── ModeNav.tsx               # 5-Mode Navigation Bar
│   │   ├── Mode5EntranceModule.tsx   # 5-Subtab Entrance Engine
│   │   ├── TeachBackEngine.tsx       # Socratic AI Evaluator
│   │   ├── CareerRecommendationView.tsx # AI Career Guidance
│   │   └── AuthModal.tsx             # Firebase Auth Modal
│   └── utils/               # Utilities & Firebase Auth
└── skill-trace/             # Synchronized Python Backend & Core Sub-repository
```

---

## 🛠️ Key Technologies

- **Frontend**: React 19, TypeScript, Vite 6, Framer Motion, Recharts, Lucide React, FontAwesome 6.
- **Styling**: Vanilla CSS3, Glassmorphism, CSS Variables, Responsive `@media print` queries.
- **Backend / AI**: FastAPI, Python 3, Groq API (`llama-3.3-70b-versatile`), Firebase Authentication.

---

## 📄 License
Privately developed for **SkillTrace AI** Engine.
