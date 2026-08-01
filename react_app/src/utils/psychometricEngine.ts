// Psychometric Scoring Engine
// Scores the 10-question psychometric test and ranks 100 exams by cosine similarity

import { PsychometricVector } from '../data/psychometric';
import { allExams, FullExam, PsychometricAffinity } from '../data/allExams';

export interface PsychometricResult {
  vector: PsychometricVector;
  normalized: PsychometricVector;
  dominantDimension: string;
  dimensionBreakdown: { dimension: string; score: number; label: string }[];
}

export interface ExamRecommendation {
  exam: FullExam;
  affinityScore: number;    // cosine similarity 0–1
  matchPercent: number;      // affinityScore as percentage
  reasoning: string;
}

// -------------------------------------------
// 1. SCORE PSYCHOMETRIC RESPONSES
// -------------------------------------------
export function scorePsychometric(
  answers: { questionId: string; selectedLabel: string }[],
  questions: { id: string; options: { label: string; scores: Partial<PsychometricVector> }[] }[]
): PsychometricResult {
  const vector: PsychometricVector = { V_QUANT: 0, V_LAW: 0, V_MGMT: 0, V_GEN: 0 };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    const option = question.options.find(o => o.label === answer.selectedLabel);
    if (!option) return;

    if (option.scores.V_QUANT) vector.V_QUANT += option.scores.V_QUANT;
    if (option.scores.V_LAW) vector.V_LAW += option.scores.V_LAW;
    if (option.scores.V_MGMT) vector.V_MGMT += option.scores.V_MGMT;
    if (option.scores.V_GEN) vector.V_GEN += option.scores.V_GEN;
  });

  // Normalize to unit vector
  const magnitude = Math.sqrt(
    vector.V_QUANT ** 2 + vector.V_LAW ** 2 + vector.V_MGMT ** 2 + vector.V_GEN ** 2
  );
  const normalized: PsychometricVector = magnitude > 0
    ? {
        V_QUANT: vector.V_QUANT / magnitude,
        V_LAW: vector.V_LAW / magnitude,
        V_MGMT: vector.V_MGMT / magnitude,
        V_GEN: vector.V_GEN / magnitude
      }
    : { V_QUANT: 0.5, V_LAW: 0.5, V_MGMT: 0.5, V_GEN: 0.5 };

  // Find dominant dimension
  const dims = [
    { dimension: 'V_QUANT', score: vector.V_QUANT, label: 'Quantitative & Technical' },
    { dimension: 'V_LAW', score: vector.V_LAW, label: 'Legal & Analytical' },
    { dimension: 'V_MGMT', score: vector.V_MGMT, label: 'Management & Strategic' },
    { dimension: 'V_GEN', score: vector.V_GEN, label: 'General & Versatile' }
  ];
  dims.sort((a, b) => b.score - a.score);
  const dominantDimension = dims[0].label;

  return { vector, normalized, dominantDimension, dimensionBreakdown: dims };
}

// -------------------------------------------
// 2. COSINE SIMILARITY BETWEEN TWO VECTORS
// -------------------------------------------
function cosineSimilarity(a: PsychometricVector, b: PsychometricAffinity): number {
  const dot = a.V_QUANT * b.V_QUANT + a.V_LAW * b.V_LAW + a.V_MGMT * b.V_MGMT + a.V_GEN * b.V_GEN;
  const magA = Math.sqrt(a.V_QUANT ** 2 + a.V_LAW ** 2 + a.V_MGMT ** 2 + a.V_GEN ** 2);
  const magB = Math.sqrt(b.V_QUANT ** 2 + b.V_LAW ** 2 + b.V_MGMT ** 2 + b.V_GEN ** 2);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

import { computeLearnedAffinityMultiplier, UserInterestRecord } from './userInterestModel';

// -------------------------------------------
// 3. RANK ALL 100 EXAMS → TOP 10 (5:3:2 DIVERSE CATEGORY SPLIT)
// -------------------------------------------
export function rankExams(
  result: PsychometricResult,
  interestRecord?: UserInterestRecord
): ExamRecommendation[] {
  const scored: ExamRecommendation[] = allExams.map(exam => {
    const baseScore = cosineSimilarity(result.normalized, exam.psychometric_affinity);
    const learnedMultiplier = interestRecord ? computeLearnedAffinityMultiplier(exam, interestRecord) : 1.0;
    
    const adjustedScore = Math.min(1.0, baseScore * learnedMultiplier);
    
    return {
      exam,
      affinityScore: parseFloat(adjustedScore.toFixed(4)),
      matchPercent: parseFloat((adjustedScore * 100).toFixed(1)),
      reasoning: generateReasoning(result, exam, adjustedScore, learnedMultiplier)
    };
  });

  // Group by category
  const categoryGroups: Record<string, ExamRecommendation[]> = {};
  scored.forEach(item => {
    const cat = item.exam.category;
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(item);
  });

  // Sort exams within each category descending
  Object.keys(categoryGroups).forEach(cat => {
    categoryGroups[cat].sort((a, b) => b.affinityScore - a.affinityScore);
  });

  // Rank categories by their top exam score
  const rankedCategories = Object.keys(categoryGroups).sort((a, b) => {
    return categoryGroups[b][0].affinityScore - categoryGroups[a][0].affinityScore;
  });

  const selected: ExamRecommendation[] = [];
  const selectedExamIds = new Set<number>();

  const targetSplits = [5, 3, 2]; // 5:3:2 split across top 3 categories

  targetSplits.forEach((quota, i) => {
    const cat = rankedCategories[i];
    if (cat && categoryGroups[cat]) {
      const added = categoryGroups[cat].slice(0, quota);
      added.forEach(item => {
        if (!selectedExamIds.has(item.exam.exam_id)) {
          selected.push(item);
          selectedExamIds.add(item.exam.exam_id);
        }
      });
    }
  });

  // If we still need more exams to reach 10, fill from highest remaining
  if (selected.length < 10) {
    const remaining = scored.filter(item => !selectedExamIds.has(item.exam.exam_id));
    remaining.sort((a, b) => b.affinityScore - a.affinityScore);
    selected.push(...remaining.slice(0, 10 - selected.length));
  }

  // Sort final 10 exams descending by score
  selected.sort((a, b) => b.affinityScore - a.affinityScore);

  return selected.slice(0, 10);
}

// -------------------------------------------
// 4. REASONING STRING GENERATOR
// -------------------------------------------
function generateReasoning(
  result: PsychometricResult,
  exam: FullExam,
  score: number,
  learnedMultiplier: number = 1.0
): string {
  const vec = result.vector;
  const aff = exam.psychometric_affinity;

  // Find the strongest matching dimension
  const dims: { key: keyof PsychometricVector; studentScore: number; examAffinity: number; label: string }[] = [
    { key: 'V_QUANT', studentScore: vec.V_QUANT, examAffinity: aff.V_QUANT, label: 'quantitative reasoning' },
    { key: 'V_LAW', studentScore: vec.V_LAW, examAffinity: aff.V_LAW, label: 'legal & analytical reasoning' },
    { key: 'V_MGMT', studentScore: vec.V_MGMT, examAffinity: aff.V_MGMT, label: 'management & strategic thinking' },
    { key: 'V_GEN', studentScore: vec.V_GEN, examAffinity: aff.V_GEN, label: 'general versatility' }
  ];

  // Sort by product of student score and exam affinity (strongest alignment)
  dims.sort((a, b) => (b.studentScore * b.examAffinity) - (a.studentScore * a.examAffinity));
  const top = dims[0];
  const second = dims[1];

  const matchStrength = score >= 0.85 ? 'exceptionally strong' : score >= 0.7 ? 'strong' : score >= 0.55 ? 'moderate' : 'developing';

  let reasoning = `Your ${matchStrength} ${top.label} profile (score: ${top.studentScore}) aligns with ${exam.exam_name}'s emphasis on ${top.label}.`;

  if (second.studentScore > 0 && second.examAffinity > 0.3) {
    reasoning += ` Your ${second.label} aptitude further complements this exam's structure.`;
  }

  if (learnedMultiplier > 1.05) {
    reasoning += ` [Learned Pattern: +${Math.round((learnedMultiplier - 1) * 100)}% boost based on demonstrated user interest & engagement]`;
  }

  return reasoning;
}
