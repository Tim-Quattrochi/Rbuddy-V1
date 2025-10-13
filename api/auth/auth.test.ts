import { describe, it, expect, vi, beforeEach } from 'vitest';
import googleAuthHandler from './google';
import googleCallbackHandler from './google.callback';

// Mock passport
vi.mock('../../server/services/AuthService', () => {
  const mockPassport = {
    authenticate: vi.fn((strategy: string, options: any, callback?: any) => {
      return (req: any, res: any, next: any) => {
        if (callback) {
          // For callback handler - simulate successful auth
          callback(null, {
            id: 'user-123',
            username: 'testuser',
            email: 'test@example.com',
            googleId: 'google-123',
          });
        } else {
          // For initial redirect - just redirect to Google
          res.redirect('https://accounts.google.com/oauth');
        }
      };
    }),
  };
  return {
    default: mockPassport,
    configurePassport: vi.fn(),
  };
});

// Mock auth middleware
vi.mock('../../server/middleware/auth', () => ({
  generateToken: vi.fn(() => 'mock-jwt-token-12345'),
}));

// Helper to create a mock request
const createMockReq = (method: string = 'GET', body: any = {}, query: any = {}) => {
  return {
    method,
    body,
    query,
    headers: {
      'content-type': 'application/json',
    },
    cookies: {},
  } as any;
};

// Helper to create a mock response
const createMockRes = () => {
  const res: any = {
    cookies: {},
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.redirect = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn((name: string, value: string, options: any) => {
    res.cookies[name] = value;
    return res;
  });
  res.end = vi.fn().mockReturnValue(res);
  return res;
};

describe('OAuth API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const req = createMockReq('GET');
      const res = createMockRes();

      await googleAuthHandler(req, res);

      expect(res.redirect).toHaveBeenCalledWith('https://accounts.google.com/oauth');
    });
  });

  describe('GET /api/auth/google/callback', () => {
    it('should set auth cookie and redirect to /daily-ritual on success', async () => {
      const req = createMockReq('GET');
      const res = createMockRes();
      const next = vi.fn();

      await googleCallbackHandler(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith(
        'auth_token',
        'mock-jwt-token-12345',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
      );
      expect(res.redirect).toHaveBeenCalledWith('/daily-ritual');
    });

    it('should redirect to /login with error if auth fails', async () => {
      // Override mock to simulate failure
      const { default: passport } = await import('../../server/services/AuthService');
      vi.mocked(passport.authenticate).mockImplementationOnce((strategy: string, options: any, callback?: any) => {
        return (req: any, res: any, next: any) => {
          if (callback) {
            callback(new Error('Auth failed'), false);
          }
        };
      });

      const req = createMockReq('GET');
      const res = createMockRes();
      const next = vi.fn();

      await googleCallbackHandler(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/login?error=auth_failed');
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('should redirect to /login with error if no user returned', async () => {
      // Override mock to simulate no user
      const { default: passport } = await import('../../server/services/AuthService');
      vi.mocked(passport.authenticate).mockImplementationOnce((strategy: string, options: any, callback?: any) => {
        return (req: any, res: any, next: any) => {
          if (callback) {
            callback(null, false);
          }
        };
      });

      const req = createMockReq('GET');
      const res = createMockRes();
      const next = vi.fn();

      await googleCallbackHandler(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/login?error=no_user');
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });
});
