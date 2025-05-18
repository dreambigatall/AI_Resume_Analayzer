// server/services/geminiService.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); // For in-memory DB for tests
const { triggerGeminiAnalysis, constructPrompt } = require('./geminiService');
const Resume = require('../models/ResumeModel');
const JobDescription = require('../models/JobDescriptionModel');
const { getGeminiModel } = require('../config/gemini'); // We will mock this

// Mock the @google/generative-ai library
// jest.mock('../config/gemini', () => ({
//   getGeminiModel: jest.fn(),
// }));
// OR mock the specific functions from @google/generative-ai if getGeminiModel is just a wrapper

// More direct mock of the model's method:
const mockGenerateContent = jest.fn();
jest.mock('../config/gemini', () => ({
    getGeminiModel: jest.fn(() => ({ // Return an object that has the generateContent method
        generateContent: mockGenerateContent,
    })),
    // getGeminiClient: jest.fn(), // if you use it directly elsewhere
    // initGemini: jest.fn() // if needed
}));


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  // Reset mocks before each test
  mockGenerateContent.mockReset();
  // getGeminiModel.mockClear(); // if mocking the getGeminiModel function itself
});

describe('constructPrompt', () => {
    it('should include resume and job description text', () => {
        const prompt = constructPrompt('resume text', 'job text');
        expect(prompt).toContain('resume text');
        expect(prompt).toContain('job text');
    });
    it('should include must-have skills if provided', () => {
        const prompt = constructPrompt('resume', 'job', ['Node.js'], []);
        expect(prompt).toContain('MUST-HAVE SKILLS');
        expect(prompt).toContain('Node.js');
    });
});


describe('triggerGeminiAnalysis', () => {
  let job;
  let resume;

  beforeEach(async () => {
    job = await JobDescription.create({
      userId: 'test-user-id',
      title: 'Software Engineer',
      descriptionText: 'Develop amazing things.',
      mustHaveSkills: ['JavaScript'],
    });
    resume = await Resume.create({
      userId: 'test-user-id',
      jobId: job._id,
      originalFilename: 'test.pdf',
      fileType: 'application/pdf',
      extractedText: 'I know JavaScript and React.',
      processingStatus: 'uploaded',
    });
  });

  it('should successfully process a resume and update status to completed', async () => {
    const mockGeminiResponse = {
      skills: ['JavaScript', 'React'],
      yearsExperience: '3',
      education: [],
      fitScore: 8,
      justification: 'Good fit based on skills.',
      warnings: [],
    };
    // Mock the generateContent method to resolve with a structured response
    mockGenerateContent.mockResolvedValue({
        response: {
            text: () => JSON.stringify(mockGeminiResponse), // Gemini model returns text()
            // promptFeedback: null // Or provide a valid feedback object
        }
    });

    await triggerGeminiAnalysis(resume._id);

    const updatedResume = await Resume.findById(resume._id);
    expect(updatedResume.processingStatus).toBe('completed');
    expect(updatedResume.score).toBe(8);
    expect(updatedResume.geminiAnalysis.justification).toBe('Good fit based on skills.');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    // You can also inspect the prompt sent to mockGenerateContent
    // expect(mockGenerateContent.mock.calls[0][0]).toContain('I know JavaScript and React.');
  });

  it('should update resume status to error if Gemini call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Gemini API Error'));

    await triggerGeminiAnalysis(resume._id);

    const updatedResume = await Resume.findById(resume._id);
    expect(updatedResume.processingStatus).toBe('error');
    expect(updatedResume.errorDetails).toBe('Gemini API Error');
  });

  it('should update resume status to error if Gemini response is not valid JSON', async () => {
    mockGenerateContent.mockResolvedValue({
        response: {
            text: () => "This is not JSON",
        }
    });
    await triggerGeminiAnalysis(resume._id);
    const updatedResume = await Resume.findById(resume._id);
    expect(updatedResume.processingStatus).toBe('error');
    expect(updatedResume.errorDetails).toContain('Failed to parse Gemini response as JSON');
  });

   it('should skip processing if resume status is already "completed"', async () => {
        await resume.updateOne({ processingStatus: 'completed' });
        await triggerGeminiAnalysis(resume._id); // Call again
        expect(mockGenerateContent).not.toHaveBeenCalled(); // Gemini should not be called
    });

    it('should handle missing job description gracefully', async () => {
        await JobDescription.deleteOne({ _id: job._id }); // Delete the associated job
        await triggerGeminiAnalysis(resume._id);
        const updatedResume = await Resume.findById(resume._id);
        expect(updatedResume.processingStatus).toBe('error');
        expect(updatedResume.errorDetails).toBe('Associated job description not found.');
    });

    // Add more tests: PII redaction (mock a response with PII and check if it's redacted/warned)
    it('should redact PII from skills in Gemini response', async () => {
        const mockGeminiResponseWithPII = {
          skills: ['Good Skill', 'PII: test@example.com', 'Another skill: 123-456-7890'],
          yearsExperience: '2',
          education: [],
          fitScore: 7,
          justification: 'Some justification.',
          warnings: [],
        };
        mockGenerateContent.mockResolvedValue({
            response: { text: () => JSON.stringify(mockGeminiResponseWithPII) }
        });

        await triggerGeminiAnalysis(resume._id);
        const updatedResume = await Resume.findById(resume._id);
        expect(updatedResume.geminiAnalysis.skills).toContain('[REDACTED Email]');
        expect(updatedResume.geminiAnalysis.skills).toContain('[REDACTED Phone]');
        expect(updatedResume.geminiAnalysis.skills).toContain('Good Skill');
        expect(updatedResume.geminiAnalysis.warnings).toEqual(
            expect.arrayContaining([
                expect.stringContaining('System: Potential PII (Email) detected and redacted'),
                expect.stringContaining('System: Potential PII (Phone) detected and redacted')
            ])
        );
    });
});