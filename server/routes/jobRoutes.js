// server/routes/jobRoutes.js
const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createJob)
  .get(protect, getJobs);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;