import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { badRequest, success } from '@/lib/auth-helpers';
import { contactSchema } from '@/lib/validation';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const isAllowed = await checkRateLimit(
      getRateLimitKey(ip, 'contact'),
      RATE_LIMITS.contact
    );

    if (!isAllowed) {
      return new Response('Too many requests', { status: 429 });
    }

    const body = await request.json();

    if (body._honeypot) {
      return badRequest('Invalid request');
    }

    const validatedData = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }
    });

    return success({ message: 'Message sent' }, 201);
  } catch (error) {
    console.error('Contact API Error:', error);
    return badRequest('Invalid data provided');
  }
}
