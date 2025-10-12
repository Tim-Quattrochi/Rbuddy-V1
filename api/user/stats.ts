
import { Response } from 'express';
import { db } from '../../server/storage';
import { sessions } from '../../shared/schema';
import { and, eq, gte, desc, or, isNotNull } from 'drizzle-orm';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';

/**
 * Normalizes a date to midnight (00:00:00) for accurate day comparisons
 */
function normalizeToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Calculates the number of days between two dates (at midnight)
 */
function daysBetween(date1: Date, date2: Date): number {
  const time1 = normalizeToMidnight(date1).getTime();
  const time2 = normalizeToMidnight(date2).getTime();
  return Math.round((time2 - time1) / (1000 * 60 * 60 * 24));
}

async function calculateStreak(userId: string): Promise<number> {
  // Get all daily-ritual sessions, ordered by most recent first
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
  
  // Check if the most recent session is today or yesterday
  const daysSinceLastSession = daysBetween(mostRecentSessionDate, today);
  
  if (daysSinceLastSession > 1) {
    // Streak is broken if last session was more than 1 day ago
    return 0;
  }

  let streak = 1;
  let previousDate = mostRecentSessionDate;

  // Count consecutive days going backwards from most recent
  for (let i = 1; i < userSessions.length; i++) {
    const createdAt = userSessions[i].createdAt;
    if (!createdAt) {
      continue;
    }
    const currentDate = normalizeToMidnight(new Date(createdAt));
    const daysDiff = daysBetween(currentDate, previousDate);

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      streak++;
      previousDate = currentDate;
    } else if (daysDiff === 0) {
      // Same day - multiple check-ins, don't increment but continue
      continue;
    } else {
      // Gap found - stop counting
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
        if(session.mood){
            acc[session.mood] = (acc[session.mood] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return moodTrends;
}

export async function handler(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!; // Guaranteed by requireAuth middleware

  try {
    const streakCount = await calculateStreak(userId);
    const moodTrends = await getMoodTrends(userId);

    return res.status(200).json({ streakCount, moodTrends });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default [requireAuth, handler];
