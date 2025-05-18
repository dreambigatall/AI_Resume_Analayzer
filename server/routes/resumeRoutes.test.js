// server/routes/resumeRoutes.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const resumeRoutes = require('./resumeRoutes'); // Your router
const jobRoutes = require('./jobRoutes'); // If needed for setup
const Resume = require('../models/ResumeModel');
const JobDescription = require('../models/JobDescriptionModel');
const { protect } = require('../middleware/authMiddleware'); // Mock this too

// Mock authMiddleware
jest.mock('../middleware/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { id: 'mock-user-id', email: 'test@example.com' }; // Mock user
    next();
  }),
}));

// Mock Gemini Service to prevent actual API calls from controller
const mockTriggerGeminiAnalysis = jest.fn();
jest.mock('../services/geminiService', () => ({
    // Keep other exports if controllers use them directly
    // analyzeWithGemini: jest.fn(),
    // constructPrompt: jest.fn(),
    triggerGeminiAnalysis: (...args) => mockTriggerGeminiAnalysis(...args), // Ensure it can be called
}));


let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes); // Mount if job creation is part of test setup
app.use('/api/resumes', resumeRoutes);


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Resume.deleteMany({});
  await JobDescription.deleteMany({});
  protect.mockClear(); // Clear mock calls
  mockTriggerGeminiAnalysis.mockClear(); // Clear calls to the mocked service
  mockTriggerGeminiAnalysis.mockResolvedValue(); // Default to resolve successfully
});


describe('POST /api/resumes/upload', () => {
  let jobId;
  beforeEach(async () => {
      const job = await JobDescription.create({ userId: 'mock-user-id', title: 'Test Job', descriptionText: 'Job Desc' });
      jobId = job._id.toString();
  });

  it('should upload a resume and trigger analysis', async () => {
    const response = await request(app)
      .post('/api/resumes/upload')
      .field('jobId', jobId) // Send jobId as a field
      .attach('resumeFile', Buffer.from('fake resume content this is a test'), 'test.txt'); // Attach a fake file

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toContain('Resume uploaded and text extracted');
    expect(response.body.resumeId).toBeDefined();

    const resumeInDb = await Resume.findById(response.body.resumeId);
    expect(resumeInDb).not.toBeNull();
    expect(resumeInDb.jobId.toString()).toBe(jobId);
    expect(resumeInDb.extractedText).toBe('fake resume content this is a test'); // mammoth/pdf-parse would be mocked in a deeper unit test

    // Check if triggerGeminiAnalysis was called
    expect(mockTriggerGeminiAnalysis).toHaveBeenCalledWith(resumeInDb._id);
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/api/resumes/upload')
      .field('jobId', jobId);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('No file uploaded.');
  });

  it('should return 400 if jobId is missing', async () => {
    const response = await request(app)
        .post('/api/resumes/upload')
        .attach('resumeFile', Buffer.from('test content'), 'test.txt');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Job ID is required.');
  });

  // Add test for invalid job ID, etc.
});

describe('GET /api/resumes/job/:jobId/candidates', () => {
    let jobId;
    beforeEach(async () => {
        const job = await JobDescription.create({ userId: 'mock-user-id', title: 'Dev Job', descriptionText: 'Dev Desc' });
        jobId = job._id.toString();

        // Create some processed resumes
        await Resume.create({
            userId: 'mock-user-id', jobId, processingStatus: 'completed', score: 8,
            originalFilename: 'r1.pdf', fileType: 'app/pdf',
            geminiAnalysis: { skills: ['S1'], yearsExperience: 5, education: [], justification: 'J1', warnings:[] }
        });
        await Resume.create({
            userId: 'mock-user-id', jobId, processingStatus: 'completed', score: 9,
            originalFilename: 'r2.pdf', fileType: 'app/pdf',
            geminiAnalysis: { skills: ['S2'], yearsExperience: 6, education: [], justification: 'J2', warnings:[] }
        });
        await Resume.create({ // Unprocessed resume
            userId: 'mock-user-id', jobId, processingStatus: 'processing',
            originalFilename: 'r3.pdf', fileType: 'app/pdf',
        });
    });

    it('should return processed candidates for a job, sorted by score', async () => {
        const response = await request(app).get(`/api/resumes/job/${jobId}/candidates`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].score).toBe(9); // Highest score first
        expect(response.body[1].score).toBe(8);
        expect(response.body[0].isFlagged).toBe(true); // Top 20% (1 of 2 is 50%)
    });

    it('should return 404 if job not found', async () => {
        const invalidJobId = new mongoose.Types.ObjectId().toString();
        const response = await request(app).get(`/api/resumes/job/${invalidJobId}/candidates`);
        expect(response.statusCode).toBe(404);
    });
    // Add test for job not belonging to user (would require more complex auth mock)
});