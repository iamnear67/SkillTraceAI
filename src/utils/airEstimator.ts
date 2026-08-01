// AIR (All India Rank) Estimator & College Prediction Engine
// Uses log-linear interpolation from college tier data to estimate AIR
// and determines which colleges the student can realistically target.

import { FullExam, CollegeTier } from '../data/allExams';
import { examsData, ExamData } from '../data/exams';

export interface AIREstimate {
  estimated_air_low: number;
  estimated_air_high: number;
  estimated_air_mid: number;
  optimistic_air: number; // AIR after completing study tasks
  confidence_level: string;
}

export interface CollegePrediction {
  tier_name: string;
  qualifies: boolean;
  colleges: string[];
  rank_requirement: string;
  required_percentile?: number;
}

export interface ExamFeasibilityReport {
  exam_name: string;
  exam_category: string;
  conducting_body: string;
  predicted_score_percent: number;
  predicted_score_marks: number | null;
  total_marks: number | null;
  air_estimate: AIREstimate;
  optimistic_air: number;
  college_predictions: CollegePrediction[];
  overall_verdict: 'STRONG_MATCH' | 'COMPETITIVE' | 'STRETCH' | 'UNLIKELY';
  verdict_reasoning: string;
  sample_paper_url: string;
}

// Applicant estimates per exam
const EXAM_APPLICANT_ESTIMATES: Record<string, number> = {
  'JEE Main': 1200000,
  'JEE Advanced': 160000,
  'BITSAT': 280000,
  'NEET UG': 2000000,
  'CAT': 280000,
  'XAT': 100000,
  'CLAT UG': 75000,
  'AILET': 25000,
  'GATE (CSE)': 120000,
  'UPSC CSE': 1200000,
  'VITEEE': 250000,
  'MET (Manipal Entrance Test)': 100000,
  'SRMJEEE': 150000,
  'COMEDK UGET': 80000,
  'CUET UG': 1500000,
  'IPMAT (Indore)': 40000,
  'IPMAT (Rohtak)': 20000,
  'JIPMAT': 30000,
  'NPAT': 80000,
  'SET (Symbiosis)': 90000,
  'CLAT PG': 30000,
  'NEET PG': 200000,
  'NDA': 500000,
  'CDS': 400000,
};

function getApplicantCount(examName: string): number {
  if (EXAM_APPLICANT_ESTIMATES[examName]) return EXAM_APPLICANT_ESTIMATES[examName];
  const lowerName = examName.toLowerCase();
  for (const [key, val] of Object.entries(EXAM_APPLICANT_ESTIMATES)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return val;
    }
  }
  return 100000;
}

function parseRankFromTier(expectation: string, totalApplicants: number): { lowRank: number; highRank: number; requiredScorePct: number } {
  // Try "AIR X - Y" pattern
  const airMatch = expectation.match(/AIR\s*([\d,]+)\s*[-–]\s*([\d,]+)/i);
  if (airMatch) {
    const lowRank = parseInt(airMatch[1].replace(/,/g, ''));
    const highRank = parseInt(airMatch[2].replace(/,/g, ''));
    const percentile = (1 - highRank / totalApplicants) * 100;
    return { lowRank, highRank, requiredScorePct: Math.max(50, Math.round(percentile * 0.9)) };
  }

  // Try "AIR 1 - X" single bound
  const airSingle = expectation.match(/AIR\s*([\d,]+)/i);
  if (airSingle) {
    const highRank = parseInt(airSingle[1].replace(/,/g, ''));
    const percentile = (1 - highRank / totalApplicants) * 100;
    return { lowRank: 1, highRank, requiredScorePct: Math.max(50, Math.round(percentile * 0.9)) };
  }

  // Try percentile patterns "XX.X+ Percentile"
  const pctMatch = expectation.match(/([\d.]+)\+?\s*Percentile/i);
  if (pctMatch) {
    const minPct = parseFloat(pctMatch[1]);
    const highRank = Math.max(1, Math.round(totalApplicants * (1 - minPct / 100)));
    return { lowRank: 1, highRank, requiredScorePct: Math.round(minPct * 0.92) };
  }

  // Fallback
  return { lowRank: 1, highRank: Math.round(totalApplicants * 0.1), requiredScorePct: 75 };
}

export function estimateAIR(
  predictedScorePercent: number,
  examName: string,
  collegeTiers: CollegeTier[]
): AIREstimate {
  const totalApplicants = getApplicantCount(examName);
  
  // Logistic percentile curve
  const k = 0.085;
  const percentile = 100 / (1 + Math.exp(-k * (predictedScorePercent - 50)));
  const airFromPercentile = Math.max(1, Math.round(totalApplicants * (1 - percentile / 100)));

  const airLow = Math.max(1, Math.round(airFromPercentile * 0.75));
  const airHigh = Math.round(airFromPercentile * 1.35);

  // Optimistic AIR assuming tasklist completion (+12% score gain)
  const optimisticPercent = Math.min(99, predictedScorePercent + 12);
  const optPercentile = 100 / (1 + Math.exp(-k * (optimisticPercent - 50)));
  const optimisticAIR = Math.max(1, Math.round(totalApplicants * (1 - optPercentile / 100) * 0.65));

  const confidenceLevel = predictedScorePercent > 70 ? 'High' : predictedScorePercent > 50 ? 'Moderate' : 'Low';

  return {
    estimated_air_low: airLow,
    estimated_air_high: airHigh,
    estimated_air_mid: airFromPercentile,
    optimistic_air: optimisticAIR,
    confidence_level: confidenceLevel
  };
}

export function predictColleges(
  airEstimate: AIREstimate,
  predictedScorePercent: number,
  examName: string,
  collegeTiers: CollegeTier[]
): CollegePrediction[] {
  const totalApplicants = getApplicantCount(examName);

  return collegeTiers.map(tier => {
    const req = parseRankFromTier(tier.score_rank_expectation, totalApplicants);
    
    // Qualifies ONLY if predicted score meets required score % and AIR is within range
    const qualifies = (predictedScorePercent >= req.requiredScorePct) && (airEstimate.estimated_air_low <= req.highRank);

    return {
      tier_name: tier.tier,
      qualifies,
      colleges: tier.target_colleges,
      rank_requirement: tier.score_rank_expectation,
      required_percentile: req.requiredScorePct
    };
  });
}

export function generateFeasibilityReport(
  examName: string,
  predictedScorePercent: number,
  collegeTiers: CollegeTier[],
  examCategory: string,
  conductingBody: string,
  detailedExam?: ExamData
): ExamFeasibilityReport {
  const airEstimate = estimateAIR(predictedScorePercent, examName, collegeTiers);
  const collegePredictions = predictColleges(airEstimate, predictedScorePercent, examName, collegeTiers);
  const qualifiedTiers = collegePredictions.filter(c => c.qualifies);

  let verdict: ExamFeasibilityReport['overall_verdict'] = 'UNLIKELY';
  let verdictReasoning = '';

  if (qualifiedTiers.length >= collegePredictions.length * 0.7 && predictedScorePercent >= 75) {
    verdict = 'STRONG_MATCH';
    verdictReasoning = `With a predicted score of ${predictedScorePercent}% and Expected AIR ${airEstimate.estimated_air_mid.toLocaleString()} (Optimistic AIR: ${airEstimate.optimistic_air.toLocaleString()}), you qualify for ${qualifiedTiers.length} out of ${collegePredictions.length} college tiers.`;
  } else if (qualifiedTiers.length >= 1 || predictedScorePercent >= 58) {
    verdict = 'COMPETITIVE';
    verdictReasoning = `With a predicted score of ${predictedScorePercent}% and Expected AIR ${airEstimate.estimated_air_mid.toLocaleString()} (Optimistic AIR: ${airEstimate.optimistic_air.toLocaleString()}), strategic preparation can elevate your score to meet flagship campus cutoffs.`;
  } else if (predictedScorePercent >= 40) {
    verdict = 'STRETCH';
    verdictReasoning = `Current predicted score of ${predictedScorePercent}% places your Expected AIR at ${airEstimate.estimated_air_mid.toLocaleString()}. Reach targets require completing high-yield Pareto study tasks.`;
  } else {
    verdict = 'UNLIKELY';
    verdictReasoning = `Predicted score of ${predictedScorePercent}% requires foundational concept strengthening across core cognitive classes.`;
  }

  const samplePaperUrl = `https://www.google.com/search?q=${encodeURIComponent(examName + ' official sample paper mock test PDF pyq')}`;

  return {
    exam_name: examName,
    exam_category: examCategory,
    conducting_body: conductingBody,
    predicted_score_percent: predictedScorePercent,
    predicted_score_marks: detailedExam ? Math.round(predictedScorePercent / 100 * detailedExam.total_marks) : null,
    total_marks: detailedExam ? detailedExam.total_marks : null,
    air_estimate: airEstimate,
    optimistic_air: airEstimate.optimistic_air,
    college_predictions: collegePredictions,
    overall_verdict: verdict,
    verdict_reasoning: verdictReasoning,
    sample_paper_url: samplePaperUrl
  };
}
