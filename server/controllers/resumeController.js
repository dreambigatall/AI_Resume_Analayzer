

// server/controllers/resumeController.js
const Resume = require('../models/ResumeModel');
const JobDescription = require('../models/JobDescriptionModel'); // Add this
const { extractTextFromBuffer } = require('../utils/resumeParser');
const { triggerGeminiAnalysis } = require('../services/geminiService'); // Import this

// @desc    Upload a resume, extract text, and save metadata
// @route   POST /api/resumes/upload
// @access  Private (requires authentication)
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID is required.' });
  }

  try {
    // Validate if jobId exists and belongs to the user (optional, but good practice)
    const jobExists = await JobDescription.findOne({ _id: jobId, userId: req.user.id });
    if (!jobExists) {
        return res.status(404).json({ message: 'Job description not found or you are not authorized for this job.' });
    }

    const userId = req.user.id;
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const originalFilename = req.file.originalname;

    let extractedText;
    try {
        extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
    } catch (extractionError) {
        console.error(`Text extraction failed for ${originalFilename}:`, extractionError);
        return res.status(500).json({ message: 'Failed to extract text from file.', error: extractionError.message });
    }

    if (!extractedText || extractedText.trim() === '') {
        return res.status(400).json({ message: 'Could not extract any text from the resume or the resume is empty.' });
    }

    const newResume = new Resume({
      userId,
      jobId, // Already validated
      originalFilename,
      fileType: mimeType,
      extractedText,
      processingStatus: 'uploaded',
    });

    await newResume.save();

    // Trigger Gemini Analysis Asynchronously (fire and forget from the perspective of this request)
    triggerGeminiAnalysis(newResume._id)
        .then(() => {
            console.log(`[ResumeController] Gemini analysis for ${newResume._id} initiated successfully.`);
        })
        .catch(err => {
            // This catch is for errors in *initiating* the trigger, not the analysis itself.
            // The analysis errors are handled within triggerGeminiAnalysis.
            console.error(`[ResumeController] Failed to initiate Gemini analysis for ${newResume._id}:`, err);
            // Optionally, update the resume status to 'error' here if initiation itself fails critically
            // For now, logging is sufficient as triggerGeminiAnalysis handles its own state.
        });

    res.status(201).json({
      message: 'Resume uploaded and text extracted. Analysis has been queued.',
      resumeId: newResume._id,
    });

  } catch (error) {
    console.error('Error processing resume upload:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId' && error.path === '_id' && error.value === jobId) { // For jobId validation
        return res.status(400).json({ message: 'Invalid Job ID format.' });
    }
    res.status(500).json({ message: 'Server error during resume upload.' });
  }
};


// @desc    Get processed candidates for a specific job
// @route   GET /api/resumes/job/:jobId/candidates
// @access  Private (user must own the job)
const getCandidatesForJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
      // 1. Validate Job Ownership
      const job = await JobDescription.findById(jobId);
      if (!job) {
          return res.status(404).json({ message: 'Job not found.' });
      }
      if (job.userId.toString() !== userId) {
          return res.status(403).json({ message: 'You are not authorized to view candidates for this job.' });
      }

      // 2. Fetch Processed Resumes for this Job
      const candidates = await Resume.find({
          jobId: jobId,
          processingStatus: 'completed', // Only fetch completed ones
      })
      .sort({ score: -1 }) // Sort by score, highest first
      .select('_id originalFilename uploadTimestamp score geminiAnalysis.skills geminiAnalysis.yearsExperience geminiAnalysis.education geminiAnalysis.justification geminiAnalysis.warnings processingStatus fileType') // Select specific fields to return
      .lean(); // Use .lean() for faster queries if not modifying docs

      if (!candidates || candidates.length === 0) {
          return res.status(200).json([]); // Return empty array if no candidates yet
      }

      // 3. Calculate Top Performers (e.g., top 10% or top N)
      // For simplicity, let's flag top 20% or at least 1 if few candidates
      const numToFlag = Math.max(1, Math.ceil(candidates.length * 0.20));

      const processedCandidates = candidates.map((candidate, index) => {
          // Construct the candidate object for the frontend
          // Ensure NO PII is accidentally leaked from geminiAnalysis if not selected carefully.
          // The .select() above should handle this, but double-check here.
          return {
              candidateId: candidate._id,
              originalFilename: candidate.originalFilename, // For user reference, not PII itself
              fileType: candidate.fileType,
              uploadTimestamp: candidate.uploadTimestamp,
              score: candidate.score,
              skills: candidate.geminiAnalysis?.skills || [],
              yearsExperience: candidate.geminiAnalysis?.yearsExperience || null,
              education: candidate.geminiAnalysis?.education || [], // Anonymized by Gemini prompt
              justification: candidate.geminiAnalysis?.justification || "No justification provided.",
              warnings: candidate.geminiAnalysis?.warnings || [], // Warnings from our PII check or Gemini
              isFlagged: index < numToFlag, // Flag top candidates
              // DO NOT include full geminiAnalysis or extractedText here
          };
      });

      res.status(200).json(processedCandidates);

  } catch (error) {
      console.error(`Error fetching candidates for job ${jobId}:`, error);
      if (error.kind === 'ObjectId') {
          return res.status(404).json({ message: 'Invalid Job ID format.' });
      }
      res.status(500).json({ message: 'Server error fetching candidates.' });
  }
};


module.exports = {
  uploadResume,
  getCandidatesForJob,
  // other resume controllers if any
};