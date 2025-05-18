// server/middleware/authMiddleware.js
const { getSupabase } = require('../config/supabaseClient');

const protect = async (req, res, next) => {
  let token;
  const supabase = getSupabase();

  if (!supabase) {
    console.error('Auth middleware: Supabase client not initialized');
    return res.status(500).json({ message: 'Internal server error: Auth service unavailable' });
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error) {
         console.warn(`Auth middleware: Supabase token validation error: ${error.message}`);
         // Differentiate between expired token and other errors if needed
         // For now, any error means unauthorized
         return res.status(401).json({ message: 'Not authorized, token validation failed' });
      }

      if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found for token' });
      }

      // Attach user info (excluding potentially sensitive details if necessary) to the request object
      // You might want to fetch more user details from your own DB if needed
      req.user = {
          id: user.id,
          email: user.email,
          // Add other relevant fields from the Supabase user object or your DB
          // e.g., role: user.role (if using Supabase roles)
      };

      next(); // Proceed to the protected route

    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token processing failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };