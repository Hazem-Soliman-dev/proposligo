export interface GenerateRequest {
  jobDescription: string;
  tone: Tone;
  template: Template;
  language: "en" | "ar";
}

export interface GenerateResponse {
  proposal?: string;
  id?: string;
  error?: string;
}

export type Tone = "aggressive" | "professional" | "concise" | "friendly" | "bold";

export type Template =
  | "upwork_cover"
  | "cold_email"
  | "follow_up"
  | "rfp_response"
  | "quick_intro"
  | "case_study_pitch";

export interface ProfileData {
  jobTitle: string;
  bio: string;
  techStack: string;
  portfolioUrl: string | null;
}
