// server/controllers/authController.js
const { getSupabase } = require('../config/supabaseClient');

// @desc    Register/Sign up a new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  const supabase = getSupabase();

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // You can add options here, like user metadata if needed
      // options: {
      //   data: {
      //     first_name: 'John', // Example metadata
      //   }
      // }
    });

    if (error) {
      // Check for specific errors, e.g., user already exists
       if (error.message.includes("User already registered")) {
            return res.status(409).json({ message: "User already registered with this email." }); // 409 Conflict
       }
      console.error('Supabase signup error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    // Important: Supabase might require email confirmation depending on your project settings.
    // The 'data' object contains user and session info.
    // If email confirmation is required, data.user might exist but data.session might be null.
    if (data.user && !data.session && supabase.auth.settings?.mailer?.autoconfirm !== true) {
         return res.status(201).json({
             message: "Signup successful! Please check your email to confirm your account.",
             userId: data.user.id // Still useful to return user ID
         });
    } else if (data.user && data.session) {
        // Auto-confirm might be enabled, or this is a subsequent login after confirmation
        return res.status(201).json({
             message: "Signup successful!",
             user: data.user,
             session: data.session
         });
    } else {
         // Handle unexpected scenarios
         console.error("Supabase signup response anomaly:", data);
         return res.status(500).json({ message: "Signup completed but session data is unavailable. Please try logging in or check email confirmation." });
    }

  } catch (err) {
    console.error('Server error during signup:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Authenticate/Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const supabase = getSupabase();

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  if (!supabase) {
      return res.status(500).json({ message: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      // Provide a generic message for security unless it's a specific known error like "Invalid login credentials"
      if (error.message === "Invalid login credentials") {
          return res.status(401).json({ message: "Invalid login credentials" }); // Unauthorized
      }
      // Check for email not confirmed error if applicable
      if (error.message.includes("Email not confirmed")) {
          return res.status(401).json({ message: "Email not confirmed. Please check your inbox." });
      }
      return res.status(400).json({ message: error.message }); // Or a generic error
    }

    // Login successful, data contains user and session info
    res.status(200).json({
       message: "Login successful!",
       user: data.user,
       session: data.session // Contains access_token (JWT) and refresh_token
    });

  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// @desc    Get current user details (Requires valid Supabase JWT)
// @route   GET /api/auth/user
// @access  Private (Protected by authMiddleware)
const getUser = async (req, res) => {
    // The user object should be attached by the authMiddleware
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        // This case should technically be handled by the middleware returning 401
        // but adding a fallback doesn't hurt.
        res.status(401).json({ message: "Not authorized, user data not found" });
    }
};


// @desc    Log out user (Invalidates Supabase session)
// @route   POST /api/auth/logout
// @access  Private (requires valid token to identify session to invalidate)
const logoutUser = async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
        return res.status(500).json({ message: 'Supabase client not initialized' });
    }

    try {
        // Get the token from the Authorization header to sign out the correct session
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Use the token to sign out. This invalidates the refresh token on Supabase side.
        // The access token will eventually expire on its own.
        const { error } = await supabase.auth.signOut(token); // Pass the access token

        if (error) {
             console.error('Supabase signout error:', error.message);
             // Even if there's an error, the client should discard the token.
             // Often, the error might be "invalid JWT" if it already expired, which is fine for logout.
             // Decide if you need to return an error or just proceed as success.
             // For simplicity, we can return success as the client's goal (clear local session) is achieved.
             // return res.status(400).json({ message: error.message });
        }

        res.status(200).json({ message: 'Logout successful' });

    } catch (err) {
        console.error('Server error during logout:', err);
        res.status(500).json({ message: 'Server error during logout' });
    }
};


module.exports = {
  signupUser,
  loginUser,
  getUser,
  logoutUser,
};