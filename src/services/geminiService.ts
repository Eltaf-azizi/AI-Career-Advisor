import { GoogleGenAI, Type } from "@google/genai";
import { Career } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    
    const data = JSON.parse(response.text);
    return { ...data, id: Math.floor(Math.random() * 1000000) }; // Random ID for generated careers
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

