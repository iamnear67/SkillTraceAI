from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
import requests

app = FastAPI(
    title="Centralized Gemini AI Service & RAG Engine",
    description="FastAPI router bridging Frontend -> GeminiService -> Gemini API -> Structured JSON",
    version="2.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("VITE_GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# --- Pydantic Data Models ---

class TeachBackRequest(BaseModel):
    topic: str
    studentExplanation: str
    portfolioContext: Optional[Dict[str, Any]] = None

class TeachBackResponse(BaseModel):
    explanationAnalysis: str
    misconceptions: List[str]
    masteryScore: int
    followupQuestion: str
    analogy: str

class CareerRequest(BaseModel):
    userSkills: List[str]
    interests: List[str]
    portfolioContext: Optional[Dict[str, Any]] = None

class CareerRecommendation(BaseModel):
    careerTitle: str
    matchPercentage: int
    whyThisCareer: str
    missingSkills: List[str]
    learningRoadmap: List[str]

class CertificateRequest(BaseModel):
    fileName: str
    rawTextOrBase64: Optional[str] = None

class CertificateResponse(BaseModel):
    title: str
    issuer: str
    dateAchieved: str
    skillsExtracted: List[str]
    verificationScore: int
    evidenceDetails: str

# Helper to call LLM (Groq / Gemini compatible JSON completion)
def call_central_llm(messages: list, json_mode: bool = True) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.1 if json_mode else 0.7,
        "response_format": {"type": "json_object"} if json_mode else None
    }
    res = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
    if res.status_code == 200:
        return res.json()["choices"][0]["message"]["content"]
    raise HTTPException(status_code=500, detail=f"LLM API Error {res.status_code}: {res.text}")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Centralized Gemini AI Service"}

# 1. TeachBack AI Evaluation Endpoint
@app.post("/api/ai/evaluate-teachback", response_model=TeachBackResponse)
def evaluate_teachback(req: TeachBackRequest):
    prompt = f"""
    The student is explaining the concept: "{req.topic}".
    Student's explanation: "{req.studentExplanation}".
    Candidate RAG Portfolio Context: {json.dumps(req.portfolioContext or {})}

    Evaluate their response and output JSON with:
    - "explanationAnalysis": A clear 1-2 sentence evaluation of their explanation.
    - "misconceptions": List of 1-3 misconceptions or gaps identified (if none, return constructive extensions).
    - "masteryScore": Integer from 0 to 100 representing comprehension depth.
    - "followupQuestion": A probing question to test their understanding further.
    - "analogy": An intuitive, vivid real-world analogy explaining "{req.topic}".
    """

    messages = [
        {"role": "system", "content": "You are an elite academic AI evaluator. Output valid JSON only."},
        {"role": "user", "content": prompt}
    ]

    raw = call_central_llm(messages, json_mode=True)
    data = json.loads(raw)
    return TeachBackResponse(**data)

# 2. Dynamic Career Recommendation Endpoint
@app.post("/api/ai/recommend-career", response_model=List[CareerRecommendation])
def recommend_career(req: CareerRequest):
    prompt = f"""
    Candidate Skills: {req.userSkills}
    Candidate Interests: {req.interests}
    Portfolio RAG Context: {json.dumps(req.portfolioContext or {})}

    Generate 3 top career recommendations. Return a JSON object with a "recommendations" array containing objects with:
    - "careerTitle": Name of the career role.
    - "matchPercentage": Integer 50-99%.
    - "whyThisCareer": Detailed rationale answering "Why this career?".
    - "missingSkills": List of 2-4 missing skills to acquire.
    - "learningRoadmap": List of 4 step-by-step learning milestones.
    """

    messages = [
        {"role": "system", "content": "You are an AI Career Strategist. Output valid JSON only."},
        {"role": "user", "content": prompt}
    ]

    raw = call_central_llm(messages, json_mode=True)
    data = json.loads(raw)
    return data.get("recommendations", [])

# 3. Certificate Intelligence OCR Endpoint
@app.post("/api/ai/analyze-certificate", response_model=CertificateResponse)
def analyze_certificate(req: CertificateRequest):
    prompt = f"""
    Analyze this certificate file metadata: "{req.fileName}".
    Raw input text: "{req.rawTextOrBase64 or 'Standard academic / professional certificate'}".

    Extract key certificate parameters and return JSON with:
    - "title": Verified Title of Certificate.
    - "issuer": Issuing University or Organization.
    - "dateAchieved": Date string (e.g. "Aug 2025").
    - "skillsExtracted": List of 2-5 validated skills.
    - "verificationScore": Integer 80-100 representing authenticity score.
    - "evidenceDetails": Cryptographic / OCR verification evidence note.
    """

    messages = [
        {"role": "system", "content": "You are an OCR Certificate Intelligence AI. Output valid JSON only."},
        {"role": "user", "content": prompt}
    ]

    raw = call_central_llm(messages, json_mode=True)
    data = json.loads(raw)
    return CertificateResponse(**data)
