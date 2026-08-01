// Tasklist Engine & Progress Math

export interface TaskItem {
  id: string;
  examName: string;
  subtopicName: string;
  category: 'DEEP_MASTERY' | 'PARETO_80_20' | 'FORMULA_REVIEW';
  title: string;
  description: string;
  estimatedHours: number;
  scoreBoostPercent: number;
  completed: boolean;
  completedAt?: string;
  practiceUrl: string;
}

export interface MockTestUpload {
  id: string;
  examName: string;
  testName: string;
  scoreObtained: number;
  totalMarks: number;
  dateUploaded: string;
}

const TASKS_STORAGE_KEY = 'antigravity_main_tasklist_v2';
const UPLOADS_STORAGE_KEY = 'antigravity_mock_uploads_v2';

export function getStoredTaskList(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function saveTaskList(tasks: TaskItem[]) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {}
}

export function getStoredMockUploads(): MockTestUpload[] {
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function saveMockUploads(uploads: MockTestUpload[]) {
  try {
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(uploads));
  } catch (e) {}
}

const RATES_STORAGE_KEY = 'antigravity_decay_rates';

export function getDecayRates(): { alpha: number, lambda: number } | null {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveDecayRates(alpha: number, lambda: number) {
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify({ alpha, lambda }));
  } catch (e) {}
}

// Generate tasks mapped across ALL recommended / tracked exams
export function generateInitialTasks(recommendations: any[]): TaskItem[] {
  const tasks: TaskItem[] = [];
  const rates = getDecayRates();

  const defaultSubtopics: Record<string, string[]> = {
    'Engineering': ['Calculus & Definite Integrals', 'Rotational Dynamics & Torque', 'Electromagnetism - Biot-Savart', 'Organic Mechanism & Reaction Kinetics', 'Coordinate Geometry'],
    'Law': ['Constitutional Law & Landmark Judgments', 'Law of Torts & Negligence', 'Legal Reading Comprehension Passages', 'Critical Reasoning & Logical Fallacies', 'Quantitative Techniques'],
    'Management': ['Data Interpretation & Caselets', 'Quantitative Aptitude & Time-Speed', 'Reading Comprehension & Verbal Ability', 'Logical Reasoning & Seating Matrix', 'Higher Mathematics'],
    'General / Multidisciplinary': ['General Knowledge & Current Affairs', 'Logical Reasoning & Series', 'Quantitative Ability', 'English Verbal Comprehension']
  };

  recommendations.forEach((rec, rIdx) => {
    const examName = rec.exam?.exam_name || rec.exam_name || 'Target Exam';
    const category = rec.exam?.category || 'General / Multidisciplinary';
    const subList = defaultSubtopics[category] || defaultSubtopics['General / Multidisciplinary'];

    subList.forEach((sub, sIdx) => {
      const practiceUrl = `https://www.google.com/search?q=${encodeURIComponent(sub + ' ' + examName + ' practice questions PYQ notes')}`;
      const isDeep = sIdx % 2 === 0;
      
      // Apply Alpha (Learning Rate) to estimated hours (high alpha = faster learning = lower hours)
      let baseHours = isDeep ? 4.0 : 2.5;
      if (rates && rates.alpha > 0) {
        baseHours = baseHours / rates.alpha;
      }

      tasks.push({
        id: `TASK_${rIdx}_${sIdx}_${Date.now()}`,
        examName,
        subtopicName: sub,
        category: isDeep ? 'DEEP_MASTERY' : 'PARETO_80_20',
        title: `[${examName}] ${isDeep ? 'Deep Study' : 'High-Yield Pareto'}: ${sub}`,
        description: isDeep
          ? `Current predicted accuracy needs reinforcement. Complete theory review & 35 practice problems.`
          : `Solve past 5-year PYQs to boost predicted score for ${sub} by +2.5%.`,
        estimatedHours: Math.round(baseHours * 10) / 10,
        scoreBoostPercent: isDeep ? 3.5 : 2.5,
        completed: false,
        practiceUrl
      });
      
      // If Lambda (Decay Rate) is high, inject spaced repetition tasks
      if (rates && rates.lambda > 0.05) {
        tasks.push({
          id: `TASK_REVIEW_${rIdx}_${sIdx}_${Date.now()}`,
          examName,
          subtopicName: sub,
          category: 'FORMULA_REVIEW',
          title: `[Spaced Repetition] Review ${sub}`,
          description: `Your memory decay rate (λ=${rates.lambda.toFixed(2)}) indicates you will likely forget this topic quickly. Review core formulas and logic blocks.`,
          estimatedHours: 0.5,
          scoreBoostPercent: 1.0,
          completed: false,
          practiceUrl
        });
      }
    });
  });

  return tasks;
}
