export interface Question {
  id: number;
  text: string;
  category: string;
  traits: Record<string, number>;
}

export interface Career {
  id: number;
  career_name: string;
  description: string;
  traits: Record<string, number>;
  required_skills: string[];
  education_path: string;
  salary_range: string;
  future_demand: string;
  learning_roadmap: string[];
  match_percentage?: number;
}

export interface UserResult {
  resultId: number;
  traits: Record<string, number>;
  matches: {
    id: number;
    career_name: string;
    match_percentage: number;
    description: string;
  }[];
}

export interface CareerField {
  field: string;
  description: string;
  careers: string[];
}
