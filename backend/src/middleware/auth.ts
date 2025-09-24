import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Define user type
interface UserData {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  phone?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Express Request type to include auth
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    user?: UserData;
  }
}

// Clerk authentication middleware
export const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Custom middleware to sync user data and attach to request
export const syncUser = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkUser = req.auth;

    if (!clerkUser || !clerkUser.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.userId }
    });

    if (!user) {
      // Get user data from Clerk
      const { createClerkClient } = await import('@clerk/backend');
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!
      });

      try {
        const clerkUserData = await clerkClient.users.getUser(clerkUser.userId);

        // Create user in database
        user = await prisma.user.create({
          data: {
            clerkId: clerkUser.userId,
            email: clerkUserData.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUserData.firstName || ''} ${clerkUserData.lastName || ''}`.trim() || null,
            phone: clerkUserData.phoneNumbers[0]?.phoneNumber || null,
            imageUrl: clerkUserData.imageUrl || null,
          }
        });
      } catch (clerkError) {
        console.error('Error fetching user from Clerk:', clerkError);
        return res.status(500).json({ error: 'Error syncing user data' });
      }
    }

    // Attach user data to request
    req.userId = user.id;
    req.user = user;

    next();
  } catch (error) {
    console.error('Error in syncUser middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Combined middleware for authentication and user sync
export const authenticate = [requireAuth, syncUser];

// Optional auth middleware (doesn't require authentication but will sync if present)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get auth header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    // If auth header exists, run full authentication
    requireAuth(req as RequireAuthProp<Request>, res, (error) => {
      if (error) {
        return next();
      }

      // If auth succeeded, sync user
      syncUser(req as RequireAuthProp<Request>, res, next);
    });
  } catch {
    // If optional auth fails, just continue without auth
    next();
  }
};