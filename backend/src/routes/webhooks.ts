import { Router, Request, Response } from 'express';
import { verifyWebhook } from '@clerk/backend';
import { PrismaClient } from '../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Webhook event types from Clerk
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    phone_numbers: Array<{
      phone_number: string;
      id: string;
    }>;
    created_at: number;
    updated_at: number;
  };
  object: string;
}

// Middleware to verify webhook signature
const verifyClerkWebhook = async (req: Request, res: Response, next: () => void) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    const headers = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };

    if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    // Get raw body as buffer for verification
    const payload = JSON.stringify(req.body);

    try {
      const webhook = verifyWebhook(payload, headers, webhookSecret);
      req.body = webhook;
      next();
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  } catch (error) {
    console.error('Error in webhook verification middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle user creation webhook
router.post('/clerk/users', verifyClerkWebhook, async (req: Request, res: Response) => {
  try {
    const event: ClerkWebhookEvent = req.body;

    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const userData = event.data;

        const email = userData.email_addresses?.[0]?.email_address || '';
        const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null;
        const phone = userData.phone_numbers?.[0]?.phone_number || null;
        const imageUrl = userData.image_url || null;

        // Upsert user in database
        await prisma.user.upsert({
          where: { clerkId: userData.id },
          create: {
            clerkId: userData.id,
            email,
            name,
            phone,
            imageUrl,
          },
          update: {
            email,
            name,
            phone,
            imageUrl,
          }
        });

        console.log(`User ${event.type}: ${userData.id} (${email})`);
        break;
      }

      case 'user.deleted':
        // Handle user deletion
        await prisma.user.delete({
          where: { clerkId: event.data.id }
        });

        console.log(`User deleted: ${event.data.id}`);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Health check for webhooks
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'webhooks',
    timestamp: new Date().toISOString()
  });
});

export default router;