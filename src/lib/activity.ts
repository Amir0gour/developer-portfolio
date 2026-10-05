import { prisma } from './prisma';

interface LogActivityParams {
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  snapshot?: string;
  adminId: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: params,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getRecentActivities(limit: number = 10) {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { admin: { select: { name: true, email: true } } },
  });
}

export function getActivityMessage(action: string, entityType: string) {
  const messages: Record<string, Record<string, string>> = {
    create: { default: `Created a new ${entityType}` },
    update: { default: `Updated ${entityType}` },
    delete: { default: `Deleted ${entityType}` },
    login: { default: 'Logged in' },
  };

  return messages[action]?.[entityType] || messages[action]?.default || `${action} ${entityType}`;
}
