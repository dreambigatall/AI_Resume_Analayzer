// server/routes/authRoutes.js
const express = require('express');
const { signupUser, loginUser, getUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // We'll create this next

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/user', protect, getUser); // Protect this route
router.post('/logout', protect, logoutUser); // Protect this route

module.exports = router;