// server/models/ResumeModel.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
        type: String, // Store Supabase user ID (UUID)
        required: true,
      },
    jobId: {
      type: mongoose.Schema.Types.ObjectId, // Link to a JobDescription model
      ref: 'JobDescription',
      required: true, // Assuming a resume is always uploaded for a specific job
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileType: { // Mime type
      type: String,
      required: true,
    },
    uploadTimestamp: {
      type: Date,
      default: Date.now,
    },
    processingStatus: {
      type: String,
      enum: ['uploaded', 'extracting', 'processing', 'completed', 'error'],
      default: 'uploaded',
    },
    extractedText: {
      type: String,
      // select: false, // Consider not sending this back in general queries unless explicitly asked
    },
    geminiAnalysis: {
      type: mongoose.Schema.Types.Mixed, // To store the JSON object from Gemini
    },
    score: {
      type: Number,
    },
    errorDetails: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional: Index for faster querying by userId and jobId
resumeSchema.index({ userId: 1, jobId: 1 });
resumeSchema.index({ jobId: 1, processingStatus: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;