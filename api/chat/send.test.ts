import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSend } from './[action]';

// Mock the AI Chat Service
vi.mock('../../server/services/aiChatService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      sendMessage: vi.fn().mockResolvedValue('This is a test AI response'),
    })),
  };
});

// Helper to create a mock authenticated request
const createMockReq = (userId: string, body: any = {}) => {
  return {
    userId,
    body,
    headers: {
      'content-type': 'application/json',
    },
  } as any;
};

// Helper to create a mock response
const createMockRes = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

describe('Chat API - Send Message', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no userId', async () => {
    const req = createMockReq('', { message: 'Hello' });
    req.userId = undefined;
    const res = createMockRes();

  await handleSend(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 400 if message is empty', async () => {
    const req = createMockReq('user-123', { message: '' });
    const res = createMockRes();

  await handleSend(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
  });

  it('should return 400 if message is too long', async () => {
    const req = createMockReq('user-123', { message: 'a'.repeat(1001) });
    const res = createMockRes();

  await handleSend(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message too long (max 1000 characters)' });
  });

  it('should send message and return response', async () => {
    const req = createMockReq('user-123', { message: 'Hello, how are you?' });
    const res = createMockRes();

  await handleSend(req, res);

    expect(res.json).toHaveBeenCalledWith({
      response: 'This is a test AI response',
    });
  });
});
