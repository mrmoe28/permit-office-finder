import { Router, Request, Response } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    // User data is attached by authenticate middleware
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user information'
    });
  }
});

/**
 * GET /api/auth/check
 * Check if user is authenticated
 */
router.get('/check', optionalAuth, async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      authenticated: !!req.user
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check authentication'
    });
  }
});

export default router;
