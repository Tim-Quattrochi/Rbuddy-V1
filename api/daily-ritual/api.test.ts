import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import moodHandler from './mood';
import intentionHandler from './intention';
import statsHandler from '../user/stats';
import ConversationEngine from '../../server/services/conversationEngine';

vi.mock('../../server/middleware/auth', () => ({
  requireAuth: (req: any, _res: any, next: () => void) => {
    req.userId = req.userId ?? 'user-123';
    next();
  },
}));

// Mock the db module
vi.mock('../../server/storage', () => {
  const mockOrderBy = vi.fn().mockResolvedValue([]);
  const mockWhere = vi.fn(() => {
    const result = Promise.resolve([]);
    (result as any).orderBy = mockOrderBy;
    return result;
  });

  const db = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'session-123' }]),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: mockWhere,
  };
  return { db };
});

const moodSpy = vi.spyOn(ConversationEngine.prototype, 'handlePwaMoodSelection');
const intentionSpy = vi.spyOn(ConversationEngine.prototype, 'handlePwaIntention');
const journalSpy = vi.spyOn(ConversationEngine.prototype, 'handlePwaJournalEntry');

const server = setupServer();

// Helper to create a mock request
const createMockReq = (method: string, body: any = {}, query: any = {}) => {
    return {
        method,
        body,
        query,
        headers: {
            'content-type': 'application/json'
        }
    } as any;
};

// Helper to create a mock response
const createMockRes = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockImplementation(() => {
    res.end();
    return res;
  });
    res.setHeader = vi.fn().mockReturnValue(res);
    res.end = vi.fn().mockReturnValue(res);
    return res;
};

async function runMiddlewares(middlewares: any, req: any, res: any) {
  for (const middleware of middlewares) {
    let resolveNext: (value?: unknown) => void;
    const nextPromise = new Promise(resolve => {
      resolveNext = resolve;
    });

    let headersSent = false;
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      headersSent = true;
      return originalEnd.apply(this, args);
    };

    await middleware(req, res, (err: any) => {
      if (err) {
        throw err;
      }
      resolveNext();
    });

    if (headersSent) {
      break;
    }

    await nextPromise;
  }
}

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    moodSpy.mockReset();
    intentionSpy.mockReset();
    journalSpy.mockReset();

    moodSpy.mockResolvedValue({ sessionId: 'session-123', affirmation: 'Stay present and kind to yourself.' });
    intentionSpy.mockResolvedValue();
    journalSpy.mockResolvedValue();
  });

  describe('POST /api/daily-ritual/mood', () => {
    it('should return an affirmation and sessionId', async () => {
      const req = createMockReq('POST', { userId: 'user-123', mood: 'calm' });
      const res = createMockRes();

      await runMiddlewares(moodHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        affirmation: expect.any(String),
        sessionId: 'session-123',
      }));
    });
  });

  describe('POST /api/daily-ritual/intention', () => {
    it('should return success response for intention', async () => {
      const req = createMockReq('POST', { sessionId: 'session-123', intentionText: 'My intention' });
      const res = createMockRes();

      await runMiddlewares(intentionHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, type: 'intention' });
    });

    it('should return success response for journal entry', async () => {
      const req = createMockReq('POST', { sessionId: 'session-123', intentionText: 'My journal entry', type: 'journal_entry' });
      const res = createMockRes();

      await runMiddlewares(intentionHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, type: 'journal_entry' });
    });

    it('should return 404 when session is missing for intention submissions', async () => {
      intentionSpy.mockRejectedValueOnce(new Error('Session not found'));

      const req = createMockReq('POST', { sessionId: 'missing-session', intentionText: 'Intentional reflection' });
      const res = createMockRes();

      await runMiddlewares(intentionHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Session not found' });
    });

    it('should return 404 when session is missing for journal submissions', async () => {
      journalSpy.mockRejectedValueOnce(new Error('Session not found'));

      const req = createMockReq('POST', { sessionId: 'missing-session', intentionText: 'Journal reflection', type: 'journal_entry' });
      const res = createMockRes();

      await runMiddlewares(intentionHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Session not found' });
    });
  });

  describe('GET /api/user/stats', () => {
    it('should return streakCount and moodTrends', async () => {
      const req = createMockReq('GET', {}, { userId: 'user-123' });
      const res = createMockRes();

      await runMiddlewares(statsHandler, req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        streakCount: expect.any(Number),
        moodTrends: expect.any(Object),
      });
    });
  });
});
