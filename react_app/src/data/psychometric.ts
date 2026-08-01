// Psychometric Aptitude Vector Questions
// Parsed from Psychometric.txt — 10 MCQs scoring across V_QUANT, V_LAW, V_MGMT, V_GEN

export interface PsychometricOption {
  label: string;
  text: string;
  scores: {
    V_QUANT?: number;
    V_LAW?: number;
    V_MGMT?: number;
    V_GEN?: number;
  };
}

export interface PsychometricQuestion {
  id: string;
  prompt: string;
  options: PsychometricOption[];
}

export type PsychometricVector = {
  V_QUANT: number;
  V_LAW: number;
  V_MGMT: number;
  V_GEN: number;
};

export const psychometricQuestions: PsychometricQuestion[] = [
  {
    id: 'PSY_01',
    prompt: 'When facing a complex 500-word puzzle with multiple interconnected constraints, what is your initial instinct?',
    options: [
      { label: 'A', text: 'Translate text immediately into symbolic logic, equations, or truth tables.', scores: { V_QUANT: 1, V_MGMT: 1 } },
      { label: 'B', text: 'Systematically read every word, looking for hidden assumptions or linguistic loopholes.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Look for shortcuts, eliminate obviously invalid patterns, and test boundary conditions.', scores: { V_GEN: 1 } },
      { label: 'D', text: 'Break the puzzle down into smaller sub-cases and solve them sequentially.', scores: { V_MGMT: 1 } }
    ]
  },
  {
    id: 'PSY_02',
    prompt: 'You are presented with a completely unfamiliar theoretical framework (e.g., a made-up taxation model). How do you prefer to master it?',
    options: [
      { label: 'A', text: 'Derive its core formulas from first principles.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Analyze precedent cases where the model was applied and extract underlying rules.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Apply the framework to numerical examples to observe input-output behavior.', scores: { V_MGMT: 1 } },
      { label: 'D', text: 'Scan the rules quickly to understand the basic structure and move straight to practice.', scores: { V_GEN: 1 } }
    ]
  },
  {
    id: 'PSY_03',
    prompt: 'In a 60-minute test with 60 questions, what is your natural pacing strategy?',
    options: [
      { label: 'A', text: 'Move fast, answer easier questions instantly, and skim past complex ones.', scores: { V_GEN: 1, V_MGMT: 1 } },
      { label: 'B', text: 'Work through questions sequentially with high precision, minimizing unattempted items.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Prioritize high-value, complex problems that require deep logical reasoning.', scores: { V_QUANT: 1 } },
      { label: 'D', text: 'Adjust your pace dynamically based on time remaining per section.', scores: { V_MGMT: 1 } }
    ]
  },
  {
    id: 'PSY_04',
    prompt: 'What type of error frustrates you the most during self-analysis?',
    options: [
      { label: 'A', text: 'Calculation or arithmetic slips in a problem you understood completely.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Misinterpreting a nuanced word in a passage that changed the context.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Running out of time on questions you knew how to solve.', scores: { V_GEN: 1 } },
      { label: 'D', text: 'Making a flawed decision due to missing subtle connections between data sets.', scores: { V_MGMT: 1 } }
    ]
  },
  {
    id: 'PSY_05',
    prompt: 'Which environment feels most comfortable during a high-stakes exam section?',
    options: [
      { label: 'A', text: 'Solving dense, multi-variable mathematical proofs or physics models.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Synthesizing dense, conflicting text passages on law, philosophy, or social policy.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Interpreting charts, business case studies, and quantitative data trends.', scores: { V_MGMT: 1 } },
      { label: 'D', text: 'Switching rapidly between varied topics (Vocabulary, Logic, GK, Arithmetic).', scores: { V_GEN: 1 } }
    ]
  },
  {
    id: 'PSY_06',
    prompt: 'When dealing with static, memory-heavy topics (e.g., historical dates, chemical properties, legal articles), how do you retain information best?',
    options: [
      { label: 'A', text: 'Map facts into structural logic diagrams or flowcharts.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Embed information within broader narratives or contextual passages.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Use flashcards, spaced-repetition schedules, and quick recall drills.', scores: { V_GEN: 1 } },
      { label: 'D', text: 'Focus only on key facts that directly impact outcomes and ignore surrounding noise.', scores: { V_MGMT: 1 } }
    ]
  },
  {
    id: 'PSY_07',
    prompt: 'When a problem contains redundant or irrelevant information, what do you usually do?',
    options: [
      { label: 'A', text: 'Systematically filter out extra parameters using mathematical models.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Interrogate why the extra information was included and check for intentional trickery.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Ignore the extra data immediately and focus only on the core question.', scores: { V_GEN: 1, V_MGMT: 1 } },
      { label: 'D', text: 'Map all given data visually before deciding what to discard.', scores: { V_MGMT: 1 } }
    ]
  },
  {
    id: 'PSY_08',
    prompt: 'How do you handle ambiguity in a test question where two options feel plausible?',
    options: [
      { label: 'A', text: 'Re-verify constraints using strict deduction to eliminate one option.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Evaluate textual evidence to determine which option is most defensible.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Estimate probabilities based on question patterns and pick the safer option.', scores: { V_MGMT: 1 } },
      { label: 'D', text: 'Trust your intuition, make a fast calculated guess, and move on.', scores: { V_GEN: 1 } }
    ]
  },
  {
    id: 'PSY_09',
    prompt: 'What kind of cognitive task gives you the strongest sense of flow?',
    options: [
      { label: 'A', text: 'Debugging a multi-step quantitative calculation until it balances perfectly.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Deconstructing a complex legal or philosophical argument to find its fatal flaw.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Extracting actionable insights from complex graphs, tables, and statistics.', scores: { V_MGMT: 1 } },
      { label: 'D', text: 'Rapidly solving dozens of short, varied puzzles in quick succession.', scores: { V_GEN: 1 } }
    ]
  },
  {
    id: 'PSY_10',
    prompt: 'What is your main priority when selecting target exams?',
    options: [
      { label: 'A', text: 'Technical depth, domain specialization, and problem-solving rigor.', scores: { V_QUANT: 1 } },
      { label: 'B', text: 'Policy impact, analytical argumentation, and structured reasoning.', scores: { V_LAW: 1 } },
      { label: 'C', text: 'Leadership potential, management strategy, and institutional reputation.', scores: { V_MGMT: 1 } },
      { label: 'D', text: 'Broad career options, versatility, and maximizing total acceptance probabilities.', scores: { V_GEN: 1 } }
    ]
  }
];
