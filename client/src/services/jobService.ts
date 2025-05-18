// src/services/jobService.ts
import apiClient from './apiClient';
import type { JobDescription, CreateJobData } from '../types/index';

// Type for the update operation, can be Partial or specific
export interface UpdateJobData extends Partial<CreateJobData> {}

const jobService = {
  // GET /api/jobs - Fetch all jobs for the user
  getAllJobs: async (): Promise<JobDescription[]> => {
    const response = await apiClient.get<JobDescription[]>('/jobs');
    return response.data;
  },

  // GET /api/jobs/:id - Fetch a single job by ID
  getJobById: async (jobId: string): Promise<JobDescription> => {
    const response = await apiClient.get<JobDescription>(`/jobs/${jobId}`);
    return response.data;
  },

  // POST /api/jobs - Create a new job
  createJob: async (jobData: CreateJobData): Promise<JobDescription> => {
    const response = await apiClient.post<JobDescription>('/jobs', jobData);
    return response.data;
  },

  // PUT /api/jobs/:id - Update an existing job
  updateJob: async (jobId: string, jobData: UpdateJobData): Promise<JobDescription> => {
    const response = await apiClient.put<JobDescription>(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // DELETE /api/jobs/:id - Delete a job
  deleteJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/jobs/${jobId}`);
    return response.data;
  },
};

export default jobService;