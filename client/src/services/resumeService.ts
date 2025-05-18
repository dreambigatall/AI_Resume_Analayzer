// src/services/resumeService.ts
import apiClient from './apiClient';
import type { Candidate, ResumeUploadResponse } from '../types/index';
const resumeService = {
  // POST /api/resumes/upload - Upload a resume file
  uploadResume: async (jobId: string, resumeFile: File): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resumeFile', resumeFile);

    const response = await apiClient.post<ResumeUploadResponse>('/resumes/upload', formData, {
      headers: {
        // Axios will typically set 'Content-Type': 'multipart/form-data' automatically
        // when you pass a FormData object as the second argument to post/put.
        // However, explicitly setting it or ensuring your global default isn't overriding it can be useful.
        // If your global default is 'application/json', you might need to override it here:
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/resumes/job/:jobId/candidates - Get processed candidates for a job
  getCandidatesForJob: async (jobId: string): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>(`/resumes/job/${jobId}/candidates`);
    return response.data;
  },
};

export default resumeService;