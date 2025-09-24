import express from 'express';
import { PrismaClient, Prisma } from '../generated/prisma';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/applications - List user's applications (authenticated)
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { status, permitOfficeId, limit = 20, offset = 0 } = req.query;

    const where: Prisma.ApplicationWhereInput = {
      userId,
    };

    if (status) where.status = status as Prisma.ApplicationStatus;
    if (permitOfficeId) where.permitOfficeId = permitOfficeId as string;

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
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/applications/:id - Get specific application (authenticated)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId, // Ensure user owns this application
      },
      include: {
        permitOffice: true,
        documents: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// POST /api/applications - Create new application (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId!;
    const { type, permitOfficeId, applicationData } = req.body;

    if (!type || !permitOfficeId) {
      return res.status(400).json({ error: 'Type and permit office ID are required' });
    }

    // Verify permit office exists
    const permitOffice = await prisma.permitOffice.findUnique({
      where: { id: permitOfficeId }
    });

    if (!permitOffice) {
      return res.status(404).json({ error: 'Permit office not found' });
    }

    const application = await prisma.application.create({
      data: {
        type,
        userId,
        permitOfficeId,
        applicationData,
        status: 'DRAFT',
      },
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
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// PUT /api/applications/:id - Update application (authenticated)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { type, applicationData, status } = req.body;

    // Check if application exists and user owns it
    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found or access denied' });
    }

    // Only allow certain status transitions
    const allowedStatusTransitions = {
      DRAFT: ['SUBMITTED'],
      SUBMITTED: [], // Can't be changed by user once submitted
      UNDER_REVIEW: [], // System status
      APPROVED: [], // System status
      REJECTED: [], // System status
      COMPLETED: [], // System status
    };

    if (status && !allowedStatusTransitions[existingApplication.status]?.includes(status)) {
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    const updatedData: Partial<Prisma.ApplicationUpdateInput> = {};
    if (type) updatedData.type = type;
    if (applicationData) updatedData.applicationData = applicationData;
    if (status) {
      updatedData.status = status;
      if (status === 'SUBMITTED') {
        updatedData.submittedAt = new Date();
      }
    }

    const application = await prisma.application.update({
      where: { id },
      data: updatedData,
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
        documents: true,
      },
    });

    res.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// DELETE /api/applications/:id - Delete application (authenticated)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Check if application exists and user owns it
    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or access denied' });
    }

    // Only allow deletion of DRAFT applications
    if (application.status !== 'DRAFT') {
      return res.status(400).json({ error: 'Can only delete draft applications' });
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;