import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import * as useAuthModule from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

// Mock navigation components
vi.mock('@/components/navigation/NavigationMenu', () => ({
  NavigationMenu: ({ onOpenRepair }: { onOpenRepair: () => void }) => (
    <button data-testid="mock-navigation-menu" onClick={onOpenRepair}>
      Nav Menu
    </button>
  ),
}));

vi.mock('@/components/navigation/UserMenu', () => ({
  UserMenu: ({ onOpenRepair }: { onOpenRepair: () => void }) => (
    <button data-testid="mock-user-menu" onClick={onOpenRepair}>
      User Menu
    </button>
  ),
}));

describe('Header component', () => {
  const mockOnOpenRepair = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = (props = {}) => {
    return render(
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    );
  };

  describe('Navigation rendering for authenticated users', () => {
    it('should render NavigationMenu when authenticated and onOpenRepair provided', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      expect(screen.getByTestId('mock-navigation-menu')).toBeInTheDocument();
    });

    it('should render UserMenu when authenticated and onOpenRepair provided', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      expect(screen.getByTestId('mock-user-menu')).toBeInTheDocument();
    });

    it('should NOT render navigation menus when not authenticated', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      expect(screen.queryByTestId('mock-navigation-menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-user-menu')).not.toBeInTheDocument();
    });

    it('should NOT render navigation menus when onOpenRepair not provided', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader();

      expect(screen.queryByTestId('mock-navigation-menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-user-menu')).not.toBeInTheDocument();
    });

    it('should render Daily Ritual navigation link on desktop when authenticated', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      const dailyRitualLink = screen.getByTestId('nav-link-daily-ritual');
      expect(dailyRitualLink).toBeInTheDocument();
      expect(dailyRitualLink).toHaveTextContent('Daily Ritual');
      expect(dailyRitualLink).toHaveAttribute('href', '/daily-ritual');
    });
  });

  describe('AC#5 & AC#6: Original logout functionality (deprecated - now in navigation menus)', () => {
    it('should NOT display standalone user email anymore (moved to navigation menus)', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      // The old user-email testid no longer exists in Header
      expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    });

    it('should NOT display standalone Logout button anymore (moved to navigation menus)', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader({ onOpenRepair: mockOnOpenRepair });

      // The old logout-button testid no longer exists in Header
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });
  });

  describe('Conditional rendering', () => {
    it('should render logo and title for all users', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader();

      expect(screen.getByText('Next Moment')).toBeInTheDocument();
      expect(screen.getByTestId('link-home')).toHaveAttribute('href', '/');
    });

    it('should render Heart icon', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      const { container } = renderHeader();

      const heartIcon = container.querySelector('.lucide-heart');
      expect(heartIcon).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should handle loading state gracefully', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader();

      // Should still render header, just without user info
      expect(screen.getByText('Next Moment')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-navigation-menu')).not.toBeInTheDocument();
    });
  });

  describe('Different user scenarios', () => {
    it('should work with different authentication states', () => {
      const states = [
        { isAuthenticated: false, user: null },
        { isAuthenticated: true, user: { id: '1', email: 'alice@example.com', username: 'alice' } },
        { isAuthenticated: true, user: { id: '2', email: 'bob@test.org', username: 'bob' } },
      ];

      states.forEach(({ isAuthenticated, user }) => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
          user,
          isAuthenticated,
          isLoading: false,
          error: null,
          logout: vi.fn(),
          isLoggingOut: false,
          refetch: vi.fn(),
        });

        const { unmount } = renderHeader({ onOpenRepair: mockOnOpenRepair });
        expect(screen.getByText('Next Moment')).toBeInTheDocument();
        
        if (isAuthenticated) {
          expect(screen.getByTestId('mock-navigation-menu')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('mock-navigation-menu')).not.toBeInTheDocument();
        }
        
        unmount();
      });
    });
  });
});
