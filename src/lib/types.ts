export interface Career {
  id: number;
  name: string;
  category: string;
  description: string;
  real_life_work: string;
  skills_required: string;
  education_path: string;
  tags: string;
  demand_level: string;
  growth_trend: string;
  ai_impact: string;
  ai_replace_risk: string;
  ai_transform_level: string;
  ai_demand_effect: string;
  future_summary: string;
  avg_salary_range: string;
  video_script: string;
  video_url?: string;
  match_percentage?: number;
  match_reasons?: string[];
  short_reason?: string;
}

export interface RoadmapStage {
  id: number;
  career_id: number;
  stage_name: string;
  stage_order: number;
  duration_weeks: number;
  description: string;
  key_skills: string;
  milestones: string;
  weekly_plan: string;
}

export interface Resource {
  id: number;
  career_id: number;
  title: string;
  url: string;
  resource_type: string;
  skill_level: string;
  is_free: boolean;
  platform: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProgress {
  id: number;
  session_id: string;
  career_id: number;
  milestone_key: string;
  completed: boolean;
}
