export interface Rule {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  id: string;
  class_id?: string;
  type: 'synthetic' | 'cognitive';
  prompt: string;
  options: string[];
  correct_option: string; // 'A' | 'B' | 'C' | 'D'
  weight_multiplier_target?: string;
  // Optional parameters for debugging or logic flow
  explanation?: string;
  revision_card?: string; // Text shown if got wrong (for revision efficiency measurement)
}

export const syntheticRules: Rule[] = [
  {
    id: "RULE_BASE5_SHIFT",
    title: "Base-5 Vector Shift (Phi Operator)",
    content: "All numbers are in Base-5. Even digits (0, 2, 4) add 2 in Base-5 (e.g., 2 becomes 4, 4 wraps to 1+0 = 10, etc.). Odd digits (1, 3) multiply by 3 in Base-5 (e.g., 1 becomes 3, 3 becomes 14_5)."
  },
  {
    id: "RULE_THETA_INVERSION",
    title: "Inversion Matrix (Theta State)",
    content: "Preceding symbol Theta reverses the digit order AFTER the Phi transformation is applied. For example, if Phi(12) = 34, then Theta Phi(12) = 43."
  },
  {
    id: "RULE_LOGIC_OPS",
    title: "Non-Boolean Operators (Lambda, Psi, Delta)",
    content: "Lambda(A, B) = TRUE if (A+B)_5 is prime, FALSE if even, Omega (Null-Loop) otherwise. Psi(A, B) = TRUE if A > B and B has an odd digit. Delta = TRUE if exactly one operand is Omega."
  },
  {
    id: "RULE_CASCADE_DECAY",
    title: "Omega-Cascade Precedence Inversion",
    content: "Two or more Omega states invert the execution order to right-to-left, overriding standard precedence."
  }
];

export const syntheticQuestions: Question[] = [
  {
    id: "SYN_01",
    type: 'synthetic',
    prompt: "Let Phi be the Base-5 Vector Shift operator. What is Phi(12_5) in Base-5? (Hint: 1 is odd: 1*3=3; 2 is even: 2+2=4)",
    options: [
      "A) 34_5",
      "B) 43_5",
      "C) 13_5",
      "D) 32_5"
    ],
    correct_option: "A",
    explanation: "Under Base-5 shift, digit 1 (odd) becomes 3, and digit 2 (even) becomes 4. So Phi(12_5) = 34_5.",
    revision_card: "Quick reminder: Phi operator acts on each digit individually in Base-5. Odd digits (1, 3) are multiplied by 3. Even digits (0, 2, 4) are incremented by 2."
  },
  {
    id: "SYN_02",
    type: 'synthetic',
    prompt: "Evaluate the expression: Theta Phi(13_5) in Base-5. (Remember: Phi shift is applied first, then Theta reverses the digits)",
    options: [
      "A) 43_5",
      "B) 34_5",
      "C) 93_5",
      "D) 44_5"
    ],
    correct_option: "B",
    explanation: "For Phi(13_5): 1 is odd -> 1*3=3. 3 is odd -> 3*3=9 in base-10, which is 14_5 in base-5. Thus Phi(13) = 34_5 (taking single-digit transforms). Reversing the digits via Theta gives 43 reversed -> 34_5.",
    revision_card: "Theta reverses the digits after Phi: Phi(13_5) has digit 1->3 and 3->4, resulting in 34. Theta reverses 34 to 43. (Note: standard single digits are mapped: 1->3, 3->4, so Phi(13_5) = 34_5, reversed becomes 43_5. Wait, option A is 43_5, option B is 34_5. If correct option is A, let's fix it!)"
  },
  {
    id: "SYN_03",
    type: 'synthetic',
    prompt: "Under Kyrosian Logic Ops, evaluate Lambda(11_5, 12_5). (Hint: (11_5 + 12_5) = 23_5, which is decimal 13. Is 13 prime?)",
    options: [
      "A) FALSE",
      "B) TRUE",
      "C) Omega",
      "D) Null-Loop"
    ],
    correct_option: "B",
    explanation: "11_5 + 12_5 = 23_5. 23_5 is 2*5 + 3 = 13 in decimal, which is a prime number. Lambda(A,B) returns TRUE if (A+B) is prime. So it is TRUE.",
    revision_card: "Lambda(A, B) checks if the sum in Base-5 is prime. Convert the base-5 sum to decimal first (e.g. 23_5 = 13 decimal) and check if it is prime. 13 is prime, so Lambda returns TRUE."
  },
  {
    id: "SYN_04",
    type: 'synthetic',
    prompt: "Let's perform a delayed test: What is Phi(20_5) in Base-5? (Even digits add 2, odd digits multiply by 3)",
    options: [
      "A) 42_5",
      "B) 22_5",
      "C) 40_5",
      "D) 32_5"
    ],
    correct_option: "A",
    explanation: "For 20_5: 2 is even -> 2+2=4. 0 is even -> 0+2=2. So Phi(20_5) = 42_5.",
    revision_card: "Even digits include 0, 2, and 4. They all get added by 2. Thus 2 becomes 4 and 0 becomes 2, yielding 42_5."
  },
  {
    id: "SYN_05",
    type: 'synthetic',
    prompt: "Evaluate Psi(12_5, 10_5). (Hint: Psi(A,B) = TRUE if A > B and B has an odd digit. In Base-5, 12_5 > 10_5. Does 10_5 have an odd digit?)",
    options: [
      "A) FALSE",
      "B) TRUE",
      "C) Omega",
      "D) Delta"
    ],
    correct_option: "B",
    explanation: "12_5 is greater than 10_5. B is 10_5, which contains the digit 1 (an odd digit). Therefore, both conditions for Psi are met, so it is TRUE.",
    revision_card: "Psi(A, B) requires two conditions: (1) A > B, and (2) B has at least one odd digit (1 or 3). Here 12 > 10, and 10 has digit 1 which is odd, so it's TRUE."
  },
  {
    id: "SYN_06",
    type: 'synthetic',
    prompt: "Delta operator checks if exactly one operand is Omega. What does Delta(Omega, Delta(TRUE, FALSE)) evaluate to? (Assume Delta(TRUE, FALSE) is FALSE since neither is Omega)",
    options: [
      "A) FALSE",
      "B) TRUE",
      "C) Omega",
      "D) Null"
    ],
    correct_option: "B",
    explanation: "Delta(TRUE, FALSE) evaluates to FALSE (no Omega). Then we have Delta(Omega, FALSE). Since exactly one operand is Omega, it returns TRUE.",
    revision_card: "Delta(X, Y) is TRUE if and only if one of X or Y is Omega, and the other is NOT Omega. Delta(Omega, FALSE) has exactly one Omega, so it is TRUE."
  }
];

// Correction to SYN_02: Let's make options and correct option consistent.
// Phi(13_5): 1->3, 3->9 (9 in base 5 is 14_5, but if we treat each digit, wait, if 3 is odd, odd digits multiply by 3: 3*3 = 9. In base 5, 9 is 14_5. If we take individual digits, let's keep it simple: 1->3, 3 is odd: 3*3=9 (base 5 is 14_5), so it is 314_5? No, the rule says: Even digits add 2, odd digits multiply by 3.
// Let's make SYN_02 prompt clear and simple:
// "Evaluate Theta Phi(12_5) in Base-5. As known, Phi(12_5) = 34_5."
// Options: A) 43_5, B) 34_5, C) 21_5, D) 12_5.
// Correct: A (reversing 34 gives 43). Let's edit the SYN_02 prompt in the file below to be exactly this, ensuring no confusion.
syntheticQuestions[1] = {
  id: "SYN_02",
  type: 'synthetic',
  prompt: "Evaluate the expression: Theta Phi(12_5) in Base-5. (Recall that Phi(12_5) = 34_5, and Theta reverses the digits AFTER Phi is applied)",
  options: [
    "A) 43_5",
    "B) 34_5",
    "C) 21_5",
    "D) 12_5"
  ],
  correct_option: "A",
  explanation: "Phi(12_5) = 34_5. Preceding symbol Theta reverses digit order, giving 43_5.",
  revision_card: "Theta reverses the digits: if Phi(12) is 34, then Theta Phi(12) is 43."
};


export const diagnosticQuestions: Question[] = [
  // COG_01: Conceptual Mathematics
  {
    id: "DIAG_C01_L1",
    class_id: "COG_01",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Find the general solution to the first-order linear differential equation: dy/dx + 2y = e^(-x).",
    options: ["A) y = e^(-x) + C e^(-2x)", "B) y = e^(-2x) + C e^(-x)", "C) y = 2e^(-x) + C", "D) y = e^x + C e^(-2x)"],
    correct_option: "A",
    explanation: "Integrating factor I.F. = e^(2x). Multiplying gives d/dx(y e^(2x)) = e^x, so y e^(2x) = e^x + C => y = e^(-x) + C e^(-2x)."
  },
  {
    id: "DIAG_C01_L2",
    class_id: "COG_01",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Let f(x) = x^2 - 3 under Base-5 arithmetic. If x = 12_5 (which is 7 in decimal), what is f(x) represented in Base-5?",
    options: ["A) 31_5", "B) 41_5", "C) 141_5", "D) 22_5"],
    correct_option: "C",
    explanation: "x = 7 in decimal. f(7) = 7^2 - 3 = 46. Converting 46 to Base-5: 46 = 1*(25) + 4*(5) + 1*(1) = 141_5."
  },
  {
    id: "DIAG_C01_L3",
    class_id: "COG_01",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] For dy/dx = y^(2/3) with y(0) = 0, does Picard's Uniqueness Theorem guarantee a unique solution?",
    options: ["A) Yes, y = (x/3)^3 is the unique solution.", "B) No, partial derivative is unbounded at y=0, yielding infinitely many solutions.", "C) Yes, because f(x,y) is continuous everywhere.", "D) No, because no solution exists."],
    correct_option: "B",
    explanation: "df/dy = (2/3) y^(-1/3) is unbounded at y=0. Lipschitz condition fails, so uniqueness breaks down (both y=0 and y=(x/3)^3 satisfy IVP)."
  },

  // COG_02: Pattern Recognition & Spatial Logic
  {
    id: "DIAG_C02_L1",
    class_id: "COG_02",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Complete the pattern progression: [2, 4, 8], [3, 9, 27], [4, 16, ?]",
    options: ["A) 32", "B) 64", "C) 48", "D) 52"],
    correct_option: "B",
    explanation: "Powers of base 4: 4^1=4, 4^2=16, 4^3=64."
  },
  {
    id: "DIAG_C02_L2",
    class_id: "COG_02",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Matrix Progression: Row 1 = [1, 2, 4], Row 2 = [3, 6, 12], Row 3 = [5, 10, ?]",
    options: ["A) 15", "B) 20", "C) 25", "D) 30"],
    correct_option: "B",
    explanation: "Each row doubles element-by-element: 5 * 2 = 10, 10 * 2 = 20."
  },
  {
    id: "DIAG_C02_L3",
    class_id: "COG_02",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] In a 3x3 rotational grid, Shape X rotates +90° while Shape Y flips along vertical axis every step. At Step 4, what is their relative orientation?",
    options: ["A) Same as Step 0", "B) X is inverted 180°, Y is back to original", "C) Both inverted 180°", "D) X rotated +90°, Y inverted"],
    correct_option: "A",
    explanation: "+90° * 4 = 360° (full rotation), and 4 vertical flips = original orientation. Thus Step 4 matches Step 0."
  },

  // COG_03: Memory-Heavy & Direct Recall
  {
    id: "DIAG_C03_L1",
    class_id: "COG_03",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Which constitutional article in India deals with the fundamental Right to Equality?",
    options: ["A) Article 14", "B) Article 19", "C) Article 21", "D) Article 32"],
    correct_option: "A",
    explanation: "Article 14 guarantees equality before law and equal protection of the laws."
  },
  {
    id: "DIAG_C03_L2",
    class_id: "COG_03",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] What is the correct IUPAC / structural formula for propan-2-one (Acetone)?",
    options: ["A) CH3-CH2-CHO", "B) CH3-CO-CH3", "C) CH3-CH2-COOH", "D) CH3-CH2-OH"],
    correct_option: "B",
    explanation: "Propan-2-one (Acetone) is the simplest ketone with structure CH3-CO-CH3."
  },
  {
    id: "DIAG_C03_L3",
    class_id: "COG_03",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Which treaty signed in 1765 granted the British East India Company Diwani rights (tax collection) over Bengal, Bihar, and Orissa?",
    options: ["A) Treaty of Mangalore", "B) Treaty of Allahabad", "C) Treaty of Purandar", "D) Treaty of Salbai"],
    correct_option: "B",
    explanation: "The Treaty of Allahabad (1765) between Mughal Emperor Shah Alam II and Robert Clive granted Diwani rights."
  },

  // COG_04: Reading Comprehension & Critical Analysis
  {
    id: "DIAG_C04_L1",
    class_id: "COG_04",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] 'While statutory laws provide structural clarity, judicial discretion prevents systemic rigidity.' What is the author's main stance?",
    options: ["A) Statutes are obsolete", "B) Judicial discretion is a necessary complement to statutes", "C) Predictability is the only legal value", "D) Structural clarity is undesirable"],
    correct_option: "B",
    explanation: "Discretion complements statutory laws to prevent rigidity while maintaining balance."
  },
  {
    id: "DIAG_C04_L2",
    class_id: "COG_04",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] 'Technological automation boosts productivity but compresses labor share of income.' What logical inference follows?",
    options: ["A) Total economic output declines", "B) Labor receives a smaller fraction of total output despite higher total productivity", "C) Automation should be banned", "D) Wages increase proportionally"],
    correct_option: "B",
    explanation: "Higher total productivity with compressed labor share means workers receive a smaller fraction of the larger pie."
  },
  {
    id: "DIAG_C04_L3",
    class_id: "COG_04",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Identify the implicit paradox in: 'Enforcing absolute transparency in negotiation protocols diminishes final compromise quality.'",
    options: ["A) Transparency is illegal", "B) Public scrutiny forces parties into rigid public postures, inhibiting private concessions", "C) Compromise requires deception", "D) Protocols are ineffective"],
    correct_option: "B",
    explanation: "Public transparency locks negotiators into posturing, preventing flexibilities needed for compromise."
  },

  // COG_05: Formula-Based Execution
  {
    id: "DIAG_C05_L1",
    class_id: "COG_05",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Given Velocity V = u + at, with u = 5 m/s, a = 2.5 m/s^2, t = 12s. Calculate V.",
    options: ["A) 30 m/s", "B) 35 m/s", "C) 25 m/s", "D) 40 m/s"],
    correct_option: "B",
    explanation: "V = 5 + (2.5 * 12) = 35 m/s."
  },
  {
    id: "DIAG_C05_L2",
    class_id: "COG_05",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Calculate work done by 2 moles of ideal gas expanding isothermally at 300K from V1 = 2L to V2 = 8L (R = 8.314 J/mol K, ln 4 ≈ 1.386).",
    options: ["A) 3456 J", "B) 6914 J", "C) 5210 J", "D) 1240 J"],
    correct_option: "B",
    explanation: "W = nRT ln(V2/V1) = 2 * 8.314 * 300 * 1.386 = 4988.4 * 1.386 ≈ 6914 J."
  },
  {
    id: "DIAG_C05_L3",
    class_id: "COG_05",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] In an ideal gas free expansion into a vacuum (thermally isolated rigid container), what are the values of W, ΔQ, ΔU, and ΔS?",
    options: ["A) W=0, ΔQ=0, ΔU=0, ΔS>0", "B) W>0, ΔQ=0, ΔU=0, ΔS=0", "C) W=0, ΔQ>0, ΔU>0, ΔS=0", "D) W=0, ΔQ=0, ΔU<0, ΔS<0"],
    correct_option: "A",
    explanation: "No boundary moves so W=0. Isolated container means ΔQ=0, thus ΔU=0. Process is irreversible so entropy ΔS > 0."
  },

  // COG_06: Data Interpretation & Quantitative Reasoning
  {
    id: "DIAG_C06_L1",
    class_id: "COG_06",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Sales: Q1 = $100k, Q2 = $150k, Q3 = $200k, Q4 = $250k. Percentage increase from Q1 to Q4?",
    options: ["A) 100%", "B) 150%", "C) 250%", "D) 200%"],
    correct_option: "B",
    explanation: "Increase = (250 - 100) / 100 * 100% = 150%."
  },
  {
    id: "DIAG_C06_L2",
    class_id: "COG_06",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] A pie chart shows Department A = 40%, B = 35%, C = 25%. If Department C has 50 employees, how many employees are in Department A?",
    options: ["A) 70", "B) 80", "C) 90", "D) 100"],
    correct_option: "B",
    explanation: "Total employees = 50 / 0.25 = 200. Department A = 40% of 200 = 80 employees."
  },
  {
    id: "DIAG_C06_L3",
    class_id: "COG_06",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Company revenue grows 20% in Year 1, drops 20% in Year 2, grows 25% in Year 3. Overall 3-year net percentage change?",
    options: ["A) +25%", "B) +20%", "C) +5%", "D) 0% (No change)"],
    correct_option: "B",
    explanation: "Net multiplier = 1.20 * 0.80 * 1.25 = 1.20. Net change = +20%."
  },

  // COG_07: Analytical Decision Making & Legal Principles
  {
    id: "DIAG_C07_L1",
    class_id: "COG_07",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Principle: Agreement without consideration is void. Fact: A promises B $100 as a gift without writing/registration. Enforceable?",
    options: ["A) Yes", "B) No, consideration is absent", "C) Yes, if witnessed", "D) Depends on court"],
    correct_option: "B",
    explanation: "A gift promise without consideration or formal registration is void."
  },
  {
    id: "DIAG_C07_L2",
    class_id: "COG_07",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Principle: Strict liability applies to hazardous escapes. Fact: Water escapes from A's artificial reservoir due to an unexpected unprovoked earthquake (Act of God). Is A strictly liable?",
    options: ["A) Yes, strict liability has no exceptions", "B) No, Act of God is a recognized defense to strict liability", "C) Yes, because reservoir was man-made", "D) No, unless someone died"],
    correct_option: "B",
    explanation: "Act of God (vis major) is a recognized exception to the rule of strict liability (Rylands v. Fletcher)."
  },
  {
    id: "DIAG_C07_L3",
    class_id: "COG_07",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Principle: Vicarious liability requires act done in course of employment. Fact: Driver strays off authorized route to run personal errand and hits pedestrian. Is employer liable?",
    options: ["A) Yes, driver was still driving employer's car", "B) No, driver was on a complete 'frolic of his own'", "C) Yes, always liable for employees", "D) No, pedestrian was negligent"],
    correct_option: "B",
    explanation: "A major detour for personal benefit constitutes a 'frolic of his own', severing vicarious liability."
  },

  // COG_08: Symbolic & Abstraction Reasoning
  {
    id: "DIAG_C08_L1",
    class_id: "COG_08",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] If # represents 'square the sum of operands', evaluate 2 # 3.",
    options: ["A) 13", "B) 25", "C) 10", "D) 36"],
    correct_option: "B",
    explanation: "(2 + 3)^2 = 5^2 = 25."
  },
  {
    id: "DIAG_C08_L2",
    class_id: "COG_08",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Evaluate (2 # 3) # 1 where # represents 'square the sum of operands'.",
    options: ["A) 26", "B) 676", "C) 25", "D) 100"],
    correct_option: "B",
    explanation: "(2 # 3) = 25. Then 25 # 1 = (25 + 1)^2 = 26^2 = 676."
  },
  {
    id: "DIAG_C08_L3",
    class_id: "COG_08",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Define non-associative operator X * Y = X^2 + Y. Does (2 * 3) * 1 equal 2 * (3 * 1)?",
    options: ["A) Yes, both equal 50", "B) No, (2*3)*1 = 50 while 2*(3*1) = 14", "C) Yes, both equal 14", "D) No, (2*3)*1 = 14 while 2*(3*1) = 50"],
    correct_option: "B",
    explanation: "(2*3) = 4+3 = 7; 7*1 = 49+1 = 50. Meanwhile 3*1 = 9+1 = 10; 2*10 = 4+10 = 14. Non-associative!"
  },

  // COG_09: Processing Speed & Mental Agility
  {
    id: "DIAG_C09_L1",
    class_id: "COG_09",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Speed Test: 17 + 28 - 14 = ?",
    options: ["A) 31", "B) 33", "C) 29", "D) 35"],
    correct_option: "A",
    explanation: "17 + 28 = 45; 45 - 14 = 31."
  },
  {
    id: "DIAG_C09_L2",
    class_id: "COG_09",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Speed Test: 17 + 28 - 14 + 19 - 8 = ?",
    options: ["A) 31", "B) 42", "C) 39", "D) 45"],
    correct_option: "B",
    explanation: "17+28=45; 45-14=31; 31+19=50; 50-8=42."
  },
  {
    id: "DIAG_C09_L3",
    class_id: "COG_09",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Rapid Mental Calculation: (18 * 15) / 9 + 47 - 23 = ?",
    options: ["A) 54", "B) 44", "C) 64", "D) 34"],
    correct_option: "A",
    explanation: "(18/9)*15 = 2*15 = 30; 30 + 47 - 23 = 54."
  },

  // COG_10: Multi-step Logical Reasoning
  {
    id: "DIAG_C10_L1",
    class_id: "COG_10",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] A is older than B. C is younger than B. D is older than A. Who is the youngest?",
    options: ["A) A", "B) B", "C) C", "D) D"],
    correct_option: "C",
    explanation: "Order: D > A > B > C. C is the youngest."
  },
  {
    id: "DIAG_C10_L2",
    class_id: "COG_10",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] A is older than B. C is younger than B. D is older than A. E is older than C but younger than B. Who is the youngest?",
    options: ["A) B", "B) C", "C) D", "D) E"],
    correct_option: "B",
    explanation: "Order: D > A > B > E > C. C is the youngest."
  },
  {
    id: "DIAG_C10_L3",
    class_id: "COG_10",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Five people (P, Q, R, S, T) sit in a row. P is left of Q. R is right of S. T is between Q and S. If P is at far left, who is in the middle?",
    options: ["A) Q", "B) S", "C) T", "D) R"],
    correct_option: "C",
    explanation: "Order from left: P - Q - T - S - R. Middle position (3rd) is T."
  },

  // COG_11: Verbal Analogy & Linguistic Precision
  {
    id: "DIAG_C11_L1",
    class_id: "COG_11",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Scalpel : Surgeon :: Gavel : ?",
    options: ["A) Lawyer", "B) Judge", "C) Doctor", "D) Carpenter"],
    correct_option: "B",
    explanation: "A gavel is the primary instrument of a judge, as a scalpel is to a surgeon."
  },
  {
    id: "DIAG_C11_L2",
    class_id: "COG_11",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Ephemeral : Permanent :: Obscure : ?",
    options: ["A) Hidden", "B) Explicit", "C) Vague", "D) Mysterious"],
    correct_option: "B",
    explanation: "Antonym relationship: Ephemeral is opposite of Permanent; Obscure is opposite of Explicit."
  },
  {
    id: "DIAG_C11_L3",
    class_id: "COG_11",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Choose the pair with exact relationship matching: Catalyst : Reaction :: ?",
    options: ["A) Fuel : Fire", "B) Mentor : Growth", "C) Inhibitor : Process", "D) Engine : Car"],
    correct_option: "B",
    explanation: "A catalyst accelerates a reaction without being consumed; a mentor accelerates growth without taking credit."
  },

  // COG_12: Spatial & Non-Verbal Reasoning
  {
    id: "DIAG_C12_L1",
    class_id: "COG_12",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] A paper is folded in half once and a hole is punched in the center. How many holes when unfolded?",
    options: ["A) 1", "B) 2", "C) 4", "D) 3"],
    correct_option: "B",
    explanation: "One fold creates 2 layers, so punching 1 hole produces 2 holes when unfolded."
  },
  {
    id: "DIAG_C12_L2",
    class_id: "COG_12",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] A square paper is folded in half twice, and a single hole is punched in the center of the folded square. How many holes appear when unfolded?",
    options: ["A) 1", "B) 2", "C) 4", "D) 8"],
    correct_option: "C",
    explanation: "Two folds create 4 layers. Punching in the interior of the folded quadrant replicates 4 holes."
  },
  {
    id: "DIAG_C12_L3",
    class_id: "COG_12",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] A 3x3x3 cube painted red on all outer surfaces is cut into 27 unit cubes. How many unit cubes have EXACTLY 2 red faces?",
    options: ["A) 8", "B) 12", "C) 6", "D) 1"],
    correct_option: "B",
    explanation: "Cubes with 2 red faces reside on the 12 edges of the 3x3x3 cube (1 per edge = 12)."
  },

  // COG_13: Critical Deduction & Argument Flaws
  {
    id: "DIAG_C13_L1",
    class_id: "COG_13",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] 'All cars have wheels. A bicycle has wheels. Therefore, a bicycle is a car.' What flaw is present?",
    options: ["A) Undistributed Middle", "B) Circular Logic", "C) Ad Hominem", "D) Post Hoc"],
    correct_option: "A",
    explanation: "Fallacy of the Undistributed Middle (shared attribute does not imply identity)."
  },
  {
    id: "DIAG_C13_L2",
    class_id: "COG_13",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] 'Whenever ice cream sales rise, drowning rates increase. Therefore, ice cream causes drowning.' Identify the flaw.",
    options: ["A) Confusing Correlation with Causation", "B) Circular Argument", "C) Appeal to Emotion", "D) Strawman Fallacy"],
    correct_option: "A",
    explanation: "Both variables increase due to a third confounding factor (summer heat)."
  },
  {
    id: "DIAG_C13_L3",
    class_id: "COG_13",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] 'We must either completely ban private vehicles or suffer total environmental collapse.' Identify the fallacy.",
    options: ["A) False Dilemma (Black-or-White)", "B) Red Herring", "C) Slippery Slope", "D) Hasty Generalization"],
    correct_option: "A",
    explanation: "Falsely presents two extreme options while ignoring middle-ground solutions (e.g. EV adoption, public transit)."
  },

  // COG_14: Rule Application & Syntax Handling
  {
    id: "DIAG_C14_L1",
    class_id: "COG_14",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Under standard algebraic order of operations (BODMAS/PEMDAS), evaluate: 4 + 3 * 2^2.",
    options: ["A) 28", "B) 16", "C) 49", "D) 22"],
    correct_option: "B",
    explanation: "Exponentiation first: 2^2 = 4. Multiplication next: 3 * 4 = 12. Addition last: 4 + 12 = 16."
  },
  {
    id: "DIAG_C14_L2",
    class_id: "COG_14",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] In formal propositional logic, what is the logially equivalent contrapositive of the conditional statement 'If it rains, then the ground is wet'?",
    options: ["A) If the ground is wet, then it rains", "B) If the ground is NOT wet, then it did NOT rain", "C) If it does not rain, then the ground is not wet", "D) It rains if and only if the ground is wet"],
    correct_option: "B",
    explanation: "The contrapositive of 'P -> Q' is '~Q -> ~P', which is logically equivalent to the original statement."
  },
  {
    id: "DIAG_C14_L3",
    class_id: "COG_14",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Let f(x) = 2x + 1 for x >= 0, and f(x) = x^2 for x < 0. Evaluate the composite function f(f(-3)).",
    options: ["A) 19", "B) 81", "C) -17", "D) 37"],
    correct_option: "A",
    explanation: "f(-3) = (-3)^2 = 9 (since -3 < 0). Then f(9) = 2(9) + 1 = 19 (since 9 >= 0)."
  },

  // COG_15: Quantitative Approximation & Estimation
  {
    id: "DIAG_C15_L1",
    class_id: "COG_15",
    type: 'cognitive',
    prompt: "[L1 Direct Retrieval] Estimate within 5 seconds: 498 * 203 ≈ ?",
    options: ["A) 10,000", "B) 100,000", "C) 1,000,000", "D) 50,000"],
    correct_option: "B",
    explanation: "500 * 200 = 100,000."
  },
  {
    id: "DIAG_C15_L2",
    class_id: "COG_15",
    type: 'cognitive',
    prompt: "[L2 Concept Transfer] Rapidly estimate: √99800 + 19.8^2 ≈ ?",
    options: ["A) 700", "B) 500", "C) 300", "D) 1000"],
    correct_option: "A",
    explanation: "√100,000 ≈ 316. 20^2 = 400. 316 + 400 = 716 ≈ 700."
  },
  {
    id: "DIAG_C15_L3",
    class_id: "COG_15",
    type: 'cognitive',
    prompt: "[L3 Edge Analysis] Estimate: (7.98 * 10^5) / (3.99 * 10^-3) ≈ ?",
    options: ["A) 2 * 10^2", "B) 2 * 10^8", "C) 2 * 10^-8", "D) 3.2 * 10^6"],
    correct_option: "B",
    explanation: "(8 * 10^5) / (4 * 10^-3) = 2 * 10^(5 - (-3)) = 2 * 10^8."
  }
];

// Note on C12 correction: In gemini-code-1785565222831.json, the option was C (4) and correct_option was C. The prompt in the original json was: 'If a square paper is folded in half twice and a circular hole is punched in the center... correct_option: C'. So C is indeed correct. We will keep it as C (4).
