// Combined user API handler
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { createVercelHandler } from '../_lib/vercel-handler';
import { storage, db } from '../../server/storage';
import { sessions } from '../../shared/schema';
import { and, eq, gte, desc, or, isNotNull } from 'drizzle-orm';

function normalizeToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function daysBetween(date1: Date, date2: Date): number {
  const time1 = normalizeToMidnight(date1).getTime();
  const time2 = normalizeToMidnight(date2).getTime();
  return Math.round((time2 - time1) / (1000 * 60 * 60 * 24));
}

async function calculateStreak(userId: string): Promise<number> {
  const userSessions = await db
    .select({ createdAt: sessions.createdAt })
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        or(eq(sessions.flowType, 'daily-ritual'), eq(sessions.flowType, 'daily'))
      )
    )
    .orderBy(desc(sessions.createdAt));

  if (userSessions.length === 0) {
    return 0;
  }

  const today = normalizeToMidnight(new Date());
  if (!userSessions[0].createdAt) {
    return 0;
  }
  const mostRecentSessionDate = normalizeToMidnight(new Date(userSessions[0].createdAt));
  
  const daysSinceLastSession = daysBetween(mostRecentSessionDate, today);
  
  if (daysSinceLastSession > 1) {
    return 0;
  }

  let streak = 1;
  let previousDate = mostRecentSessionDate;

  for (let i = 1; i < userSessions.length; i++) {
    const createdAt = userSessions[i].createdAt;
    if (!createdAt) {
      continue;
    }
    const currentDate = normalizeToMidnight(new Date(createdAt));
    const daysDiff = daysBetween(currentDate, previousDate);

    if (daysDiff === 1) {
      streak++;
      previousDate = currentDate;
    } else if (daysDiff === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

async function getMoodTrends(userId: string): Promise<Record<string, number>> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentSessions = await db.select().from(sessions).where(and(eq(sessions.userId, userId), isNotNull(sessions.createdAt), gte(sessions.createdAt, sevenDaysAgo)));

  const moodTrends = recentSessions.reduce((acc, session) => {
    if (session.mood) {
      acc[session.mood] = (acc[session.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return moodTrends;
}

export async function handleMe(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    const { password, ...userData } = user;
    
    return res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('[GET /api/user/me] Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user data'
    });
  }
}

export async function handleStats(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;

  try {
    const streakCount = await calculateStreak(userId);
    const moodTrends = await getMoodTrends(userId);

    return res.status(200).json({ streakCount, moodTrends });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

type UserAction = 'me' | 'stats';

const actionConfig: Record<
  UserAction,
  {
    method: 'GET';
    handler: (req: AuthenticatedRequest, res: Response) => Promise<Response | void>;
  }
> = {
  me: { method: 'GET', handler: handleMe },
  stats: { method: 'GET', handler: handleStats },
};

function resolveAction(req: Request): UserAction | null {
  const fromParams = (req as any).params?.action;
  if (typeof fromParams === 'string' && fromParams) {
    return fromParams as UserAction;
  }

  const queryValue = req.query?.action;
  if (typeof queryValue === 'string' && queryValue) {
    return queryValue as UserAction;
  }
  if (Array.isArray(queryValue) && queryValue[0]) {
    return queryValue[0] as UserAction;
  }

  const path = (req as any).path || req.url || '';
  const segments = path.split('?')[0]?.split('/').filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'me' || lastSegment === 'stats') {
    return lastSegment as UserAction;
  }
  return null;
}

const dispatchHandler: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const action = resolveAction(req as Request);
    if (!action) {
      return res.status(404).json({ error: 'Not Found' });
    }

    const config = actionConfig[action];
    if (!config || req.method.toUpperCase() !== config.method) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    await config.handler(req, res);
  } catch (error) {
    next(error);
  }
};

export const middlewares = [requireAuth, dispatchHandler];

export default createVercelHandler(middlewares);
