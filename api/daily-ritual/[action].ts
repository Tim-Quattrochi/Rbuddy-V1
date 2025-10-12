// Combined daily-ritual API handler
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { createVercelHandler } from '../_lib/vercel-handler';
import ConversationEngine from '../../server/services/conversationEngine';
import { moodEnum, type MoodOption } from '../../shared/schema';

const engine = new ConversationEngine();

export async function handleMood(req: AuthenticatedRequest, res: Response) {
  const { mood } = req.body;
  const userId = req.userId!;

  if (!mood) {
    return res.status(400).json({ error: 'mood is required' });
  }

  const validMoods: MoodOption[] = moodEnum.enumValues;
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood option' });
  }

  try {
    const result = await engine.handlePwaMoodSelection(userId, mood as MoodOption);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling PWA mood selection:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function handleIntention(req: AuthenticatedRequest, res: Response) {
  const { sessionId, intentionText, type } = req.body;
  const userId = req.userId!;

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return res.status(400).json({ error: 'sessionId and intentionText are required' });
  }

  if (typeof intentionText !== 'string' || intentionText.trim().length === 0) {
    return res.status(400).json({ error: 'intentionText must be a non-empty string' });
  }

  const entryType = type === 'journal_entry' ? 'journal_entry' : 'intention';
  const sanitizedText = intentionText.trim();

  try {
    if (entryType === 'journal_entry') {
      await engine.handlePwaJournalEntry(sessionId.trim(), sanitizedText);
    } else {
      await engine.handlePwaIntention(sessionId.trim(), sanitizedText);
    }

    return res.status(200).json({ success: true, type: entryType });
  } catch (error) {
    console.error('Error saving PWA intention:', error);
    
    if (error instanceof Error && error.message === 'Session not found') {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

type DailyRitualAction = 'mood' | 'intention';

const actionConfig: Record<
  DailyRitualAction,
  {
    method: 'POST';
    handler: (req: AuthenticatedRequest, res: Response) => Promise<Response | void>;
  }
> = {
  mood: { method: 'POST', handler: handleMood },
  intention: { method: 'POST', handler: handleIntention },
};

function resolveAction(req: Request): DailyRitualAction | null {
  const fromParams = (req as any).params?.action;
  if (typeof fromParams === 'string' && fromParams) {
    return fromParams as DailyRitualAction;
  }

  const queryValue = req.query?.action;
  if (typeof queryValue === 'string' && queryValue) {
    return queryValue as DailyRitualAction;
  }
  if (Array.isArray(queryValue) && queryValue[0]) {
    return queryValue[0] as DailyRitualAction;
  }

  const path = (req as any).path || req.url || '';
  const segments = path.split('?')[0]?.split('/').filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === 'mood' || lastSegment === 'intention') {
    return lastSegment as DailyRitualAction;
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
