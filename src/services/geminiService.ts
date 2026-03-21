import { GoogleGenAI, Type } from "@google/genai";
import { Career } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const generateFullCareerDetails = async (careerName: string): Promise<Career> => {
  const prompt = `
    Generate a detailed career profile for the career: ${careerName}.
    Include:
    - A concise description
    - Personality traits (analytical, technical, creativity, communication, leadership, problem_solving, detail, social, helping, organization, business, risk) on a scale of 0-10.
    - Key skills required
    - Typical education path
    - Average salary level (e.g., Low, Medium, High, Very High)
    - Future job demand (e.g., Low, Medium, High, Very High)
    - A 5-step learning roadmap
    
    Return the response in JSON format matching the Career interface.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            career_name: { type: Type.STRING },
            description: { type: Type.STRING },
            traits: {
              type: Type.OBJECT,
              properties: {
                analytical: { type: Type.NUMBER },
                technical: { type: Type.NUMBER },
                creativity: { type: Type.NUMBER },
                communication: { type: Type.NUMBER },
                leadership: { type: Type.NUMBER },
                problem_solving: { type: Type.NUMBER },
                detail: { type: Type.NUMBER },
                social: { type: Type.NUMBER },
                helping: { type: Type.NUMBER },
                organization: { type: Type.NUMBER },
                business: { type: Type.NUMBER },
                risk: { type: Type.NUMBER },
              }
            },
            required_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            education_path: { type: Type.STRING },
            salary_range: { type: Type.STRING },
            future_demand: { type: Type.STRING },
            learning_roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["career_name", "description", "traits", "required_skills", "education_path", "salary_range", "future_demand", "learning_roadmap"]
        }
      }
    });
    
    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }
    const data = JSON.parse(response.text);
    return { ...data, id: Math.floor(Math.random() * 1000000) }; // Random ID for generated careers
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const explainCareerFit = async (career: Career, userTraits: Record<string, number>) => {
  const prompt = `
    A student has the following personality and skill profile (0-10 scale):
    ${Object.entries(userTraits).map(([trait, score]) => `- ${trait}: ${score}`).join("\n")}

    The career recommended for them is: ${career.career_name}.
    Description: ${career.description}
    
    Explain in 3-4 concise paragraphs why this career is a great fit for their specific profile. 
    Focus on how their top strengths align with the career's requirements.
    Use a supportive, encouraging tone like a professional career counselor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate explanation. Please try again later.";
  }
};

export const generateDetailedRoadmap = async (career: Career) => {
  const prompt = `
    Generate a detailed, step-by-step learning roadmap for someone wanting to become a ${career.career_name}.
    
    The career requires these skills: ${career.required_skills.join(", ")}.
    The typical education path is: ${career.education_path}.
    
    Format the response as a clear, structured guide with:
    1. Phase 1: Foundations (3-6 months)
    2. Phase 2: Core Skills (6-12 months)
    3. Phase 3: Specialization & Projects (12+ months)
    4. Phase 4: Job Readiness & Portfolio
    
    For each phase, list specific topics to learn and types of projects to build.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate roadmap. Please try again later.";
  }
};

export const startCareerChat = (career?: Career) => {
  const systemInstruction = `
    You are an expert AI Career Mentor. Your goal is to help students navigate their career choices.
    ${career ? `The student is currently interested in becoming a ${career.career_name}.` : "The student is exploring various career options."}
    
    Be supportive, insightful, and practical. Provide specific advice on skills, education, and industry trends.
    If the student asks about other careers, feel free to discuss them, but always bring it back to how it fits their potential.
    Keep responses concise but informative.
  `;

  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
  });
};
