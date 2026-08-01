export interface ExamSubject {
  name: string;
  weight: number; // percentage
  cognitive_classes: string[]; // related COG classes
}

export interface CollegeTierMapping {
  tier: string;
  score_rank_expectation: string;
  target_colleges: string[];
}

export interface ExamData {
  id: string;
  exam_name: string;
  category: string;
  conducting_body: string;
  selection_model: string;
  total_marks: number;
  cutoff_tier1: number;
  subjects: ExamSubject[];
  college_mapping: CollegeTierMapping[];
}

export const examsData: ExamData[] = [
  {
    "id": "jee_main",
    "exam_name": "JEE Main",
    "category": "Engineering (UG)",
    "conducting_body": "National Testing Agency (NTA)",
    "selection_model": "Rank/Percentile Tier",
    "college_mapping": [
      {
        "tier": "Tier 1 (Top NITs/IIITs)",
        "score_rank_expectation": "AIR 1 - 12,000 (~99.0+ Percentile)",
        "target_colleges": [
          "NIT Trichy",
          "NIT Surathkal",
          "NIT Warangal",
          "IIIT Allahabad",
          "MNNIT Allahabad"
        ]
      },
      {
        "tier": "Tier 1.5 (Mid NITs/IIITs/GFTIs)",
        "score_rank_expectation": "AIR 12,001 - 35,000 (~97.0 - 98.9 Percentile)",
        "target_colleges": [
          "VNIT Nagpur",
          "MNIT Jaipur",
          "IIIT Gwalior",
          "PEC Chandigarh",
          "BIT Mesra"
        ]
      },
      {
        "tier": "Tier 2 (Newer NITs/IIITs & Top State/Private)",
        "score_rank_expectation": "AIR 35,001 - 85,000 (~93.0 - 96.9 Percentile)",
        "target_colleges": [
          "NIT Meghalaya",
          "IIIT Una",
          "LNMIIT Jaipur",
          "Thapar University (JEE Quota)",
          "State Govt Colleges"
        ]
      }
    ],
    "total_marks": 300,
    "cutoff_tier1": 180,
    "subjects": [
      {
        "name": "Mathematics",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_01",
          "COG_05",
          "COG_08"
        ]
      },
      {
        "name": "Physics",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_05",
          "COG_12",
          "COG_15"
        ]
      },
      {
        "name": "Chemistry",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_03",
          "COG_05",
          "COG_14"
        ]
      }
    ]
  },
  {
    "id": "jee_advanced",
    "exam_name": "JEE Advanced",
    "category": "Engineering (UG)",
    "conducting_body": "IITs (Rotational)",
    "selection_model": "Binary Rank Allocation",
    "college_mapping": [
      {
        "tier": "Top Old IITs (Core CS/ECE)",
        "score_rank_expectation": "AIR 1 - 1,500",
        "target_colleges": [
          "IIT Bombay",
          "IIT Delhi",
          "IIT Madras",
          "IIT Kanpur",
          "IIT Kharagpur"
        ]
      },
      {
        "tier": "Old IITs (Other Branches) & Top 2nd Gen IITs",
        "score_rank_expectation": "AIR 1,501 - 6,000",
        "target_colleges": [
          "IIT Roorkee",
          "IIT Guwahati",
          "IIT BHU",
          "IIT Hyderabad",
          "IIT Indore"
        ]
      },
      {
        "tier": "3rd Gen IITs & Lower Branches in 2nd Gen",
        "score_rank_expectation": "AIR 6,001 - 17,500",
        "target_colleges": [
          "IIT Tirupati",
          "IIT Palakkad",
          "IIT Dharwad",
          "IIT Bhilai",
          "IIT Jammu"
        ]
      }
    ],
    "total_marks": 360,
    "cutoff_tier1": 180,
    "subjects": [
      {
        "name": "Mathematics",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_01",
          "COG_08",
          "COG_10"
        ]
      },
      {
        "name": "Physics",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_01",
          "COG_05",
          "COG_12"
        ]
      },
      {
        "name": "Chemistry",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_03",
          "COG_10",
          "COG_14"
        ]
      }
    ]
  },
  {
    "id": "bitsat",
    "exam_name": "BITSAT",
    "category": "Engineering (UG)",
    "conducting_body": "BITS Pilani",
    "selection_model": "Score Threshold Cutoff",
    "college_mapping": [
      {
        "tier": "Flagship Campus (CS/ECE)",
        "score_rank_expectation": "320+ / 390 marks",
        "target_colleges": [
          "BITS Pilani (Pilani Campus)"
        ]
      },
      {
        "tier": "Goa & Hyderabad Campuses (CS/ECE)",
        "score_rank_expectation": "285 - 319 marks",
        "target_colleges": [
          "BITS Pilani (Goa Campus)",
          "BITS Pilani (Hyderabad Campus)"
        ]
      },
      {
        "tier": "Core & Dual Degree Branches (All Campuses)",
        "score_rank_expectation": "210 - 284 marks",
        "target_colleges": [
          "BITS Pilani",
          "BITS Goa",
          "BITS Hyderabad"
        ]
      }
    ],
    "total_marks": 390,
    "cutoff_tier1": 320,
    "subjects": [
      {
        "name": "Mathematics",
        "weight": 40,
        "cognitive_classes": [
          "COG_01",
          "COG_05"
        ]
      },
      {
        "name": "Physics",
        "weight": 26.7,
        "cognitive_classes": [
          "COG_05",
          "COG_12"
        ]
      },
      {
        "name": "Chemistry",
        "weight": 20,
        "cognitive_classes": [
          "COG_03",
          "COG_05"
        ]
      },
      {
        "name": "English Proficiency & Logical Reasoning",
        "weight": 13.3,
        "cognitive_classes": [
          "COG_11",
          "COG_09",
          "COG_10"
        ]
      }
    ]
  },
  {
    "id": "neet_ug",
    "exam_name": "NEET UG",
    "category": "Medical (UG)",
    "conducting_body": "National Testing Agency (NTA)",
    "selection_model": "Rank/Percentile Tier",
    "college_mapping": [
      {
        "tier": "Premier Medical Institutes",
        "score_rank_expectation": "AIR 1 - 1,000 (690+ / 720 marks)",
        "target_colleges": [
          "AIIMS New Delhi",
          "JIPMER Puducherry",
          "MAMC New Delhi",
          "VMMC New Delhi"
        ]
      },
      {
        "tier": "Top State Govt Medical Colleges (AIQ)",
        "score_rank_expectation": "AIR 1,001 - 22,000 (655+ / 720 marks)",
        "target_colleges": [
          "KGMU Lucknow",
          "BMC Bangalore",
          "Grant Medical College Mumbai",
          "SMS Jaipur"
        ]
      },
      {
        "tier": "Deemed / Top Private Medical Colleges",
        "score_rank_expectation": "AIR 22,001 - 1,500,000 (Passing to 600 marks)",
        "target_colleges": [
          "KMC Manipal",
          "Hamdard Institute",
          "SRM Medical College",
          "DY Patil Pune"
        ]
      }
    ],
    "total_marks": 720,
    "cutoff_tier1": 655,
    "subjects": [
      {
        "name": "Biology",
        "weight": 50,
        "cognitive_classes": [
          "COG_03",
          "COG_04"
        ]
      },
      {
        "name": "Chemistry",
        "weight": 25,
        "cognitive_classes": [
          "COG_03",
          "COG_05"
        ]
      },
      {
        "name": "Physics",
        "weight": 25,
        "cognitive_classes": [
          "COG_05",
          "COG_15"
        ]
      }
    ]
  },
  {
    "id": "clat_ug",
    "exam_name": "CLAT UG",
    "category": "Law (UG)",
    "conducting_body": "Consortium of NLUs",
    "selection_model": "Rank/Percentile Tier",
    "college_mapping": [
      {
        "tier": "Top Tier NLUs (Tier 1)",
        "score_rank_expectation": "AIR 1 - 300",
        "target_colleges": [
          "NLSIU Bengaluru",
          "NALSAR Hyderabad",
          "WBNUJS Kolkata"
        ]
      },
      {
        "tier": "Mid Tier NLUs (Tier 2)",
        "score_rank_expectation": "AIR 301 - 1,500",
        "target_colleges": [
          "NLU Jodhpur",
          "GNLU Gandhinagar",
          "NLIU Bhopal",
          "RMLNLU Lucknow"
        ]
      },
      {
        "tier": "Newer NLUs & Affiliated Private Schools",
        "score_rank_expectation": "AIR 1,501 - 4,000",
        "target_colleges": [
          "NLU Odisha",
          "NUSRL Ranchi",
          "NMIMS School of Law",
          "UPES Dehradun"
        ]
      }
    ],
    "total_marks": 120,
    "cutoff_tier1": 88,
    "subjects": [
      {
        "name": "Legal Reasoning",
        "weight": 25,
        "cognitive_classes": [
          "COG_07",
          "COG_13"
        ]
      },
      {
        "name": "GK & Current Affairs",
        "weight": 25,
        "cognitive_classes": [
          "COG_03"
        ]
      },
      {
        "name": "Logical Reasoning",
        "weight": 20,
        "cognitive_classes": [
          "COG_13",
          "COG_10"
        ]
      },
      {
        "name": "English Language",
        "weight": 20,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      },
      {
        "name": "Quantitative Techniques",
        "weight": 10,
        "cognitive_classes": [
          "COG_06",
          "COG_15"
        ]
      }
    ]
  },
  {
    "id": "ipmat__indore_",
    "exam_name": "IPMAT (Indore)",
    "category": "Management (Integrated UG/PG)",
    "conducting_body": "IIM Indore",
    "selection_model": "Benchmark Cutoff + Interview",
    "college_mapping": [
      {
        "tier": "Premier 5-Year Integrated Management",
        "score_rank_expectation": "Top 150 Applicants after PI",
        "target_colleges": [
          "IIM Indore (IPM)",
          "IIM Ranchi",
          "IIFT Kakinada",
          "TAPMI (IPM)"
        ]
      }
    ],
    "total_marks": 360,
    "cutoff_tier1": 170,
    "subjects": [
      {
        "name": "Quantitative Ability MCQ",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_01",
          "COG_08"
        ]
      },
      {
        "name": "Quantitative Ability Short Answer",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_01",
          "COG_10"
        ]
      },
      {
        "name": "Verbal Ability MCQ",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      }
    ]
  },
  {
    "id": "ipmat__rohtak_",
    "exam_name": "IPMAT (Rohtak)",
    "category": "Management (Integrated UG/PG)",
    "conducting_body": "IIM Rohtak",
    "selection_model": "Rank Cutoff + Interview",
    "college_mapping": [
      {
        "tier": "Premier 5-Year Integrated Management",
        "score_rank_expectation": "Top 180 Applicants after PI",
        "target_colleges": [
          "IIM Rohtak (IPM)"
        ]
      }
    ],
    "total_marks": 480,
    "cutoff_tier1": 260,
    "subjects": [
      {
        "name": "Quantitative Ability",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_05",
          "COG_06"
        ]
      },
      {
        "name": "Logical Reasoning",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_10",
          "COG_02"
        ]
      },
      {
        "name": "Verbal Ability",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      }
    ]
  },
  {
    "id": "jipmat",
    "exam_name": "JIPMAT",
    "category": "Management (Integrated UG/PG)",
    "conducting_body": "National Testing Agency (NTA)",
    "selection_model": "Rank Tier",
    "college_mapping": [
      {
        "tier": "5-Year Integrated Management at IIMs",
        "score_rank_expectation": "Score 310+ / 400",
        "target_colleges": [
          "IIM Jammu",
          "IIM Bodh Gaya"
        ]
      }
    ],
    "total_marks": 400,
    "cutoff_tier1": 310,
    "subjects": [
      {
        "name": "Quantitative Aptitude",
        "weight": 33,
        "cognitive_classes": [
          "COG_01",
          "COG_05"
        ]
      },
      {
        "name": "Data Interpretation & Logical Reasoning",
        "weight": 33,
        "cognitive_classes": [
          "COG_06",
          "COG_10"
        ]
      },
      {
        "name": "Verbal Ability",
        "weight": 34,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      }
    ]
  },
  {
    "id": "cuet_ug",
    "exam_name": "CUET UG",
    "category": "Multidisciplinary (UG)",
    "conducting_body": "National Testing Agency (NTA)",
    "selection_model": "Normalized Score Tier",
    "college_mapping": [
      {
        "tier": "North Campus Delhi University & Top Central Universities",
        "score_rank_expectation": "780+ / 800 (Score dependent)",
        "target_colleges": [
          "St. Stephen's College",
          "SRCC",
          "Hindu College",
          "Miranda House",
          "JNU Delhi",
          "BHU Varanasi"
        ]
      },
      {
        "tier": "South Campus DU & Tier 2 Central Universities",
        "score_rank_expectation": "680 - 779 marks",
        "target_colleges": [
          "LSR New Delhi",
          "Venky Delhi",
          "University of Hyderabad",
          "Jamia Millia Islamia"
        ]
      }
    ],
    "total_marks": 800,
    "cutoff_tier1": 750,
    "subjects": [
      {
        "name": "Language (English/Hindi)",
        "weight": 25,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      },
      {
        "name": "Domain Subject 1",
        "weight": 25,
        "cognitive_classes": [
          "COG_01",
          "COG_05"
        ]
      },
      {
        "name": "Domain Subject 2",
        "weight": 25,
        "cognitive_classes": [
          "COG_03",
          "COG_08"
        ]
      },
      {
        "name": "General Test / Domain 3",
        "weight": 25,
        "cognitive_classes": [
          "COG_06",
          "COG_09",
          "COG_10"
        ]
      }
    ]
  },
  {
    "id": "nmims_npat",
    "exam_name": "NMIMS NPAT",
    "category": "Management & Commerce (UG)",
    "conducting_body": "SVKM's NMIMS",
    "selection_model": "Score/Rank Threshold",
    "total_marks": 120,
    "cutoff_tier1": 78,
    "subjects": [
      {
        "name": "Quantitative & Numerical Ability",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_06",
          "COG_15"
        ]
      },
      {
        "name": "Reasoning & General Intelligence",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_09",
          "COG_10",
          "COG_02"
        ]
      },
      {
        "name": "Proficiency in English Language",
        "weight": 33.3,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      }
    ],
    "college_mapping": [
      {
        "tier": "Tier 1 Flagship (BBA / B.Sc Finance)",
        "score_rank_expectation": "Score 78+ / 120 marks",
        "target_colleges": [
          "NMIMS Mumbai (Anil Surendra Modi School of Commerce)"
        ]
      },
      {
        "tier": "Tier 2 Campuses (BBA)",
        "score_rank_expectation": "Score 68 - 77 marks",
        "target_colleges": [
          "NMIMS Bengaluru",
          "NMIMS Navi Mumbai",
          "NMIMS Hyderabad",
          "NMIMS Indore"
        ]
      }
    ]
  },
  {
    "id": "set_symbiosis",
    "exam_name": "SET (Symbiosis Entrance Test)",
    "category": "Management & Humanities (UG)",
    "conducting_body": "Symbiosis International University",
    "selection_model": "Score Cutoff + PI",
    "total_marks": 60,
    "cutoff_tier1": 48,
    "subjects": [
      {
        "name": "General English",
        "weight": 25,
        "cognitive_classes": [
          "COG_04",
          "COG_11"
        ]
      },
      {
        "name": "Quantitative",
        "weight": 25,
        "cognitive_classes": [
          "COG_05",
          "COG_06"
        ]
      },
      {
        "name": "General Awareness",
        "weight": 25,
        "cognitive_classes": [
          "COG_03"
        ]
      },
      {
        "name": "Analytical & Logical Reasoning",
        "weight": 25,
        "cognitive_classes": [
          "COG_10",
          "COG_13"
        ]
      }
    ],
    "college_mapping": [
      {
        "tier": "Tier 1 Flagship BBA",
        "score_rank_expectation": "Score 48+ / 60 marks",
        "target_colleges": [
          "Symbiosis Centre for Management Studies (SCMS Pune)"
        ]
      },
      {
        "tier": "Tier 2 Campuses BBA",
        "score_rank_expectation": "Score 38 - 47 marks",
        "target_colleges": [
          "SCMS Noida",
          "SCMS Bengaluru",
          "SCMS Hyderabad"
        ]
      }
    ]
  }
];
