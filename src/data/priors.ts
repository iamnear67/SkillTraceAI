export interface CognitiveClassPrior {
  class_id: string;
  class_name: string;
  asymptote_K: number;
  base_alpha: number;
  initial_stability_S0_days: number;
  weight_multiplier_W: number;
  decay_multiplier_D: number;
  prior_variance: number;
}

export const classPriors: CognitiveClassPrior[] = [
  {
    class_id: "COG_01",
    class_name: "Conceptual Mathematics",
    asymptote_K: 0.90,
    base_alpha: 0.38,
    initial_stability_S0_days: 18.5,
    weight_multiplier_W: 0.92,
    decay_multiplier_D: 1.12,
    prior_variance: 0.22
  },
  {
    class_id: "COG_02",
    class_name: "Pattern Recognition & Spatial Logic",
    asymptote_K: 0.88,
    base_alpha: 0.45,
    initial_stability_S0_days: 24.0,
    weight_multiplier_W: 1.05,
    decay_multiplier_D: 0.90,
    prior_variance: 0.20
  },
  {
    class_id: "COG_03",
    class_name: "Memory-Heavy & Direct Recall",
    asymptote_K: 0.98,
    base_alpha: 0.62,
    initial_stability_S0_days: 12.0,
    weight_multiplier_W: 1.30,
    decay_multiplier_D: 1.45,
    prior_variance: 0.15
  },
  {
    class_id: "COG_04",
    class_name: "Reading Comprehension & Critical Analysis",
    asymptote_K: 0.95,
    base_alpha: 0.50,
    initial_stability_S0_days: 35.0,
    weight_multiplier_W: 1.15,
    decay_multiplier_D: 0.70,
    prior_variance: 0.18
  },
  {
    class_id: "COG_05",
    class_name: "Formula-Based Execution",
    asymptote_K: 0.92,
    base_alpha: 0.55,
    initial_stability_S0_days: 22.0,
    weight_multiplier_W: 1.10,
    decay_multiplier_D: 0.95,
    prior_variance: 0.19
  },
  {
    class_id: "COG_06",
    class_name: "Data Interpretation & Quantitative Reasoning",
    asymptote_K: 0.89,
    base_alpha: 0.40,
    initial_stability_S0_days: 20.0,
    weight_multiplier_W: 0.95,
    decay_multiplier_D: 1.05,
    prior_variance: 0.21
  },
  {
    class_id: "COG_07",
    class_name: "Analytical Decision Making & Legal Principles",
    asymptote_K: 0.94,
    base_alpha: 0.48,
    initial_stability_S0_days: 30.0,
    weight_multiplier_W: 1.08,
    decay_multiplier_D: 0.80,
    prior_variance: 0.17
  },
  {
    class_id: "COG_08",
    class_name: "Symbolic & Abstraction Reasoning",
    asymptote_K: 0.87,
    base_alpha: 0.42,
    initial_stability_S0_days: 25.0,
    weight_multiplier_W: 1.00,
    decay_multiplier_D: 0.88,
    prior_variance: 0.23
  },
  {
    class_id: "COG_09",
    class_name: "Processing Speed & Mental Agility",
    asymptote_K: 0.96,
    base_alpha: 0.70,
    initial_stability_S0_days: 15.0,
    weight_multiplier_W: 1.40,
    decay_multiplier_D: 1.25,
    prior_variance: 0.14
  },
  {
    class_id: "COG_10",
    class_name: "Multi-step Logical Reasoning",
    asymptote_K: 0.86,
    base_alpha: 0.36,
    initial_stability_S0_days: 21.0,
    weight_multiplier_W: 0.88,
    decay_multiplier_D: 1.10,
    prior_variance: 0.24
  },
  {
    class_id: "COG_11",
    class_name: "Verbal Analogy & Linguistic Precision",
    asymptote_K: 0.93,
    base_alpha: 0.52,
    initial_stability_S0_days: 28.0,
    weight_multiplier_W: 1.12,
    decay_multiplier_D: 0.82,
    prior_variance: 0.16
  },
  {
    class_id: "COG_12",
    class_name: "Spatial & Non-Verbal Reasoning",
    asymptote_K: 0.85,
    base_alpha: 0.35,
    initial_stability_S0_days: 26.0,
    weight_multiplier_W: 0.85,
    decay_multiplier_D: 0.85,
    prior_variance: 0.25
  },
  {
    class_id: "COG_13",
    class_name: "Critical Deduction & Argument Flaws",
    asymptote_K: 0.91,
    base_alpha: 0.46,
    initial_stability_S0_days: 32.0,
    weight_multiplier_W: 1.02,
    decay_multiplier_D: 0.75,
    prior_variance: 0.19
  },
  {
    class_id: "COG_14",
    class_name: "Rule Decay & Syntax Handling",
    asymptote_K: 0.90,
    base_alpha: 0.58,
    initial_stability_S0_days: 10.0,
    weight_multiplier_W: 1.25,
    decay_multiplier_D: 1.60,
    prior_variance: 0.20
  },
  {
    class_id: "COG_15",
    class_name: "Quantitative Approximation & Estimation",
    asymptote_K: 0.95,
    base_alpha: 0.65,
    initial_stability_S0_days: 19.0,
    weight_multiplier_W: 1.35,
    decay_multiplier_D: 1.15,
    prior_variance: 0.16
  }
];
