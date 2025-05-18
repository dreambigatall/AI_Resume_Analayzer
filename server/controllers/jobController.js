// server/controllers/jobController.js
const JobDescription = require('../models/JobDescriptionModel');
const Resume = require('../models/ResumeModel'); // To potentially update resumes if a job is deleted

// @desc    Create a new job description
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { title, descriptionText, mustHaveSkills, focusAreas } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!title || !descriptionText) {
      return res.status(400).json({ message: 'Title and description text are required.' });
    }

    const newJob = new JobDescription({
      userId,
      title,
      descriptionText,
      mustHaveSkills: mustHaveSkills || [],
      focusAreas: focusAreas || [],
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error creating job.' });
  }
};

// @desc    Get all job descriptions for the logged-in user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const jobs = await JobDescription.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
};

// @desc    Get a single job description by ID
// @route   GET /api/jobs/:id
// @access  Private (ensure user owns this job)
const getJobById = async (req, res) => {
  try {
    const job = await JobDescription.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Ensure the logged-in user owns this job description
    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to access this job.' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Job not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error fetching job.' });
  }
};

// @desc    Update a job description
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const { title, descriptionText, mustHaveSkills, focusAreas } = req.body;
    let job = await JobDescription.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this job.' });
    }

    job.title = title || job.title;
    job.descriptionText = descriptionText || job.descriptionText;
    job.mustHaveSkills = mustHaveSkills !== undefined ? mustHaveSkills : job.mustHaveSkills;
    job.focusAreas = focusAreas !== undefined ? focusAreas : job.focusAreas;
    // Add other fields if necessary

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Job not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error updating job.' });
  }
};

// @desc    Delete a job description
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await JobDescription.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this job.' });
    }

    await job.deleteOne(); // Mongoose v6+

    // Optional: Handle related resumes (e.g., mark as 'job_deleted' or delete them)
    // For now, we'll just delete the job description.
    // await Resume.updateMany({ jobId: req.params.id }, { $set: { processingStatus: 'job_deleted' } });

    res.status(200).json({ message: 'Job description deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Job not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error deleting job.' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};