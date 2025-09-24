import express from 'express';
import { PrismaClient, Prisma } from '../generated/prisma';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reviews - List reviews (optionally filtered)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { permitOfficeId, userId, limit = 20, offset = 0 } = req.query;

    const where: Prisma.ReviewWhereInput = {};

    if (permitOfficeId) where.permitOfficeId = permitOfficeId as string;
    if (userId) where.userId = userId as string;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
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
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.review.count({ where });

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
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/:id - Get specific review
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
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
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// POST /api/reviews - Create new review (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { rating, comment, permitOfficeId } = req.body;

    if (!rating || !permitOfficeId) {
      return res.status(400).json({ error: 'Rating and permit office ID are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify permit office exists
    const permitOffice = await prisma.permitOffice.findUnique({
      where: { id: permitOfficeId }
    });

    if (!permitOffice) {
      return res.status(404).json({ error: 'Permit office not found' });
    }

    // Check if user already reviewed this office
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_permitOfficeId: {
          userId,
          permitOfficeId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this permit office' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        userId,
        permitOfficeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        permitOffice: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).json({ error: 'You have already reviewed this permit office' });
    }
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id - Update review (authenticated)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { rating, comment } = req.body;

    // Check if review exists and user owns it
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }

    const updatedData: Partial<Prisma.ReviewUpdateInput> = {};
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      updatedData.rating = rating;
    }
    if (comment !== undefined) {
      updatedData.comment = comment || null;
    }

    const review = await prisma.review.update({
      where: { id },
      data: updatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        permitOffice: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
      },
    });

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id - Delete review (authenticated)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Check if review exists and user owns it
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or access denied' });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;