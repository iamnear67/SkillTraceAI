// Prior Information Test Engine
// Uses 15-class cognitive diagnostic answers to predict per-subtopic % scores

import { classPriors } from '../data/priors';
import { subtopicsData, Subtopic } from '../data/subtopics';
import { examsData } from '../data/exams';

export interface ClassAbility {
  class_id: string;
  class_name: string;
  ability: number; // 0–1 raw ability estimate
  confidence: number;
}

export interface SubtopicPrediction {
  subtopic_id: string;
  subtopic_name: string;
  domain: string;
  primary_class: string;
  secondary_class: string | null;
  complexity: string;
  predicted_percent: number; // 0–100 predicted % correct
  confidence: number;
}

export interface ExamSubtopicPredictions {
  exam_id: string;
  exam_name: string;
  subtopic_predictions: SubtopicPrediction[];
  aggregate_predicted_score_percent: number;
  aggregate_confidence: number;
}

// -------------------------------------------
// 1. COMPUTE CLASS-LEVEL ABILITY FROM DIAGNOSTIC
// -------------------------------------------
export function computeClassAbilities(
  diagnosticAnswers: { id: string; correct: boolean; timeSec: number }[]
): ClassAbility[] {
  return classPriors.map(prior => {
    const classNum = prior.class_id.split('_')[1];
    // Match any question belonging to this class (e.g. DIAG_C01, DIAG_C01_L1, DIAG_C01_L2, DIAG_C01_L3)
    const classAnswers = diagnosticAnswers.filter(a => 
      a.id.startsWith(`DIAG_C${classNum}`)
    );

    if (classAnswers.length === 0) {
      return {
        class_id: prior.class_id,
        class_name: prior.class_name,
        ability: 0.45,
        confidence: 0.3
      };
    }

    let totalWeight = 0;
    let weightedAbilitySum = 0;

    classAnswers.forEach(answer => {
      // Determine question level weight (L1=0.3, L2=0.35, L3=0.35)
      const levelWeight = answer.id.includes('_L3') ? 0.35 : answer.id.includes('_L2') ? 0.35 : 0.30;
      const targetTime = 20;
      const speedRatio = answer.timeSec / targetTime;

      let itemAbility = 0.20; // default for wrong
      if (answer.correct) {
        itemAbility = speedRatio < 0.8 ? 0.90 : speedRatio < 1.2 ? 0.75 : 0.60;
      } else {
        itemAbility = speedRatio < 0.5 ? 0.30 : 0.15; // 0 marks / wrong
      }

      weightedAbilitySum += itemAbility * levelWeight;
      totalWeight += levelWeight;
    });

    let rawAbility = totalWeight > 0 ? weightedAbilitySum / totalWeight : 0.45;
    rawAbility *= Math.min(1.15, prior.weight_multiplier_W);
    const clampedAbility = Math.min(0.95, Math.max(0.05, rawAbility));
    const confidence = Math.min(0.92, 0.4 + classAnswers.length * 0.15);

    return {
      class_id: prior.class_id,
      class_name: prior.class_name,
      ability: parseFloat(clampedAbility.toFixed(3)),
      confidence: parseFloat(confidence.toFixed(3))
    };
  });
}

// -------------------------------------------
// 2. PREDICT SUBTOPIC % SCORES FOR AN EXAM
// -------------------------------------------
export function predictSubtopicScores(
  classAbilities: ClassAbility[],
  examId: string
): ExamSubtopicPredictions | null {
  const exam = examsData.find(e => e.id === examId);
  if (!exam) return null;

  // Collect all cognitive classes tested in this exam
  const classesTested = new Set<string>();
  exam.subjects.forEach(subject => {
    subject.cognitive_classes.forEach(c => classesTested.add(c));
  });

  // Filter subtopics relevant to this exam
  const examSubtopics = subtopicsData.filter(sub =>
    classesTested.has(sub.primary_cognitive_class)
  );

  const predictions: SubtopicPrediction[] = examSubtopics.map(sub => {
    const primaryAbility = classAbilities.find(a => a.class_id === sub.primary_cognitive_class);
    const secondaryAbility = classAbilities.find(a => a.class_id === sub.secondary_cognitive_class);

    const pAbility = primaryAbility ? primaryAbility.ability : 0.45;
    const sAbility = secondaryAbility ? secondaryAbility.ability : 0.45;

    // Weighted combination: 70% primary + 30% secondary
    let rawPrediction = 0.7 * pAbility + 0.3 * sAbility;

    // Adjust by complexity tier
    const complexityMultiplier =
      sub.cognitive_complexity_tier === 'EASY' ? 1.15 :
      sub.cognitive_complexity_tier === 'MEDIUM' ? 1.0 :
      0.75; // HARD

    rawPrediction *= complexityMultiplier;

    // Clamp to [5, 95]
    const predictedPercent = Math.min(95, Math.max(5, Math.round(rawPrediction * 100)));

    // Confidence is the average of the two class confidences
    const pConf = primaryAbility ? primaryAbility.confidence : 0.3;
    const sConf = secondaryAbility ? secondaryAbility.confidence : 0.3;
    const confidence = 0.7 * pConf + 0.3 * sConf;

    return {
      subtopic_id: sub.subtopic_id,
      subtopic_name: sub.name,
      domain: sub.domain,
      primary_class: sub.primary_cognitive_class,
      secondary_class: sub.secondary_cognitive_class,
      complexity: sub.cognitive_complexity_tier,
      predicted_percent: predictedPercent,
      confidence: parseFloat(confidence.toFixed(3))
    };
  });

  // Aggregate exam-level prediction
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let totalConfidence = 0;

  predictions.forEach(p => {
    totalWeightedScore += p.predicted_percent;
    totalWeight += 1;
    totalConfidence += p.confidence;
  });

  const aggregatePercent = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  const aggregateConfidence = totalWeight > 0 ? totalConfidence / totalWeight : 0;

  return {
    exam_id: examId,
    exam_name: exam.exam_name,
    subtopic_predictions: predictions,
    aggregate_predicted_score_percent: aggregatePercent,
    aggregate_confidence: parseFloat(aggregateConfidence.toFixed(3))
  };
}

// -------------------------------------------
// 3. PREDICT FOR ALL RECOMMENDED EXAMS
// -------------------------------------------
export function predictAllExams(
  classAbilities: ClassAbility[],
  examIds: string[]
): ExamSubtopicPredictions[] {
  const results: ExamSubtopicPredictions[] = [];
  examIds.forEach(id => {
    const prediction = predictSubtopicScores(classAbilities, id);
    if (prediction) results.push(prediction);
  });
  return results;
}
