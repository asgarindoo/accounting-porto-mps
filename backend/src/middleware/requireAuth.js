import { auth } from '../auth.js';

/**
 * Express middleware — validates the Better Auth session.
 * Redirects unauthenticated requests with a 401 JSON response.
 * Only users with role === 'ADMIN' are granted access.
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v])
      ),
    });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin only' });
    }

    // Attach user to request for downstream use
    req.user = session.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ success: false, message: 'Invalid session' });
  }
}
