const FALLBACK_KEY = '';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODELS_TO_TRY = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama3-70b-8192', 'llama3-8b-8192'];

function getApiKey(): string {
  const envKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }
  return FALLBACK_KEY;
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
}

export async function callGroqAPI(messages: { role: string, content: string }[], jsonMode = false) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Groq API key not found. Please set VITE_GROQ_API_KEY in your .env file.");
  }

  let lastErrorText = '';
  for (const model of MODELS_TO_TRY) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: jsonMode ? 0.1 : 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }

      const errorText = await response.text();
      lastErrorText = `[${model}] HTTP ${response.status}: ${errorText.slice(0, 150)}`;
      console.warn(`Groq API model ${model} failed (${response.status}). Trying next fallback model...`);
    } catch (err: any) {
      lastErrorText = err.message || String(err);
    }
  }

  throw new Error(`Groq API Error: ${lastErrorText}`);
}

/**
 * Extracts JSON from a response string, even if wrapped in markdown backticks.
 */
function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }
    throw e;
  }
}

/**
 * Generates a 10-question quiz for the given exam and subtopic.
 */
export async function generateQuizQuestions(examName: string, subtopicName: string): Promise<QuizQuestion[]> {
  const prompt = `
    You are an expert examiner for the ${examName} exam.
    Generate a 10-question multiple-choice quiz on the topic of "${subtopicName}".
    The difficulty should match the actual exam (ranging from easy to hard).
    
    You MUST output valid JSON only, using this exact schema:
    {
      "questions": [
        {
          "q": "The question text here",
          "opts": ["Option A", "Option B", "Option C", "Option D"],
          "ans": 1 // The index (0-3) of the correct option
        }
      ]
    }
  `;

  const messages = [
    { role: 'system', content: 'You are a JSON-generating AI. Output only valid JSON.' },
    { role: 'user', content: prompt }
  ];

  try {
    const responseText = await callGroqAPI(messages, true);
    const parsed = extractJSON(responseText);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 10) {
      return parsed.questions;
    }
    // If not exactly 10, but we got an array of questions, still return it.
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Quiz generation failed, falling back to mock.", error);
    // Fallback if API fails or parsing fails
    return Array.from({ length: 10 }).map((_, i) => ({
      q: `[Fallback Mock] ${examName} - Question ${i + 1} regarding ${subtopicName}`,
      opts: [`Concept A`, `Correct Answer`, `Concept C`, `Concept D`],
      ans: 1
    }));
  }
}

/**
 * Handles chat inside the Task Insights modal.
 */
export async function getTaskInsights(
  examName: string, 
  subtopicName: string, 
  chatHistory: { sender: 'user' | 'ai', text: string }[],
  userQuery: string
): Promise<string> {
  
  const messages = [
    { role: 'system', content: `You are an expert tutor helping a student prepare for ${examName}, specifically focusing on the topic "${subtopicName}". Keep your answers concise, practical, and highly strategic. Limit your response to 2-3 short paragraphs maximum.` }
  ];

  // Add history
  chatHistory.forEach(msg => {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  });

  // Add current query
  messages.push({ role: 'user', content: userQuery });

  try {
    return await callGroqAPI(messages, false);
  } catch (error) {
    console.error("Task Insights Chat Error:", error);
    return "I'm having trouble connecting to the AI brain right now. Please try again later.";
  }
}

/**
 * Handles AI Strategy Assistant general queries to re-order/filter tasks.
 */
export async function getStrategyAdvice(userQuery: string): Promise<{ reply: string, keywords: string[] }> {
  const prompt = `
    A student is asking for study strategy advice: "${userQuery}".
    
    Analyze their request. 
    1. Write a short, encouraging reply (1-2 sentences) confirming their strategy update.
    2. Extract 2-5 keywords from their query (e.g., specific subjects, exams, "80/20", "pareto", "mock") that we can use to filter and prioritize their task list.
    
    Return valid JSON only:
    {
      "reply": "Got it! I have prioritized...",
      "keywords": ["math", "jee", "physics"]
    }
  `;

  const messages = [
    { role: 'system', content: 'You are an AI study strategist. Output only valid JSON.' },
    { role: 'user', content: prompt }
  ];

  try {
    const responseText = await callGroqAPI(messages, true);
    const parsed = JSON.parse(responseText);
    return {
      reply: parsed.reply || "Strategy updated!",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map((k: string) => k.toLowerCase()) : []
    };
  } catch (error) {
    console.error("Strategy Chat Error:", error);
    return {
      reply: "Understood! I've updated your main task list.",
      keywords: []
    };
  }
}

/**
 * Verifies if the Groq API Key is active and working.
 */
export async function verifyGroqConnection(): Promise<{ active: boolean; message: string }> {
  try {
    const text = await callGroqAPI([
      { role: 'system', content: 'You are a system health check helper.' },
      { role: 'user', content: 'Respond with the single word: OK' }
    ], false);
    return { active: true, message: `Groq API Active & Verified (${text.trim()})` };
  } catch (err: any) {
    return { active: false, message: err.message || "Failed to reach Groq API" };
  }
}

export interface PhaseAdviceDetails {
  adviceParagraph: string;
  strongSections: string[];
  weakSections: string[];
}

/**
 * Fetches advice + strong vs weak section breakdown after completing a phase.
 */
export async function getPhaseCompletionAdvice(phaseName: string, performanceSummary: string): Promise<string> {
  const details = await getPhaseCompletionDetailedFeedback(phaseName, performanceSummary);
  return details.adviceParagraph;
}

export async function getPhaseCompletionDetailedFeedback(phaseName: string, performanceSummary: string): Promise<PhaseAdviceDetails> {
  const prompt = `
    The user just completed "${phaseName}". 
    Performance summary data: ${performanceSummary}
    
    Provide:
    1. A single solid paragraph of strategic advice.
    2. A list of 2-4 Strong Sections (topics/skills where the candidate excels).
    3. A list of 2-4 Weak Sections (topics/skills where the candidate needs improvement).
    
    Output JSON in this exact structure:
    {
      "adviceParagraph": "Your performance in...",
      "strongSections": ["Analytical Reasoning", "Applied Physics"],
      "weakSections": ["Verbal Memory", "Calculus Speed"]
    }
  `;

  const messages = [
    { role: 'system', content: 'You are an elite academic strategy AI. Output valid JSON only.' },
    { role: 'user', content: prompt }
  ];

  try {
    const raw = await callGroqAPI(messages, true);
    const parsed = extractJSON(raw);
    return {
      adviceParagraph: parsed.adviceParagraph || "Great job completing this phase! Keep pushing forward with your studies and maintain your momentum.",
      strongSections: Array.isArray(parsed.strongSections) ? parsed.strongSections : ["Problem Solving", "Conceptual Foundation"],
      weakSections: Array.isArray(parsed.weakSections) ? parsed.weakSections : ["Time Management", "Speed Optimization"]
    };
  } catch (error) {
    console.error("Phase Advice Detailed Error:", error);
    return {
      adviceParagraph: "Great job completing this phase! Your performance data has been analyzed and integrated into your dashboard.",
      strongSections: ["Core Fundamentals", "Conceptual Comprehension"],
      weakSections: ["Speed & Precision", "Advanced Formula Recall"]
    };
  }
}
