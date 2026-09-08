import { query } from '../config/database.js';

/**
 * Middleware to require authentication
 * Verifies session and attaches user to request
 * Rejects banned users
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Fetch user from database
    const result = await query(
      'SELECT id, username, email, avatar, is_admin, is_banned FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      // User no longer exists, destroy session
      req.session.destroy();
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check if user is banned
    if (user.is_banned) {
      req.session.destroy();
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to require admin privileges
 * Must be used after requireAuth
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  next();
};

export default { requireAuth, requireAdmin };
