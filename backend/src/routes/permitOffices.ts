import express from 'express';
import { PrismaClient, Prisma } from '../generated/prisma';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/permit-offices - List all permit offices with optional filters
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      state, 
      zipCode, 
      search, 
      permitType,
      officeType,
      radius,
      userLat,
      userLng,
      limit = 20, 
      offset = 0 
    } = req.query;

    const where: Prisma.PermitOfficeWhereInput = {};

    // Add basic filters
    if (city) where.city = { contains: city as string, mode: Prisma.QueryMode.insensitive };
    if (state) where.state = { contains: state as string, mode: Prisma.QueryMode.insensitive };
    if (zipCode) where.zipCode = zipCode as string;

    // Search across multiple fields
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        { address: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        { city: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        { state: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    // Filter by permit type (search in permitTypes JSON array)
    if (permitType && permitType !== 'all') {
      where.permitTypes = {
        array_contains: permitType as string
      };
    }

    // Filter by office type (this would need to be added to the schema)
    // For now, we'll filter by name patterns
    if (officeType && officeType !== 'all') {
      const officeTypePatterns = {
        county: ['county', 'co.'],
        city: ['city', 'municipal'],
        state: ['state', 'department'],
        township: ['township', 'town']
      };
      
      if (officeTypePatterns[officeType as keyof typeof officeTypePatterns]) {
        where.OR = [
          ...(where.OR || []),
          ...officeTypePatterns[officeType as keyof typeof officeTypePatterns].map(pattern => ({
            name: { contains: pattern, mode: Prisma.QueryMode.insensitive }
          }))
        ];
      }
    }

    const offices = await prisma.permitOffice.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average rating and distance for each office
    let officesWithRatings = offices.map((office) => {
      const averageRating = office.reviews.length > 0
        ? office.reviews.reduce((sum, review) => sum + review.rating, 0) / office.reviews.length
        : null;

      let distance: number | undefined;
      
      // Calculate distance if user location is provided
      if (userLat && userLng && office.latitude && office.longitude) {
        distance = calculateDistance(
          parseFloat(userLat as string),
          parseFloat(userLng as string),
          office.latitude,
          office.longitude
        );
      }

      return {
        ...office,
        averageRating,
        reviewCount: office.reviews.length,
        distance,
      };
    });

    // Filter by radius if specified
    if (radius && userLat && userLng) {
      const radiusMiles = parseFloat(radius as string);
      officesWithRatings = officesWithRatings.filter(office => 
        !office.distance || office.distance <= radiusMiles
      );
    }

    // Sort by distance if user location is provided
    if (userLat && userLng) {
      officesWithRatings.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    const total = await prisma.permitOffice.count({ where });

    return res.json({
      offices: officesWithRatings,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    });
  } catch (error) {
    console.error('Error fetching permit offices:', error);
    return res.status(500).json({ error: 'Failed to fetch permit offices' });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// GET /api/permit-offices/:id - Get specific permit office
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const office = await prisma.permitOffice.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        applications: {
          select: {
            id: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!office) {
      return res.status(404).json({ error: 'Permit office not found' });
    }

    // Calculate average rating
    const averageRating = office.reviews.length > 0
      ? office.reviews.reduce((sum, review) => sum + review.rating, 0) / office.reviews.length
      : null;

    return res.json({
      ...office,
      averageRating,
      reviewCount: office.reviews.length,
    });
  } catch (error) {
    console.error('Error fetching permit office:', error);
    return res.status(500).json({ error: 'Failed to fetch permit office' });
  }
});

// POST /api/permit-offices - Create new permit office (authenticated - admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const officeData = req.body;

    const office = await prisma.permitOffice.create({
      data: officeData,
    });

    return res.status(201).json(office);
  } catch (error) {
    console.error('Error creating permit office:', error);
    return res.status(500).json({ error: 'Failed to create permit office' });
  }
});

export default router;