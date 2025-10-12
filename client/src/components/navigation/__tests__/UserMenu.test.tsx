import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserMenu } from '../UserMenu';
import * as useAuthModule from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

describe('UserMenu component', () => {
  const mockOnOpenRepair = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderUserMenu = () => {
    return render(
      <BrowserRouter>
        <UserMenu onOpenRepair={mockOnOpenRepair} />
      </BrowserRouter>
    );
  };

  describe('User menu rendering', () => {
    it('should render user menu trigger button', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderUserMenu();

      expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument();
    });

    it('should return null when user is not authenticated', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      const { container } = renderUserMenu();

      expect(container.firstChild).toBeNull();
    });

    it('should display user email in trigger button', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderUserMenu();

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display correct user initials in avatar', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john.doe@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderUserMenu();

      // First two characters of email username part
      expect(screen.getByText('JO')).toBeInTheDocument();
    });

    it('should have chevron down icon indicating dropdown', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      const { container } = renderUserMenu();

      const chevronIcon = container.querySelector('.lucide-chevron-down');
      expect(chevronIcon).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should have proper button attributes for accessibility', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderUserMenu();

      const trigger = screen.getByTestId('user-menu-trigger');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('should handle different email formats correctly', () => {
      const testEmails = [
        { email: 'alice@example.com', initials: 'AL' },
        { email: 'bob.smith@test.org', initials: 'BO' },
        { email: 'x@y.com', initials: 'X' },
      ];

      testEmails.forEach(({ email, initials }) => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
          user: { id: '1', email, username: 'test' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          logout: vi.fn(),
          isLoggingOut: false,
          refetch: vi.fn(),
        });

        const { unmount } = renderUserMenu();
        expect(screen.getByText(email)).toBeInTheDocument();
        expect(screen.getByText(initials)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Prop handling', () => {
    it('should accept onOpenRepair prop without errors', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      expect(() => renderUserMenu()).not.toThrow();
    });
  });
});
