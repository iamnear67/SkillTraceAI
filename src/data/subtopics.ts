export interface Subtopic {
  subtopic_id: string;
  name: string;
  domain: string;
  primary_cognitive_class: string;
  secondary_cognitive_class: string | null;
  cognitive_complexity_tier: 'EASY' | 'MEDIUM' | 'HARD';
  base_token_cost: number;
}

export const subtopicsData: Subtopic[] = [
  {
    "subtopic_id": "SUB_001",
    "name": "Number Systems - Divisibility & Remainder Theorems",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_002",
    "name": "HCF and LCM",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_003",
    "name": "Simplification & Approximation",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_15",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_004",
    "name": "Percentages & Conversions",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_005",
    "name": "Profit, Loss & Discount",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_006",
    "name": "Simple Interest & Compound Interest",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_007",
    "name": "Ratio, Proportion & Variations",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_008",
    "name": "Averages, Mixtures & Alligations",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_009",
    "name": "Time, Speed & Distance - Relative Speed",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_010",
    "name": "Time, Speed & Distance - Boats, Streams & Escalators",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_011",
    "name": "Time & Work - Pipes & Cisterns",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_012",
    "name": "Linear Equations & Inequations",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_013",
    "name": "Quadratic Equations & Roots Analysis",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_014",
    "name": "Polynomials & Inequalities",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_015",
    "name": "Logarithms & Properties",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_016",
    "name": "Progressions - Arithmetic Progression (AP)",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_017",
    "name": "Progressions - Geometric & Harmonic (GP/HP)",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_018",
    "name": "Functions & Domain/Range Mapping",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_019",
    "name": "Graphs & Transformations of Functions",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_02",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_020",
    "name": "Set Theory & Venn Diagrams (3-Set/4-Set)",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_021",
    "name": "Permutations & Combinations - Fundamental Counting",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_022",
    "name": "Probability - Conditional & Bayes Theorem",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_023",
    "name": "Matrices & Determinants",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_024",
    "name": "Geometry - Triangles, Similarity & Congruence",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_025",
    "name": "Geometry - Circles, Chords & Tangents",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_026",
    "name": "Mensuration 2D & 3D Solids",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_027",
    "name": "Coordinate Geometry - Lines & Distance Form",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_028",
    "name": "Coordinate Geometry - Circles & Conic Sections",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_029",
    "name": "Trigonometry - Ratios & Identities",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_030",
    "name": "Trigonometric Heights & Distances",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_031",
    "name": "Calculus - Limits & Continuity",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_032",
    "name": "Calculus - Differentiation & Applications",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_033",
    "name": "Calculus - Integration & Area Under Curves",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_034",
    "name": "Vectors & 3D Geometry",
    "domain": "QUANTITATIVE_APTITUDE_AND_MATH",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_035",
    "name": "Data Tables & Structure Analysis",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_036",
    "name": "Bar Charts & Stacked Bars",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_037",
    "name": "Line Graphs & Dual Axis Trends",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_038",
    "name": "Pie Charts - Single & Multi-pie Mapping",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_039",
    "name": "Caselets & Paragraph DI",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_040",
    "name": "Radar Charts & Web Diagrams",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_041",
    "name": "Scatter Plots & Correlation Trends",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_042",
    "name": "Missing Data DI Sets",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_043",
    "name": "Data Sufficiency - Arithmetic Based",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_044",
    "name": "Data Sufficiency - Algebra & Geometry",
    "domain": "DATA_INTERPRETATION_AND_DATA_SUFFICIENCY",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_045",
    "name": "Number & Alphabet Series",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_02",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_046",
    "name": "Coding-Decoding & Letter Shifts",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_047",
    "name": "Blood Relations & Family Trees",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_048",
    "name": "Direction Sense & Spatial Tracking",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_049",
    "name": "Linear Seating Arrangements",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_050",
    "name": "Circular & Polygonal Seating Arrangements",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_051",
    "name": "Matrix & Floor-Based Puzzles",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_052",
    "name": "Scheduling & Selection Puzzles",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_053",
    "name": "Syllogisms - Classical Venn Rules",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_054",
    "name": "Syllogisms - Only A Few & Possibility Cases",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_055",
    "name": "Clocks - Angle & Defect Calculations",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_056",
    "name": "Calendars & Odd Days Concept",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_057",
    "name": "Cubes, Dice & Cut Surface Folding",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_058",
    "name": "Venn Diagram Logic Deduction",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_059",
    "name": "Input-Output Machine Automation",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_060",
    "name": "Binary Logic & Truth-Teller/Liar Puzzles",
    "domain": "LOGICAL_REASONING_AND_ANALYTICS",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_061",
    "name": "RC - Main Idea & Central Theme Extraction",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_062",
    "name": "RC - Author Tone, Stance & Attitude",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_063",
    "name": "RC - Direct Inference & Contextual Meaning",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_064",
    "name": "RC - Title Selection & Summary Writing",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_065",
    "name": "Para Jumbles - Sentence Reordering",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_066",
    "name": "Para Summary - Key Point Extraction",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_067",
    "name": "Odd One Out - Sentence Exclusion",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_068",
    "name": "Sentence Completion & Context Clues",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_11",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_069",
    "name": "Vocabulary - Synonyms & Antonyms",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_070",
    "name": "Vocabulary - Idioms & Phrases",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_071",
    "name": "Vocabulary - Foreign Words & Phrases",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_072",
    "name": "Analogies - Word Relationship Pairing",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_11",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_073",
    "name": "Grammar - Subject-Verb Agreement",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_074",
    "name": "Grammar - Tenses & Aspect Usage",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_075",
    "name": "Grammar - Modifiers & Parallelism Flaws",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_076",
    "name": "Grammar - Prepositions & Articles",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_077",
    "name": "Error Spotting & Sentence Correction",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_078",
    "name": "Cloze Test Paragraph Filling",
    "domain": "VERBAL_REASONING_AND_ENGLISH_LANGUAGE",
    "primary_cognitive_class": "COG_11",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_079",
    "name": "CR - Statement & Assumptions",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_080",
    "name": "CR - Statement & Arguments (Strong/Weak)",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_081",
    "name": "CR - Course of Action Evaluation",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_082",
    "name": "CR - Cause & Effect Relationship",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_083",
    "name": "CR - Strengthening & Weakening Arguments",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_084",
    "name": "CR - Logical Flaws & Fallacies Detection",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_13",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_085",
    "name": "Legal Reasoning - Principle-Fact Application",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_086",
    "name": "Law of Torts - Negligence & Strict Liability",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_087",
    "name": "Law of Contracts - Offer, Acceptance & Consideration",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_088",
    "name": "Criminal Law - Mens Rea & Actus Reus",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_089",
    "name": "Constitutional Law - Fundamental Rights & Writs",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_090",
    "name": "Legal Maxims & Terminology",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_091",
    "name": "International Law & Treaties Overview",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_092",
    "name": "Intellectual Property Rights Basics",
    "domain": "CRITICAL_REASONING_AND_LEGAL_APTITUDE",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_093",
    "name": "Units, Dimensions & Error Analysis",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_094",
    "name": "Kinematics 1D & 2D Motion",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_095",
    "name": "Newton's Laws of Motion & Friction",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_096",
    "name": "Work, Power & Energy Theorem",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_097",
    "name": "Center of Mass & Rigid Body Collisions",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_098",
    "name": "Rotational Dynamics & Torque",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_099",
    "name": "Gravitation & Planetary Motion",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_100",
    "name": "Elasticity & Fluid Mechanics",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_101",
    "name": "Thermal Properties & Calorimetry",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_102",
    "name": "Thermodynamics & Heat Engines",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_103",
    "name": "Simple Harmonic Motion (SHM)",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_104",
    "name": "Waves & Doppler Effect",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_105",
    "name": "Electrostatics - Coulomb's Law & Field",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_106",
    "name": "Gauss Law & Electric Potential",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_107",
    "name": "Capacitors & Dielectrics",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_108",
    "name": "Current Electricity & Kirchhoff's Laws",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_109",
    "name": "Magnetic Effects of Current - Biot-Savart",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_110",
    "name": "Electromagnetic Induction & Faraday's Law",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_111",
    "name": "Alternating Current & LCR Circuits",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_112",
    "name": "Ray Optics - Lenses & Mirrors",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_113",
    "name": "Wave Optics - Interference & Diffraction",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_114",
    "name": "Dual Nature of Matter & Photoelectric Effect",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_115",
    "name": "Atoms & Nuclei - Radioactivity Decay",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_116",
    "name": "Semiconductor Physics & Logic Gates",
    "domain": "PHYSICS_SCIENCE",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_117",
    "name": "Mole Concept & Stoichiometry",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_118",
    "name": "Atomic Structure & Quantum Numbers",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_119",
    "name": "Periodic Classification & Periodicity",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_120",
    "name": "Chemical Bonding - VSEPR & Hybridization",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_121",
    "name": "States of Matter & Gas Laws",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_122",
    "name": "Chemical Thermodynamics & Enthalpy",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_123",
    "name": "Chemical & Ionic Equilibrium",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_124",
    "name": "Redox Reactions & Oxidation Numbers",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_125",
    "name": "Electrochemistry - Nernst Equation",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_126",
    "name": "Chemical Kinetics & Order of Reaction",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_127",
    "name": "Solutions - Colligative Properties",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_05",
    "secondary_cognitive_class": "COG_15",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_128",
    "name": "Surface Chemistry - Adsorption & Colloids",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_129",
    "name": "Inorganic - s-Block & p-Block Elements",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_130",
    "name": "Inorganic - d-Block & f-Block Elements",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_131",
    "name": "Inorganic - Coordination Chemistry & Isomerism",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_132",
    "name": "Organic - IUPAC Nomenclature & Isomerism",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_133",
    "name": "Organic - General Organic Chemistry (GOC Concepts)",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_134",
    "name": "Organic - Hydrocarbons (Alkanes, Alkenes, Alkynes)",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_135",
    "name": "Organic - Haloalkanes & Haloarenes Reactions",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_136",
    "name": "Organic - Alcohols, Phenols & Ethers",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_137",
    "name": "Organic - Aldehydes, Ketones & Carboxylic Acids",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_138",
    "name": "Organic - Amines & Diazonium Salts",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_139",
    "name": "Biomolecules & Polymers",
    "domain": "CHEMISTRY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_140",
    "name": "Cell Unit of Life & Organelles",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_141",
    "name": "Cell Cycle & Mitosis/Meiosis Stages",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_02",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_142",
    "name": "Plant Diversity & Biological Classification",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_143",
    "name": "Animal Kingdom Classification & Phyla",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_144",
    "name": "Plant Anatomy & Morphology",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_145",
    "name": "Plant Physiology - Photosynthesis & Respiration",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_146",
    "name": "Human Digestion & Absorption System",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_147",
    "name": "Human Circulation & Heart Physiology",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_148",
    "name": "Human Excretion & Osmoregulation",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_149",
    "name": "Nervous System & Endocrine Signaling",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_150",
    "name": "Genetics - Mendelian Inheritance Laws",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_151",
    "name": "Molecular Genetics - DNA Replication & Transcription",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_152",
    "name": "Evolution & Natural Selection Principles",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_153",
    "name": "Biotechnology - PCR & Recombinant DNA",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_154",
    "name": "Ecosystems & Biodiversity Conservation",
    "domain": "BIOLOGY_SCIENCE",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_155",
    "name": "Figure Matrix Completion",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_156",
    "name": "Paper Folding & Cutting Visuals",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_157",
    "name": "Mirror & Water Image Reflections",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_158",
    "name": "Embedded Figures Detection",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_02",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_159",
    "name": "Pattern Rotation & 3D Spatial Folding",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_160",
    "name": "Counting Triangles & Geometric Shapes",
    "domain": "NON_VERBAL_AND_SPATIAL_REASONING",
    "primary_cognitive_class": "COG_09",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_161",
    "name": "Indian History - Ancient Civilizations",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_162",
    "name": "Indian History - Medieval Dynasties",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_163",
    "name": "Indian History - Modern Freedom Movement",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_164",
    "name": "Geography - Indian Physical Topography",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_12",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_165",
    "name": "Geography - World Climatic Zones & Rivers",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_02",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_166",
    "name": "Indian Polity - Parliamentary System & Constitutional Bodies",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_167",
    "name": "Economics - GDP, Inflation & Monetary Policy",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_168",
    "name": "Economics - Budget, Taxation & Deficits",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_169",
    "name": "Static GK - National Parks & Wildlife Sanctuaries",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_170",
    "name": "Static GK - International Organizations (UN, IMF, WB)",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_11",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_171",
    "name": "Static GK - Awards, Honors & Nobel Laureates",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_172",
    "name": "Current Affairs - National Policies & Schemes",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_173",
    "name": "Current Affairs - Bilateral Relations & Summits",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_174",
    "name": "Current Affairs - Sports, Tournaments & Records",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_09",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_175",
    "name": "Current Affairs - Science & Space Technology",
    "domain": "GENERAL_KNOWLEDGE_AND_CURRENT_AFFAIRS",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_176",
    "name": "Management Principles & Fayol's Rules",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_177",
    "name": "Business Environment & PESTEL Framework",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_178",
    "name": "Functions of Management - Planning & Organizing",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_179",
    "name": "Marketing Management - 4Ps & Segmentation",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_180",
    "name": "Financial Markets - Stock Exchange & SEBI",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_06",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_181",
    "name": "Accounting Principles & Double Entry",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_182",
    "name": "Financial Statement Analysis & Ratios",
    "domain": "BUSINESS_STUDIES_AND_MANAGEMENT",
    "primary_cognitive_class": "COG_06",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_183",
    "name": "Computer Hardware Architecture & CPU Operations",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_184",
    "name": "Number Systems - Binary, Hex & Octal Conversions",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_05",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_185",
    "name": "Boolean Algebra & Logic Gate Minimization",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_186",
    "name": "Data Structures - Arrays, Stacks & Queues",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_187",
    "name": "Data Structures - Trees & Graphs",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_188",
    "name": "Algorithms - Sorting & Searching Complexity",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_01",
    "secondary_cognitive_class": "COG_10",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_189",
    "name": "Object Oriented Programming (OOP) Concepts",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_190",
    "name": "Database Management - SQL Queries & Normalization",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_191",
    "name": "Computer Networks - OSI Model & TCP/IP",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_192",
    "name": "Cyber Security & Encryption Basics",
    "domain": "COMPUTER_SCIENCE_AND_INFORMATION_TECHNOLOGY",
    "primary_cognitive_class": "COG_08",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_193",
    "name": "Psychology - Intelligence Theories & IQ Testing",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_194",
    "name": "Psychology - Personality Traits & Assessment",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_03",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_195",
    "name": "Psychology - Learning Theories (Pavlov, Skinner)",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_14",
    "secondary_cognitive_class": "COG_03",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_196",
    "name": "Sociology - Social Institutions & Stratification",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "EASY",
    "base_token_cost": 2
  },
  {
    "subtopic_id": "SUB_197",
    "name": "Sociology - Social Change & Movements",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_198",
    "name": "Political Science - Political Ideologies (Liberalism, Socialism)",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_04",
    "secondary_cognitive_class": "COG_13",
    "cognitive_complexity_tier": "MEDIUM",
    "base_token_cost": 3
  },
  {
    "subtopic_id": "SUB_199",
    "name": "Political Science - International Relations Theories",
    "domain": "HUMANITIES_SOCIOLOGY_AND_PSYCHOLOGY",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_04",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 4
  },
  {
    "subtopic_id": "SUB_200",
    "name": "Integrated Multi-Domain Case Studies",
    "domain": "ADVANCED_REASONING_AND_INTEGRATED_CASES",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_07",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_201",
    "name": "Algorithmic Puzzle Optimization",
    "domain": "ADVANCED_REASONING_AND_INTEGRATED_CASES",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_202",
    "name": "Game Theory & Payoff Matrix Decisions",
    "domain": "ADVANCED_REASONING_AND_INTEGRATED_CASES",
    "primary_cognitive_class": "COG_07",
    "secondary_cognitive_class": "COG_01",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_203",
    "name": "Complex Deductive Logic Grid Solutions",
    "domain": "ADVANCED_REASONING_AND_INTEGRATED_CASES",
    "primary_cognitive_class": "COG_10",
    "secondary_cognitive_class": "COG_14",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  },
  {
    "subtopic_id": "SUB_204",
    "name": "Abstract Spatial-Temporal Reasoning",
    "domain": "ADVANCED_REASONING_AND_INTEGRATED_CASES",
    "primary_cognitive_class": "COG_12",
    "secondary_cognitive_class": "COG_08",
    "cognitive_complexity_tier": "HARD",
    "base_token_cost": 5
  }
];
