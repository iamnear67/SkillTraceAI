export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  verificationScore: number;
  extractedSkills: string[];
  competencyArea: string;
}

export interface ExamScoreData {
  name: string;
  score: number;
  date: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  type: 'certificate' | 'exam' | 'project';
  description: string;
}

export interface ProfileData {
  name: string;
  role: string;
  summary: string;
  overallCompetency: number;
  verificationScore: number;
  achievements: number;
}

export interface PortfolioDataStructure {
  profile: ProfileData;
  radarData: { subject: string; A: number; fullMark: number }[];
  certificates: Certificate[];
  examTrends: { name: string; Math: number; Physics: number; Logic: number }[];
  timeline: TimelineEvent[];
}

export const defaultPortfolioData: PortfolioDataStructure = {
  profile: {
    name: "Alex Sterling",
    role: "Prospective STEM Scholar",
    summary: "A highly driven candidate with demonstrated excellence in Analytical Reasoning, Applied Physics, and Advanced Mathematics. Consistently testing in the top 5% of peer groups with verified credential density.",
    overallCompetency: 94,
    verificationScore: 98,
    achievements: 12
  },
  radarData: [
    { subject: 'Analytical', A: 120, fullMark: 150 },
    { subject: 'Theoretical Math', A: 98, fullMark: 150 },
    { subject: 'Applied Physics', A: 86, fullMark: 150 },
    { subject: 'Verbal Logic', A: 99, fullMark: 150 },
    { subject: 'Spatial Reasoning', A: 85, fullMark: 150 },
    { subject: 'Pattern Rec', A: 65, fullMark: 150 },
  ],
  certificates: [
    {
      id: "CERT_001",
      name: "Advanced Physics Principles",
      issuer: "MIT OpenCourseWare",
      date: "Oct 2023",
      verificationScore: 99,
      extractedSkills: ["Kinematics", "Thermodynamics", "Vector Calculus"],
      competencyArea: "Applied Physics"
    },
    {
      id: "CERT_002",
      name: "Data Structures & Algorithms",
      issuer: "Stanford Online",
      date: "Jan 2024",
      verificationScore: 96,
      extractedSkills: ["Graph Theory", "Dynamic Programming", "Big-O"],
      competencyArea: "Analytical Reasoning"
    },
    {
      id: "CERT_003",
      name: "National Math Olympiad (Regional)",
      issuer: "HBCSE",
      date: "May 2023",
      verificationScore: 100,
      extractedSkills: ["Combinatorics", "Number Theory", "Geometry"],
      competencyArea: "Theoretical Math"
    }
  ],
  examTrends: [
    { name: 'Jan', Math: 65, Physics: 55, Logic: 70 },
    { name: 'Feb', Math: 70, Physics: 62, Logic: 75 },
    { name: 'Mar', Math: 85, Physics: 78, Logic: 80 },
    { name: 'Apr', Math: 88, Physics: 82, Logic: 85 },
    { name: 'May', Math: 94, Physics: 89, Logic: 92 },
  ],
  timeline: [
    { id: 'TL_1', year: '2023', title: 'National Math Olympiad', type: 'exam', description: 'Secured state rank 4 in regional qualifiers.' },
    { id: 'TL_2', year: '2023', title: 'Physics Certification', type: 'certificate', description: 'Completed MIT OCW Advanced Physics module.' },
    { id: 'TL_3', year: '2024', title: 'Algorithms Project', type: 'project', description: 'Built an open-source pathfinding visualizer.' },
    { id: 'TL_4', year: '2024', title: 'Current Competency Level', type: 'exam', description: 'Testing in top 5% across major standard exams.' },
  ]
};

const PORTFOLIO_STORAGE_KEY = 'antigravity_portfolio_data_v1';

export function getStoredPortfolioData(): PortfolioDataStructure {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultPortfolioData, ...parsed };
    }
  } catch (e) {
    console.error("Error reading portfolio data from localStorage", e);
  }
  return defaultPortfolioData;
}

export function saveStoredPortfolioData(data: PortfolioDataStructure) {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving portfolio data to localStorage", e);
  }
}

export const portfolioData = getStoredPortfolioData();
