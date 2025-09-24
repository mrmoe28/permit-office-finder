import { Router } from 'express';
import { AuthService } from '../services/authService';

const router = Router();

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', async (req, res) => {
  try {
    const userId = await AuthService.getCurrentUser();
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const userInfo = await AuthService.getUserInfo(userId);
    
    res.json({
      success: true,
      user: userInfo
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get user information'
    });
  }
});

/**
 * GET /api/auth/check
 * Check if user is authenticated
 */
router.get('/check', async (req, res) => {
  try {
    const isAuthenticated = await AuthService.isAuthenticated();
    
    res.json({
      success: true,
      authenticated: isAuthenticated
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to check authentication'
    });
  }
});

export default router;
