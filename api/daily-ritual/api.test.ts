import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import moodHandler from './mood';
import intentionHandler from './intention';
import statsHandler from '../user/stats';

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
    res.json = vi.fn().mockReturnValue(res);
    res.setHeader = vi.fn().mockReturnValue(res);
    res.end = vi.fn().mockReturnValue(res);
    return res;
};

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/daily-ritual/mood', () => {
    it('should return an affirmation and sessionId', async () => {
      const req = createMockReq('POST', { userId: 'user-123', mood: 'calm' });
      const res = createMockRes();

      await moodHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        affirmation: expect.any(String),
        sessionId: 'session-123',
      }));
    });
  });

  describe('POST /api/daily-ritual/intention', () => {
    it('should return success: true', async () => {
      const req = createMockReq('POST', { sessionId: 'session-123', intentionText: 'My intention' });
      const res = createMockRes();

      await intentionHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('GET /api/user/stats', () => {
    it('should return streakCount and moodTrends', async () => {
      const req = createMockReq('GET', {}, { userId: 'user-123' });
      const res = createMockRes();

      await statsHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        streakCount: expect.any(Number),
        moodTrends: expect.any(Object),
      });
    });
  });
});
