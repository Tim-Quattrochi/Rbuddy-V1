import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import * as useAuthModule from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  describe('AC#5: Header displays user email and Logout button', () => {
    it('should display user email when authenticated', () => {
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

      expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    });

    it('should display Logout button when authenticated', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toHaveTextContent('Logout');
    });

    it('should NOT display user email when not authenticated', () => {
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

      expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });
  });

  describe('AC#6: Logout functionality in Header', () => {
    it('should call logout function when Logout button is clicked', () => {
      const mockLogout = vi.fn();
      
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: mockLogout,
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderHeader();

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should disable Logout button while logging out', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: true,
        refetch: vi.fn(),
      });

      renderHeader();

      const logoutButton = screen.getByTestId('logout-button');
      expect(logoutButton).toBeDisabled();
      expect(logoutButton).toHaveTextContent('Logging out...');
    });

    it('should show "Logging out..." text during logout', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: true,
        refetch: vi.fn(),
      });

      renderHeader();

      expect(screen.getByTestId('logout-button')).toHaveTextContent('Logging out...');
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

      expect(screen.getByText('Reentry Buddy')).toBeInTheDocument();
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

    it('should render LogOut icon in button when authenticated', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@test.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      const { container } = renderHeader();

      const logoutIcon = container.querySelector('.lucide-log-out');
      expect(logoutIcon).toBeInTheDocument();
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
      expect(screen.getByText('Reentry Buddy')).toBeInTheDocument();
      expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    });
  });

  describe('Different user data', () => {
    it('should display different email addresses correctly', () => {
      const emails = [
        'alice@example.com',
        'bob@test.org',
        'charlie.brown@company.co.uk',
      ];

      emails.forEach((email) => {
        vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
          user: { id: '1', email, username: 'user' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          logout: vi.fn(),
          isLoggingOut: false,
          refetch: vi.fn(),
        });

        const { unmount } = renderHeader();
        expect(screen.getByTestId('user-email')).toHaveTextContent(email);
        unmount();
      });
    });
  });
});
