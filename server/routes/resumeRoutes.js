// server/routes/resumeRoutes.js
const express = require('express');
const { uploadResume , getCandidatesForJob } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer instance

const router = express.Router();

// Single file upload, field name in form-data should be 'resumeFile'
router.post(
    '/upload',
    protect, // Ensure user is authenticated
    upload.single('resumeFile'), // Multer middleware for single file
    uploadResume
);


// New route to get candidates for a specific job
router.get(
    '/job/:jobId/candidates',
    protect,
    getCandidatesForJob
);

module.exports = router;
