// Build utility: Parse gemini-code-1785569974423.json → allExams.ts
// Run: node src/data/_buildAllExams.mjs

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, '..', '..', 'gemini-code-1785569974423.json');
const outputPath = join(__dirname, 'allExams.ts');

const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'));
const exams = raw.exams;

// Category → psychometric affinity heuristic mapping
function computeAffinity(category, selectionModel, examName) {
  const cat = (category || '').toLowerCase();
  const name = (examName || '').toLowerCase();
  
  let V_QUANT = 0.2, V_LAW = 0.2, V_MGMT = 0.2, V_GEN = 0.2;

  // Engineering
  if (cat.includes('engineering') || cat.includes('tech') || name.includes('jee') || name.includes('bitsat') || name.includes('viteee') || name.includes('comedk') || name.includes('srmjeee') || name.includes('met')) {
    V_QUANT = 0.85; V_GEN = 0.35; V_MGMT = 0.2; V_LAW = 0.05;
  }
  // Medical / Health
  else if (cat.includes('medical') || cat.includes('health') || cat.includes('dental') || cat.includes('nursing') || cat.includes('pharma') || cat.includes('veterinary') || cat.includes('ayush') || name.includes('neet') || name.includes('aiims')) {
    V_QUANT = 0.6; V_GEN = 0.5; V_MGMT = 0.15; V_LAW = 0.05;
  }
  // Law
  else if (cat.includes('law') || name.includes('clat') || name.includes('ailet') || name.includes('lsat')) {
    V_LAW = 0.9; V_GEN = 0.4; V_MGMT = 0.2; V_QUANT = 0.15;
  }
  // Management (UG)
  else if ((cat.includes('management') || cat.includes('business') || cat.includes('commerce')) && cat.includes('ug')) {
    V_MGMT = 0.85; V_QUANT = 0.45; V_GEN = 0.4; V_LAW = 0.1;
  }
  // Management (PG)
  else if (cat.includes('management') || cat.includes('business') || name.includes('cat') || name.includes('xat') || name.includes('snap') || name.includes('mat') || name.includes('cmat') || name.includes('nmat')) {
    V_MGMT = 0.85; V_QUANT = 0.5; V_GEN = 0.35; V_LAW = 0.1;
  }
  // Civil Services
  else if (cat.includes('civil service') || cat.includes('public admin') || cat.includes('upsc') || name.includes('upsc')) {
    V_GEN = 0.7; V_LAW = 0.5; V_MGMT = 0.4; V_QUANT = 0.3;
  }
  // Design / Architecture
  else if (cat.includes('design') || cat.includes('architecture') || name.includes('nata') || name.includes('nid') || name.includes('uceed')) {
    V_QUANT = 0.45; V_GEN = 0.55; V_MGMT = 0.3; V_LAW = 0.05;
  }
  // Defence
  else if (cat.includes('defen') || name.includes('nda') || name.includes('cds') || name.includes('afcat')) {
    V_GEN = 0.7; V_QUANT = 0.5; V_MGMT = 0.35; V_LAW = 0.1;
  }
  // Hospitality / Hotel Management
  else if (cat.includes('hospitality') || cat.includes('hotel') || name.includes('nchmct') || name.includes('ihm')) {
    V_MGMT = 0.65; V_GEN = 0.55; V_QUANT = 0.25; V_LAW = 0.05;
  }
  // Education / Teaching
  else if (cat.includes('education') || cat.includes('teaching') || name.includes('ctet') || name.includes('b.ed')) {
    V_GEN = 0.65; V_MGMT = 0.35; V_QUANT = 0.3; V_LAW = 0.15;
  }
  // Banking / Finance
  else if (cat.includes('banking') || cat.includes('finance') || name.includes('ibps') || name.includes('sbi') || name.includes('rbi')) {
    V_QUANT = 0.55; V_MGMT = 0.5; V_GEN = 0.5; V_LAW = 0.2;
  }
  // General entrance / multi-domain (CUET, etc.)
  else if (name.includes('cuet') || cat.includes('multi') || cat.includes('central') || cat.includes('general')) {
    V_GEN = 0.7; V_QUANT = 0.35; V_MGMT = 0.35; V_LAW = 0.25;
  }
  // Science / Research
  else if (cat.includes('science') || cat.includes('research') || name.includes('iiser') || name.includes('isi') || name.includes('iat') || name.includes('nest')) {
    V_QUANT = 0.8; V_GEN = 0.4; V_MGMT = 0.1; V_LAW = 0.05;
  }
  // Agriculture
  else if (cat.includes('agri') || name.includes('icar')) {
    V_QUANT = 0.45; V_GEN = 0.55; V_MGMT = 0.2; V_LAW = 0.05;
  }
  // Maritime / Merchant Navy
  else if (cat.includes('maritim') || cat.includes('merchant') || name.includes('imu')) {
    V_QUANT = 0.5; V_GEN = 0.5; V_MGMT = 0.3; V_LAW = 0.1;
  }
  // Women's universities
  else if (cat.includes('women') || name.includes('sndt')) {
    V_GEN = 0.6; V_MGMT = 0.35; V_QUANT = 0.3; V_LAW = 0.15;
  }
  // Environment / Sustainability
  else if (cat.includes('environment') || cat.includes('sustain') || name.includes('teri')) {
    V_GEN = 0.55; V_QUANT = 0.4; V_MGMT = 0.35; V_LAW = 0.2;
  }
  // IPMAT / Integrated Management
  else if (name.includes('ipmat') || name.includes('jipmat') || name.includes('npat') || name.includes('set') || name.includes('christ')) {
    V_MGMT = 0.8; V_QUANT = 0.55; V_GEN = 0.45; V_LAW = 0.1;
  }
  // Fallback: general aptitude exam
  else {
    V_GEN = 0.5; V_QUANT = 0.35; V_MGMT = 0.3; V_LAW = 0.2;
  }

  return { V_QUANT: parseFloat(V_QUANT.toFixed(2)), V_LAW: parseFloat(V_LAW.toFixed(2)), V_MGMT: parseFloat(V_MGMT.toFixed(2)), V_GEN: parseFloat(V_GEN.toFixed(2)) };
}

// Build the TS output
let tsContent = `// Auto-generated from gemini-code-1785569974423.json
// Total exams: ${exams.length}

export interface CollegeTier {
  tier: string;
  score_rank_expectation: string;
  target_colleges: string[];
}

export interface PsychometricAffinity {
  V_QUANT: number;
  V_LAW: number;
  V_MGMT: number;
  V_GEN: number;
}

export interface FullExam {
  exam_id: number;
  exam_name: string;
  category: string;
  conducting_body: string;
  selection_model: string;
  college_mapping: CollegeTier[];
  psychometric_affinity: PsychometricAffinity;
}

export const allExams: FullExam[] = [\n`;

exams.forEach((exam, idx) => {
  const affinity = computeAffinity(exam.category, exam.selection_model, exam.exam_name);
  tsContent += `  {\n`;
  tsContent += `    exam_id: ${exam.exam_id},\n`;
  tsContent += `    exam_name: ${JSON.stringify(exam.exam_name)},\n`;
  tsContent += `    category: ${JSON.stringify(exam.category)},\n`;
  tsContent += `    conducting_body: ${JSON.stringify(exam.conducting_body)},\n`;
  tsContent += `    selection_model: ${JSON.stringify(exam.selection_model)},\n`;
  tsContent += `    college_mapping: ${JSON.stringify(exam.college_mapping, null, 6).split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n')},\n`;
  tsContent += `    psychometric_affinity: { V_QUANT: ${affinity.V_QUANT}, V_LAW: ${affinity.V_LAW}, V_MGMT: ${affinity.V_MGMT}, V_GEN: ${affinity.V_GEN} }\n`;
  tsContent += `  }${idx < exams.length - 1 ? ',' : ''}\n`;
});

tsContent += `];\n`;

writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`✓ Generated allExams.ts with ${exams.length} exams`);
