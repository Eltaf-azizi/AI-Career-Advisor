export interface Question {
  id: number;
  text: string;
  category: string;
  traits: Record<string, number>;
}

export interface Career {
  id: number;
  career_name: string;
  tagline?: string;
  description: string;
  responsibilities?: string;
  traits: Record<string, number>;
  required_skills: string[];
  education_path: string;
  work_environment?: string;
  salary_range: string;
  future_demand: string;
  difficulty_level?: string;
  learning_roadmap: string[];
  core_philosophy?: string;
  curriculum?: string[];
  tools_software?: string[];
  sub_disciplines?: string[];
  student_reality?: string;
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
  field_name: string;
  description: string;
  importance: string;
  subfields: { name: string; description: string }[];
  skills: { name: string; description: string }[];
  education_paths: string[];
  work_environment: string;
  industries: string[];
  future_outlook: string;
}
