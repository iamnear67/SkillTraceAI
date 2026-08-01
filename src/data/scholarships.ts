// Scholarships Data exported from gemini-code-1785575608857.json

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  category: string;
  official_url: string;
  target_courses: string[];
  financial_aid: {
    annual_amount_inr?: number;
    total_amount_inr?: number;
    tenure_years?: number;
    tuition_coverage?: string;
    tuition_waiver?: string;
    living_allowance_inr?: number;
    annual_allowance_inr?: number;
    one_time_hardware_allowance_inr?: number;
    breakdown: string;
  };
  eligibility_criteria: {
    academic_performance?: {
      min_percentage_10_2?: number;
      percentile_in_board_exam?: string;
      cgpa_maintenance_cutoff?: number;
    };
    max_family_income_inr?: number | null;
    preferred_family_income_inr?: number;
    domicile?: string;
    special_eligibility?: string;
    category_restriction?: string[];
    institutional_requirement?: string;
    exclusions?: string;
  };
}

export const scholarshipsData: Scholarship[] = [
  {
    id: "SCH_DST_INSPIRE_SHE",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    provider: "Department of Science & Technology (DST), Govt. of India",
    category: "Merit-Based / Government",
    official_url: "https://online-inspire.gov.in",
    target_courses: ["B.Sc.", "B.S.", "Int. M.Sc.", "Int. M.S."],
    financial_aid: {
      annual_amount_inr: 80000,
      breakdown: "₹60,000 cash grant + ₹20,000 mentorship/summer project allowance"
    },
    eligibility_criteria: {
      academic_performance: {
        min_percentage_10_2: 90.0,
        percentile_in_board_exam: "Top 1%"
      },
      max_family_income_inr: null,
      domicile: "India",
      special_eligibility: "KVPY, NTSE, JBNSTS scholars or International Olympiad Medalists pursuing basic/natural sciences."
    }
  },
  {
    id: "SCH_RF_UG_2026",
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    category: "Means-cum-Merit / Private CSR",
    official_url: "https://www.scholarships.reliancefoundation.org",
    target_courses: ["B.Tech", "B.E.", "B.Com", "B.Sc.", "B.A.", "LL.B", "MBBS"],
    financial_aid: {
      total_amount_inr: 200000,
      tenure_years: 4,
      breakdown: "Up to ₹2,00,000 over the duration of the degree program"
    },
    eligibility_criteria: {
      academic_performance: {
        min_percentage_10_2: 60.0
      },
      max_family_income_inr: 1500000,
      preferred_family_income_inr: 250000
    }
  },
  {
    id: "SCH_NSP_TOP_CLASS_SC",
    name: "Central Sector Top Class Education Scheme for SC Students",
    provider: "Ministry of Social Justice and Empowerment (NSP Portal)",
    category: "Need-Based / Social Category",
    official_url: "https://scholarships.gov.in",
    target_courses: ["B.Tech", "MBBS", "B.A. LL.B", "MBA", "Design"],
    financial_aid: {
      tuition_coverage: "100% full tuition fee",
      living_allowance_inr: 3000,
      one_time_hardware_allowance_inr: 45000,
      breakdown: "100% full tuition fee + ₹3,000/mo living allowance + ₹45,000 hardware grant"
    },
    eligibility_criteria: {
      category_restriction: ["SC"],
      max_family_income_inr: 800000,
      academic_performance: {
        min_percentage_10_2: 60.0
      },
      institutional_requirement: "Must secure admission into notified top-tier institutes (IITs, NITs, IIMs, AIIMS, NLUs, IIITs)"
    }
  },
  {
    id: "SCH_ADITYA_BIRLA_UG",
    name: "Aditya Birla Capital Scholarship",
    provider: "Aditya Birla Capital Foundation",
    category: "Means-cum-Merit / Corporate CSR",
    official_url: "https://www.adityabirlacapital.com",
    target_courses: ["B.Tech", "B.E.", "B.Sc.", "B.Com", "B.A.", "Professional UG"],
    financial_aid: {
      annual_amount_inr: 36000,
      breakdown: "One-time annual grant of ₹36,000 for standard UG, up to ₹60,000 for professional degree programs"
    },
    eligibility_criteria: {
      academic_performance: {
        min_percentage_10_2: 60.0
      },
      max_family_income_inr: 600000,
      domicile: "India",
      exclusions: "Children of Aditya Birla Group employees are ineligible"
    }
  },
  {
    id: "SCH_IITB_MEANS_CUM_MERIT",
    name: "IIT Bombay Merit-cum-Means (MCM) Scholarship",
    provider: "Indian Institute of Technology, Bombay",
    category: "Institutional / Need-Based",
    official_url: "https://www.iitb.ac.in",
    target_courses: ["B.Tech", "Dual Degree (B.Tech + M.Tech)", "B.S."],
    financial_aid: {
      tuition_waiver: "100% tuition fee waiver",
      annual_allowance_inr: 10000,
      breakdown: "100% tuition fee waiver + ₹10,000 annual pocket allowance"
    },
    eligibility_criteria: {
      max_family_income_inr: 500000,
      category_restriction: ["General", "OBC-NCL", "EWS"],
      academic_performance: {
        cgpa_maintenance_cutoff: 6.0
      },
      institutional_requirement: "Enrolled as a full-time undergraduate student at IIT Bombay"
    }
  }
];
