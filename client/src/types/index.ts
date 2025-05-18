// src/types/index.ts
// ... (keep JobDescription, CreateJobData) ...

export type JobDescription = {
  id: string;
  title: string;
  descriptionText: string;
  mustHaveSkills?: string[];
  focusAreas?: string[];
  createdAt: string;
  updatedAt: string;
}

export type GeminiEducation = {
  degree?: string | null;
  institution?: string | null;
  graduationYear?: string | null;
}

export type CandidateGeminiAnalysis = {
  skills?: string[];
  yearsExperience?: string | number | null;
  education?: GeminiEducation[];
  justification?: string;
  warnings?: string[];
}

export type Candidate = {
  candidateId: string;
  originalFilename: string;
  fileType: string;
  uploadTimestamp: string;
  score: number;
  skills?: string[];
  yearsExperience?: string | number | null;
  education?: GeminiEducation[];
  justification?: string;
  warnings?: string[];
  isFlagged: boolean;
}

export type ResumeUploadResponse = {
  message: string;
  resumeId: string;
}

// Define the type first
type CreateJobData = {
  title: string;
  descriptionText: string;
  mustHaveSkills?: string[]; // Array for API
  focusAreas?: string[];     // Array for API
}

// Then export it explicitly
export { CreateJobData };