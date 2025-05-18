// server/models/JobDescriptionModel.js
const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: { // The user who created/owns this job description
      type: String, // Supabase user ID (UUID)
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required.'],
      trim: true,
    },
    descriptionText: {
      type: String,
      required: [true, 'Job description text is required.'],
    },
    // Fields for Day 5: Prompt Customization
    mustHaveSkills: {
        type: [String],
        default: [],
    },
    focusAreas: {
        type: [String],
        default: [],
    },
    // customPromptInstructions: { // More advanced: allow full custom instructions
    //     type: String,
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional: Index for faster querying by userId
jobDescriptionSchema.index({ userId: 1 });

const JobDescription = mongoose.model('JobDescription', jobDescriptionSchema);

module.exports = JobDescription;