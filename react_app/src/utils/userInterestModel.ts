// User Behavioral Interest Model
// Tracks the delta between a user's initial recorded psychometric vector 
// and their demonstrated interest actions (e.g. expanding an exam card, retaking tests, spending time on specific exam categories).

import { PsychometricVector } from '../data/psychometric';
import { FullExam } from '../data/allExams';

export interface UserInterestRecord {
  initialVector: PsychometricVector;
  retakeCount: number;
  examEngagement: Record<number, number>; // exam_id -> click/view engagement weight (1.0 = base, 2.0 = high interest)
  learnedCategoryBoosts: Record<string, number>; // category -> boost factor (1.0 to 1.5)
}

const STORAGE_KEY = 'antigravity_user_interest_model_v1';

export function getStoredInterestRecord(initialVector: PsychometricVector): UserInterestRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    // fallback
  }

  return {
    initialVector,
    retakeCount: 0,
    examEngagement: {},
    learnedCategoryBoosts: {}
  };
}

export function recordExamInterest(exam: FullExam, currentRecord: UserInterestRecord): UserInterestRecord {
  const newEngagement = { ...currentRecord.examEngagement };
  const currentVal = newEngagement[exam.exam_id] || 0;
  newEngagement[exam.exam_id] = currentVal + 1;

  // Learn category boost
  const categoryBoosts = { ...currentRecord.learnedCategoryBoosts };
  const currentCatVal = categoryBoosts[exam.category] || 1.0;
  categoryBoosts[exam.category] = Math.min(1.5, parseFloat((currentCatVal + 0.08).toFixed(2)));

  const updated: UserInterestRecord = {
    ...currentRecord,
    examEngagement: newEngagement,
    learnedCategoryBoosts: categoryBoosts
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  return updated;
}

export function recordTestRetake(currentRecord: UserInterestRecord): UserInterestRecord {
  const updated: UserInterestRecord = {
    ...currentRecord,
    retakeCount: currentRecord.retakeCount + 1
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

export function computeLearnedAffinityMultiplier(exam: FullExam, record: UserInterestRecord): number {
  const catBoost = record.learnedCategoryBoosts[exam.category] || 1.0;
  const examEngage = record.examEngagement[exam.exam_id] || 0;
  const engageBoost = 1.0 + Math.min(0.25, examEngage * 0.05);

  return parseFloat((catBoost * engageBoost).toFixed(3));
}
