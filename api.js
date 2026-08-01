/* ==========================================================================
   SkillTrace AI — Centralized REST API Service Module
   ========================================================================== */

const API_BASE = "http://127.0.0.1:8000/api/v1";

class SkillTraceAPI {
  
  static async _request(endpoint, method = "GET", body = null, isFormData = false) {
    const headers = {};
    if (!isFormData && body) {
      headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("st_auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}) on ${endpoint}:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const payload = await response.json();
      return (payload && payload.data !== undefined) ? payload.data : payload;
    } catch (err) {
      console.warn(`API call to ${endpoint} failed, raising exception:`, err);
      throw err;
    }
  }

  // Health Endpoint
  static async getHealth() {
    return this._request("/health");
  }

  // Upload Endpoint (Multipart Form Data)
  static async uploadCertificate(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this._request("/upload", "POST", formData, true);
  }

  // Analyze Endpoint (11-Pillar Competency Scoring)
  static async analyzeCompetencies(skills = [], achievements = [], confidence = 0.95, targetStream = "Engineering") {
    return this._request("/analyze", "POST", {
      skills,
      achievements,
      confidence,
      target_stream: targetStream
    });
  }

  // Career Recommendations Endpoint
  static async getCareerRecommendations(skills = [], competencies = {}, targetCareerId = null) {
    return this._request("/career", "POST", {
      skills,
      competencies,
      target_career_id: targetCareerId
    });
  }

  // TeachBack AI Endpoint
  static async evaluateTeachback(studentName, topic, reflectionText, targetStream = "Engineering", currentDifficulty = "Medium") {
    return this._request("/teachback", "POST", {
      student_name: studentName,
      topic_or_certificate: topic,
      reflection_text: reflectionText,
      target_stream: targetStream,
      current_difficulty: currentDifficulty
    });
  }

  // Knowledge Base Search Endpoint
  static async searchKnowledgeBase(query = "", category = null) {
    let url = `/kb/search?query=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return this._request(url);
  }

  // AI Chatbot & Analogy Endpoints
  static async sendChatMessage(message, history = []) {
    return this._request("/chat/message", "POST", { message, history });
  }

  static async generateAnalogy(concept, domain = "gaming", knowledgeLevel = "intermediate", misconception = null) {
    return this._request("/analogy/explain", "POST", {
      concept,
      domain,
      knowledge_level: knowledgeLevel,
      misconception
    });
  }

  static async exportPortfolio() {
    return this._request("/portfolio/export");
  }

  // Demo Profiles & Data Endpoints
  static async getDemoProfiles() {
    return this._request("/demo/profiles");
  }

  static async getDemoProfile(studentId) {
    return this._request(`/demo/profile/${studentId}`);
  }

  static async getTeachbackExamples() {
    return this._request("/demo/teachback-examples");
  }

  // Authentication Endpoints
  static async login(email, password) {
    return this._request("/auth/login", "POST", { email, password });
  }

  static async getCurrentUser() {
    return this._request("/auth/me");
  }
}

window.SkillTraceAPI = SkillTraceAPI;
