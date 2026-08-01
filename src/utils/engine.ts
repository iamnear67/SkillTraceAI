import { classPriors, CognitiveClassPrior } from '../data/priors';
import { subtopicsData, Subtopic } from '../data/subtopics';
import { examsData, ExamData } from '../data/exams';

export interface CalibratedClass {
  class_id: string;
  class_name: string;
  calibrated_alpha: number;
  calibrated_lambda: number;
  stability_S_days: number;
  variance: number;
  confidence_score: number;
  weight_multiplier_W: number;
  decay_multiplier_D: number;
}

export interface CalibratedProfile {
  student_id: string;
  global_alpha: number;
  global_lambda: number;
  revision_efficiency: number;
  class_evaluations: CalibratedClass[];
}

export interface PredictionResult {
  exam_id: string;
  exam_name: string;
  baseline_score: number;
  optimized_score: number;
  total_marks: number;
  cutoff: number;
  feasibility_index: number; // 0 to 1
  feasibility_status: 'HIGHLY_FEASIBLE' | 'FEASIBLE_WITH_EFFORT' | 'LOW_FEASIBILITY';
  confidence: number;
  credible_interval_95: [number, number];
}

export interface Allocation {
  subtopic_id: string;
  subtopic_name: string;
  domain: string;
  recommendation: 'DEEP_MASTERY' | 'PARETO_PRUNED' | 'SKIM_ONLY' | 'SKIP';
  assigned_tokens: number;
  expected_yield_marks: number;
  reasoning: string;
}

export interface OptimizationResult {
  summary: {
    student_id: string;
    target_exam: string;
    total_tokens_budget: number;
    allocated_tokens: number;
    projected_score: number;
    cutoff: number;
    feasibility_status: 'HIGHLY_FEASIBLE' | 'FEASIBLE_WITH_EFFORT' | 'LOW_FEASIBILITY';
  };
  allocations: Allocation[];
}

// ----------------------------------------------------
// 1. PHASE 1: NOVEL LEARNING TASK CALIBRATION
// ----------------------------------------------------
export function calibrateSyntheticRules(
  answers: { id: string; correct: boolean; timeSec: number }[]
): { alpha: number; lambda: number; revisionEfficiency: number } {
  // Base estimates
  let correctCount = 0;
  let totalTime = 0;
  answers.forEach(a => {
    if (a.correct) correctCount++;
    totalTime += a.timeSec;
  });

  const avgTime = answers.length > 0 ? totalTime / answers.length : 15;

  // 1. Global Learning Rate (alpha)
  // Higher accuracy and lower response time = higher learning rate
  // Standard alpha is around 0.45. Bounded [0.2, 0.8]
  let alpha = 0.42; // starting baseline
  const accuracy = answers.length > 0 ? correctCount / answers.length : 0.5;
  alpha += (accuracy - 0.5) * 0.3; // adjusts +/- 0.15
  alpha -= (avgTime - 15) * 0.005; // faster speed increases alpha
  alpha = Math.max(0.25, Math.min(0.75, alpha));

  // 2. Global Decay Rate (lambda)
  // Check SYN_01 (initial rule test) and SYN_04 (delayed rule test)
  const syn1 = answers.find(a => a.id === "SYN_01");
  const syn4 = answers.find(a => a.id === "SYN_04");
  let lambda = 0.038; // starting baseline

  if (syn1 && syn4) {
    if (syn1.correct && !syn4.correct) {
      // Forgot the rule over the delay => High decay
      lambda = 0.052;
    } else if (syn1.correct && syn4.correct) {
      // Retained the rule => Low decay
      lambda = 0.024;
      // Bonus if answered fast
      if (syn4.timeSec < 12) lambda -= 0.004;
    } else if (!syn1.correct && syn4.correct) {
      // Learnt it late => Moderate decay
      lambda = 0.035;
    } else {
      // Both wrong => Moderate-high decay
      lambda = 0.045;
    }
  }

  // 3. Revision Efficiency
  // Check questions where they got incorrect answers and recovered.
  // We look at cases where they got a question wrong, and then got the next one of similar type correct.
  // In our synthetic set, let's look at incorrect answers followed by correct ones.
  let incorrectCount = 0;
  let recoveredCount = 0;
  for (let i = 0; i < answers.length - 1; i++) {
    if (!answers[i].correct) {
      incorrectCount++;
      if (answers[i + 1].correct) {
        recoveredCount++;
      }
    }
  }

  let revisionEfficiency = 0.80; // default
  if (incorrectCount > 0) {
    revisionEfficiency = recoveredCount / incorrectCount;
    // Bound it sensibly
    revisionEfficiency = Math.max(0.40, Math.min(0.95, revisionEfficiency));
  } else {
    // If they got everything correct first try, revision efficiency is excellent
    revisionEfficiency = 0.92;
  }

  return {
    alpha: parseFloat(alpha.toFixed(3)),
    lambda: parseFloat(lambda.toFixed(4)),
    revisionEfficiency: parseFloat(revisionEfficiency.toFixed(2))
  };
}

// ----------------------------------------------------
// 2. PHASE 2: COGNITIVE CALIBRATION (BAYESIAN UPDATES)
// ----------------------------------------------------
export function calibrateCognitiveProfile(
  syntheticMetrics: { alpha: number; lambda: number; revisionEfficiency: number },
  diagnosticAnswers: { id: string; correct: boolean; timeSec: number }[]
): CalibratedProfile {
  const { alpha: alphaGlobal, lambda: lambdaGlobal, revisionEfficiency } = syntheticMetrics;

  const classEvaluations: CalibratedClass[] = classPriors.map(prior => {
    // Find the diagnostic question corresponding to this class
    const questionId = `DIAG_C${prior.class_id.split('_')[1]}`;
    const answer = diagnosticAnswers.find(a => a.id === questionId);

    let weightMultiplier = prior.weight_multiplier_W;
    let decayMultiplier = prior.decay_multiplier_D;
    let observationsCount = 0;

    if (answer) {
      observationsCount = 1;
      const targetTime = 18; // standard baseline seconds
      const speedFactor = Math.max(0.4, Math.min(2.0, answer.timeSec / targetTime));

      if (answer.correct) {
        // High accuracy: increase weight multiplier, decrease decay multiplier
        const speedBonus = speedFactor < 1.0 ? (1.0 - speedFactor) * 0.3 : 0;
        weightMultiplier *= (1.15 + speedBonus);
        decayMultiplier *= (0.80 - speedBonus * 0.2);
      } else {
        // Incorrect: decrease weight multiplier, increase decay multiplier
        const speedPenalty = speedFactor > 1.0 ? (speedFactor - 1.0) * 0.15 : 0;
        weightMultiplier *= (0.75 - speedPenalty);
        decayMultiplier *= (1.30 + speedPenalty * 0.3);
      }
    }

    // Clamp multipliers to keep values realistic
    weightMultiplier = Math.max(0.5, Math.min(1.8, weightMultiplier));
    decayMultiplier = Math.max(0.4, Math.min(2.2, decayMultiplier));

    // Bayesian updates for variance
    // variance = prior_variance * exp(-0.15 * observations_count)
    const variance = prior.prior_variance * Math.exp(-0.15 * observationsCount);
    const confidenceScore = 1.0 - Math.sqrt(variance);

    // Calibrated local parameters
    const calibratedAlpha = alphaGlobal * weightMultiplier;
    const calibratedLambda = lambdaGlobal * decayMultiplier;
    // stability = S0 * (W / D)
    const stabilityS = prior.initial_stability_S0_days * (weightMultiplier / decayMultiplier);

    return {
      class_id: prior.class_id,
      class_name: prior.class_name,
      calibrated_alpha: parseFloat(calibratedAlpha.toFixed(3)),
      calibrated_lambda: parseFloat(calibratedLambda.toFixed(4)),
      stability_S_days: parseFloat(stabilityS.toFixed(1)),
      variance: parseFloat(variance.toFixed(3)),
      confidence_score: parseFloat(confidenceScore.toFixed(3)),
      weight_multiplier_W: parseFloat(weightMultiplier.toFixed(2)),
      decay_multiplier_D: parseFloat(decayMultiplier.toFixed(2))
    };
  });

  return {
    student_id: `STU_${Math.floor(Math.random() * 9000 + 1000)}`,
    global_alpha: alphaGlobal,
    global_lambda: lambdaGlobal,
    revision_efficiency: revisionEfficiency,
    class_evaluations: classEvaluations
  };
}

// ----------------------------------------------------
// 3. PREDICTION ENGINE (GOMPERTZ + FSRS DECAY)
// ----------------------------------------------------
export function runPredictionEngine(
  profile: CalibratedProfile,
  exam: ExamData,
  constraints: { daysRemaining: number; hoursPerDay: number }
): PredictionResult {
  const { daysRemaining, hoursPerDay } = constraints;
  
  // 1. Calculate Subtopic Weights in the Exam
  // We map the exam's subject weights down to subtopics
  const examSubtopics = getSubtopicsForExam(exam);
  if (examSubtopics.length === 0) {
    // Return dummy result if no subtopics found (fallback)
    return {
      exam_id: exam.id,
      exam_name: exam.exam_name,
      baseline_score: 0,
      optimized_score: 0,
      total_marks: exam.total_marks,
      cutoff: exam.cutoff_tier1,
      feasibility_index: 0,
      feasibility_status: 'LOW_FEASIBILITY',
      confidence: 0.5,
      credible_interval_95: [0, 0]
    };
  }

  // Divide subject weights equally among subtopics in that subject domain
  const subtopicExamWeights: { [subtopicId: string]: number } = {};
  exam.subjects.forEach(subject => {
    // Find subtopics belonging to cognitive classes of this subject
    const subjectSubtopics = examSubtopics.filter(sub => 
      subject.cognitive_classes.includes(sub.primary_cognitive_class)
    );

    if (subjectSubtopics.length > 0) {
      const weightPerSubtopic = (subject.weight / 100) / subjectSubtopics.length;
      subjectSubtopics.forEach(sub => {
        subtopicExamWeights[sub.subtopic_id] = weightPerSubtopic;
      });
    }
  });

  // Normalize weights in case some subtopics overlap or are missing
  let totalWeightSum = 0;
  Object.values(subtopicExamWeights).forEach(w => totalWeightSum += w);
  if (totalWeightSum > 0) {
    Object.keys(subtopicExamWeights).forEach(id => {
      subtopicExamWeights[id] = subtopicExamWeights[id] / totalWeightSum;
    });
  }

  // 2. Calculate baseline score (as they are, zero study hours)
  // We assume baseline mastery for each subtopic is based on their diagnostic score in that cognitive class
  let baselineScoreFraction = 0;
  let sumVariance = 0;

  examSubtopics.forEach(sub => {
    const classProfile = profile.class_evaluations.find(c => c.class_id === sub.primary_cognitive_class);
    const weight = subtopicExamWeights[sub.subtopic_id] || 0;
    if (!classProfile || weight === 0) return;

    // Baseline mastery M0: we model it as starting at Gompertz curve at k = 0
    // M0 is calibrated by correctness of that class. Let's say:
    // If W > 1.0, baseline is around 0.35. If W < 1.0, baseline is around 0.15.
    const baselineMastery = Math.min(0.60, Math.max(0.10, 0.25 * classProfile.weight_multiplier_W));
    
    // Retrievability on exam day D (without study, it decays from day 0)
    // S0 is stability.
    const stability = classProfile.stability_S_days;
    // R(t, S) = (1 + 0.19 * (t / S))^-1
    const retrievability = 1 / (1 + 0.19 * (daysRemaining / stability));

    baselineScoreFraction += weight * baselineMastery * retrievability;
    
    // Aggregate variance for credible intervals
    sumVariance += Math.pow(weight * classProfile.variance, 2);
  });

  const baselineScore = Math.round(baselineScoreFraction * exam.total_marks);

  // 3. Calculate optimized score (after optimizer allocates tokens)
  const optResult = runStudyOptimizer(profile, exam, constraints);
  const optimizedScore = optResult.summary.projected_score;

  // Feasibility status check
  const cutoff = exam.cutoff_tier1;
  const feasibilityIndex = Math.min(1.0, Math.max(0.0, optimizedScore / cutoff));
  let feasibilityStatus: 'HIGHLY_FEASIBLE' | 'FEASIBLE_WITH_EFFORT' | 'LOW_FEASIBILITY' = 'LOW_FEASIBILITY';

  if (optimizedScore >= cutoff * 1.05) {
    feasibilityStatus = 'HIGHLY_FEASIBLE';
  } else if (optimizedScore >= cutoff * 0.85) {
    feasibilityStatus = 'FEASIBLE_WITH_EFFORT';
  }

  // 95% Credible interval calculation
  const totalStdDev = Math.sqrt(sumVariance);
  const zScore = 1.96;
  const rawIntervalWidth = zScore * totalStdDev * exam.total_marks;
  
  // The credible interval is centered on the optimized score but can be clamped to valid bounds [0, total_marks]
  const lowerBound = Math.max(0, Math.round(optimizedScore - rawIntervalWidth));
  const upperBound = Math.min(exam.total_marks, Math.round(optimizedScore + rawIntervalWidth));

  // Overall confidence in this prediction
  let totalConfidence = 0;
  let activeClassesCount = 0;
  profile.class_evaluations.forEach(c => {
    // Check if this class is tested in this exam
    const isTested = exam.subjects.some(s => s.cognitive_classes.includes(c.class_id));
    if (isTested) {
      totalConfidence += c.confidence_score;
      activeClassesCount++;
    }
  });
  const overallConfidence = activeClassesCount > 0 ? totalConfidence / activeClassesCount : 0.85;

  return {
    exam_id: exam.id,
    exam_name: exam.exam_name,
    baseline_score: baselineScore,
    optimized_score: optimizedScore,
    total_marks: exam.total_marks,
    cutoff: cutoff,
    feasibility_index: parseFloat(feasibilityIndex.toFixed(2)),
    feasibility_status: feasibilityStatus,
    confidence: parseFloat(overallConfidence.toFixed(3)),
    credible_interval_95: [lowerBound, upperBound]
  };
}

// ----------------------------------------------------
// 4. AI STUDY OPTIMIZER (GREEDY KNAPSACK SOLVER)
// ----------------------------------------------------
export function runStudyOptimizer(
  profile: CalibratedProfile,
  exam: ExamData,
  constraints: { daysRemaining: number; hoursPerDay: number }
): OptimizationResult {
  const { daysRemaining, hoursPerDay } = constraints;
  
  // Total tokens budget (assuming 10 tokens per hour, e.g. 3 hours/day = 30 tokens/day)
  const totalTokensBudget = Math.round(daysRemaining * hoursPerDay * 10);

  // Find subtopics for the exam
  const examSubtopics = getSubtopicsForExam(exam);
  if (examSubtopics.length === 0) {
    return {
      summary: {
        student_id: profile.student_id,
        target_exam: exam.exam_name,
        total_tokens_budget: totalTokensBudget,
        allocated_tokens: 0,
        projected_score: 0,
        cutoff: exam.cutoff_tier1,
        feasibility_status: 'LOW_FEASIBILITY'
      },
      allocations: []
    };
  }

  // Calculate subject/domain weights and map to subtopics
  const subtopicExamWeights: { [subtopicId: string]: number } = {};
  exam.subjects.forEach(subject => {
    const subjectSubtopics = examSubtopics.filter(sub => 
      subject.cognitive_classes.includes(sub.primary_cognitive_class)
    );
    if (subjectSubtopics.length > 0) {
      const weightPerSubtopic = (subject.weight / 100) / subjectSubtopics.length;
      subjectSubtopics.forEach(sub => {
        subtopicExamWeights[sub.subtopic_id] = weightPerSubtopic;
      });
    }
  });

  // Normalize subtopic weights
  let totalWeightSum = 0;
  Object.values(subtopicExamWeights).forEach(w => totalWeightSum += w);
  if (totalWeightSum > 0) {
    Object.keys(subtopicExamWeights).forEach(id => {
      subtopicExamWeights[id] = subtopicExamWeights[id] / totalWeightSum;
    });
  }

  // Define strategy tiers for subtopic study
  // 1. SKIP (tier 0)
  // 2. SKIM (tier 1)
  // 3. PARETO (tier 2)
  // 4. DEEP (tier 3)
  
  const getTierMasteryAndTokens = (sub: Subtopic, tier: number, calibratedAlpha: number, S_days: number) => {
    const costFactor = sub.cognitive_complexity_tier === 'HARD' ? 1.4 : sub.cognitive_complexity_tier === 'MEDIUM' ? 1.0 : 0.7;
    const baseCost = sub.base_token_cost * costFactor * 10; // scaled to token space

    let tokens = 0;
    let expectedMastery = 0.15; // default guess rate
    let stabilityFactor = 0.1; // base memory decay stability

    if (tier === 1) {
      // Skim Only
      tokens = Math.round(baseCost * 0.25);
      expectedMastery = 0.40;
      stabilityFactor = 0.4;
    } else if (tier === 2) {
      // Pareto Pruned (80% yield for 50% tokens)
      tokens = Math.round(baseCost * 0.50);
      expectedMastery = 0.80;
      stabilityFactor = 1.0;
    } else if (tier === 3) {
      // Deep Mastery
      tokens = Math.round(baseCost * 1.0);
      expectedMastery = 0.95;
      stabilityFactor = 2.5;
    }

    // Apply student's custom curve (Gompertz Growth) if studied
    if (tokens > 0) {
      // Gompertz: M(k) = K * exp(-b * exp(-alpha * k))
      // K is prior K
      const classPrior = classPriors.find(c => c.class_id === sub.primary_cognitive_class);
      const K = classPrior ? classPrior.asymptote_K : 0.90;
      
      // b = 2.50 displacement
      expectedMastery = K * Math.exp(-2.5 * Math.exp(-calibratedAlpha * (tokens / 10)));
    }

    // Apply memory decay factor based on stability
    // R(t) = (1 + 0.19 * (t / S))^-1
    // We assume the topic is studied at an average day during preparation
    // Average delay to exam is daysRemaining / 2 (spaced repetition assumption)
    const averageDelayDays = daysRemaining / 2;
    const S = S_days * stabilityFactor;
    const retrievability = tokens > 0 ? (1 / (1 + 0.19 * (averageDelayDays / S))) : 0.15; // low retrievability if skip

    const netRetainedMastery = expectedMastery * retrievability;

    return { tokens, mastery: netRetainedMastery };
  };

  // Setup initial allocations: All subtopics start at tier 0 (SKIP)
  const currentTiers: { [subtopicId: string]: number } = {};
  examSubtopics.forEach(sub => {
    currentTiers[sub.subtopic_id] = 0;
  });

  let allocatedTokens = 0;

  // Greedy Knapsack optimizer
  // We look for the best "upgrade" that yields the maximum expected marks per token.
  while (allocatedTokens < totalTokensBudget) {
    let bestUpgrade: { subtopicId: string; nextTier: number; efficiency: number; tokensDiff: number } | null = null;

    for (let i = 0; i < examSubtopics.length; i++) {
      const sub = examSubtopics[i];
      const currentTier = currentTiers[sub.subtopic_id];
      if (currentTier >= 3) continue; // already at DEEP

      const nextTier = currentTier + 1;
      const classProfile = profile.class_evaluations.find(c => c.class_id === sub.primary_cognitive_class);
      if (!classProfile) continue;

      const currentStats = getTierMasteryAndTokens(sub, currentTier, classProfile.calibrated_alpha, classProfile.stability_S_days);
      const nextStats = getTierMasteryAndTokens(sub, nextTier, classProfile.calibrated_alpha, classProfile.stability_S_days);

      const tokensDiff = nextStats.tokens - currentStats.tokens;
      const masteryDiff = nextStats.mastery - currentStats.mastery;
      
      const subWeight = subtopicExamWeights[sub.subtopic_id] || 0;
      const marksDiff = masteryDiff * subWeight * exam.total_marks;

      const efficiency = tokensDiff > 0 ? marksDiff / tokensDiff : 0;

      if (efficiency > 0 && (bestUpgrade === null || efficiency > bestUpgrade.efficiency)) {
        // Ensure we don't exceed the token budget
        if (allocatedTokens + tokensDiff <= totalTokensBudget) {
          bestUpgrade = {
            subtopicId: sub.subtopic_id,
            nextTier: nextTier,
            efficiency: efficiency,
            tokensDiff: tokensDiff
          };
        }
      }
    }

    if (bestUpgrade === null) {
      // No more upgrades fit or possible
      break;
    }

    // Apply the best upgrade
    currentTiers[bestUpgrade.subtopicId] = bestUpgrade.nextTier;
    allocatedTokens += bestUpgrade.tokensDiff;
  }

  // Create allocation output
  const allocations: Allocation[] = examSubtopics.map(sub => {
    const tier = currentTiers[sub.subtopic_id];
    const classProfile = profile.class_evaluations.find(c => c.class_id === sub.primary_cognitive_class)!;
    
    const stats = getTierMasteryAndTokens(sub, tier, classProfile.calibrated_alpha, classProfile.stability_S_days);
    const subWeight = subtopicExamWeights[sub.subtopic_id] || 0;
    const yieldMarks = stats.mastery * subWeight * exam.total_marks;

    let recommendation: 'DEEP_MASTERY' | 'PARETO_PRUNED' | 'SKIM_ONLY' | 'SKIP' = 'SKIP';
    let reasoning = "Low expected marks return per hour invested. Reallocated tokens to high-yield topics.";

    if (tier === 1) {
      recommendation = 'SKIM_ONLY';
      reasoning = "Formula scan and direct retrieval focus. Fast coverage for simple conceptual questions.";
    } else if (tier === 2) {
      recommendation = 'PARETO_PRUNED';
      reasoning = "Pareto pruned strategy. Spending 50% time locks in ~80% of marks, preserving budget for core topics.";
    } else if (tier === 3) {
      recommendation = 'DEEP_MASTERY';
      reasoning = "High weightage and high student tractability. Best returns on deep conceptual understanding.";
    }

    return {
      subtopic_id: sub.subtopic_id,
      subtopic_name: sub.name,
      domain: sub.domain,
      recommendation,
      assigned_tokens: stats.tokens,
      expected_yield_marks: parseFloat(yieldMarks.toFixed(2)),
      reasoning
    };
  });

  // Calculate final optimized projected score
  let totalProjectedScoreFraction = 0;
  allocations.forEach(a => {
    totalProjectedScoreFraction += a.expected_yield_marks;
  });
  const projectedScore = Math.min(exam.total_marks, Math.round(totalProjectedScoreFraction));

  const cutoff = exam.cutoff_tier1;
  let feasibilityStatus: 'HIGHLY_FEASIBLE' | 'FEASIBLE_WITH_EFFORT' | 'LOW_FEASIBILITY' = 'LOW_FEASIBILITY';
  if (projectedScore >= cutoff * 1.05) {
    feasibilityStatus = 'HIGHLY_FEASIBLE';
  } else if (projectedScore >= cutoff * 0.85) {
    feasibilityStatus = 'FEASIBLE_WITH_EFFORT';
  }

  return {
    summary: {
      student_id: profile.student_id,
      target_exam: exam.exam_name,
      total_tokens_budget: totalTokensBudget,
      allocated_tokens: allocatedTokens,
      projected_score: projectedScore,
      cutoff: exam.cutoff_tier1,
      feasibility_status: feasibilityStatus
    },
    allocations
  };
}

// ----------------------------------------------------
// UTILITY: FILTER SUBTOPICS TESTED BY EXAM
// ----------------------------------------------------
function getSubtopicsForExam(exam: ExamData): Subtopic[] {
  // Collect all cognitive classes tested in this exam
  const classesTested = new Set<string>();
  exam.subjects.forEach(subject => {
    subject.cognitive_classes.forEach(c => classesTested.add(c));
  });

  // Filter subtopics mapping to these cognitive classes
  return subtopicsData.filter(sub => classesTested.has(sub.primary_cognitive_class));
}
