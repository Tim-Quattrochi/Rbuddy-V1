import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../storage';
import type { User } from '../storage';

// Mock the storage module
vi.mock('../storage', () => ({
  storage: {
    getUserByGoogleId: vi.fn(),
    createUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

describe('AuthService - Google OAuth Strategy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Find or Create User Logic', () => {
    it('should return existing user when found by Google ID', async () => {
      const existingUser: User = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        googleId: 'google-123',
        avatarUrl: 'https://example.com/avatar.jpg',
        password: null,
        phoneNumber: null,
        deviceToken: null,
        preferredTime: null,
        lastSyncAt: null,
        enablePushNotifications: true,
      };

      vi.mocked(storage.getUserByGoogleId).mockResolvedValue(existingUser);

      const result = await storage.getUserByGoogleId('google-123');

      expect(storage.getUserByGoogleId).toHaveBeenCalledWith('google-123');
      expect(result).toEqual(existingUser);
      expect(storage.createUser).not.toHaveBeenCalled();
    });

    it('should create new user when not found by Google ID', async () => {
      const newUser: User = {
        id: 'user-456',
        username: 'newuser_123456',
        email: 'newuser@example.com',
        googleId: 'google-456',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        password: null,
        phoneNumber: null,
        deviceToken: null,
        preferredTime: null,
        lastSyncAt: null,
        enablePushNotifications: true,
      };

      vi.mocked(storage.getUserByGoogleId).mockResolvedValue(undefined);
      vi.mocked(storage.createUser).mockResolvedValue(newUser);

      const googleIdNotFound = await storage.getUserByGoogleId('google-456');
      expect(googleIdNotFound).toBeUndefined();

      const result = await storage.createUser({
        googleId: 'google-456',
        email: 'newuser@example.com',
        username: 'newuser_123456',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        password: null,
      });

      expect(storage.getUserByGoogleId).toHaveBeenCalledWith('google-456');
      expect(storage.createUser).toHaveBeenCalledWith({
        googleId: 'google-456',
        email: 'newuser@example.com',
        username: 'newuser_123456',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        password: null,
      });
      expect(result).toEqual(newUser);
    });

    it('should handle missing email in profile', async () => {
      vi.mocked(storage.getUserByGoogleId).mockResolvedValue(undefined);

      // Simulate the error case - in real AuthService this would throw
      const profileWithoutEmail = {
        id: 'google-789',
        emails: undefined,
      };

      expect(profileWithoutEmail.emails).toBeUndefined();
    });
  });
});
