import express from 'express';
import { PrismaClient } from '../generated/prisma';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/me - Get current user profile (authenticated)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user!;

    // Include user's statistics
    const [applicationCount, reviewCount] = await Promise.all([
      prisma.application.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { userId: user.id } }),
    ]);

    res.json({
      ...user,
      stats: {
        applications: applicationCount,
        reviews: reviewCount,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/users/me - Update current user profile (authenticated)
router.put('/me', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { name, phone } = req.body;

    const updatedData: Partial<Prisma.UserUpdateInput> = {};
    if (name !== undefined) updatedData.name = name;
    if (phone !== undefined) updatedData.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// GET /api/users/me/applications - Get current user's applications (authenticated)
router.get('/me/applications', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { status, limit = 20, offset = 0 } = req.query;

    const where: Prisma.ApplicationWhereInput = { userId };
    if (status) where.status = status as Prisma.ApplicationStatus;

    const applications = await prisma.application.findMany({
      where,
      include: {
        permitOffice: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
        documents: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimetype: true,
            size: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.application.count({ where });

    res.json({
      applications,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/users/me/reviews - Get current user's reviews (authenticated)
router.get('/me/reviews', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { limit = 20, offset = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        permitOffice: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.review.count({ where: { userId } });

    res.json({
      reviews,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/users/me/dashboard - Get user dashboard data (authenticated)
router.get('/me/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;

    // Get user stats and recent activity
    const [
      applicationStats,
      recentApplications,
      recentReviews,
      totalReviews,
    ] = await Promise.all([
      // Application stats by status
      prisma.application.groupBy({
        by: ['status'],
        where: { userId },
        _count: {
          status: true,
        },
      }),

      // Recent applications
      prisma.application.findMany({
        where: { userId },
        include: {
          permitOffice: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 5,
      }),

      // Recent reviews
      prisma.review.findMany({
        where: { userId },
        include: {
          permitOffice: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),

      // Total reviews count
      prisma.review.count({ where: { userId } }),
    ]);

    // Format application stats
    const applicationStatsByStatus = applicationStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      stats: {
        applications: {
          total: Object.values(applicationStatsByStatus).reduce((a, b) => a + b, 0),
          byStatus: applicationStatsByStatus,
        },
        reviews: {
          total: totalReviews,
        },
      },
      recentActivity: {
        applications: recentApplications,
        reviews: recentReviews,
      },
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// DELETE /api/users/me - Delete current user account (authenticated)
router.delete('/me', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;

    // Note: This will cascade delete all related data due to Prisma schema constraints
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

export default router;