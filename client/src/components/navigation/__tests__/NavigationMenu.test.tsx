import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationMenu } from '../NavigationMenu';
import * as useAuthModule from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

describe('NavigationMenu component', () => {
  const mockOnOpenRepair = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavigationMenu = () => {
    return render(
      <BrowserRouter>
        <NavigationMenu onOpenRepair={mockOnOpenRepair} />
      </BrowserRouter>
    );
  };

  describe('Mobile menu rendering', () => {
    it('should render hamburger menu button', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      expect(screen.getByTestId('hamburger-menu-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    });

    it('should open menu when hamburger is clicked', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
      });
    });

    it('should display user email in menu', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'john@example.com', username: 'john' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        expect(screen.getByTestId('nav-user-email')).toHaveTextContent('john@example.com');
      });
    });
  });

  describe('Navigation menu items', () => {
    it('should display Daily Ritual link', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const dailyRitualLink = screen.getByTestId('nav-daily-ritual');
        expect(dailyRitualLink).toBeInTheDocument();
        expect(dailyRitualLink).toHaveTextContent('Daily Ritual');
      });
    });

    it('should display Need Support button', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const supportButton = screen.getByTestId('nav-need-support');
        expect(supportButton).toBeInTheDocument();
        expect(supportButton).toHaveTextContent('Need Support');
      });
    });

    it('should display Settings placeholder (disabled)', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const settingsButton = screen.getByTestId('nav-settings');
        expect(settingsButton).toBeInTheDocument();
        expect(settingsButton).toBeDisabled();
        expect(settingsButton).toHaveAttribute('title', 'Coming soon');
      });
    });

    it('should display Logout button', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const logoutButton = screen.getByTestId('nav-logout');
        expect(logoutButton).toBeInTheDocument();
        expect(logoutButton).toHaveTextContent('Logout');
      });
    });
  });

  describe('Navigation functionality', () => {
    it('should trigger onOpenRepair when Need Support is clicked', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const supportButton = screen.getByTestId('nav-need-support');
        fireEvent.click(supportButton);
      });

      expect(mockOnOpenRepair).toHaveBeenCalledTimes(1);
    });

    it('should call logout when Logout is clicked', async () => {
      const mockLogout = vi.fn();
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: mockLogout,
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const logoutButton = screen.getByTestId('nav-logout');
        fireEvent.click(logoutButton);
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should disable Logout button when logging out', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: true,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const logoutButton = screen.getByTestId('nav-logout');
        expect(logoutButton).toBeDisabled();
        expect(logoutButton).toHaveTextContent('Logging out...');
      });
    });
  });

  describe('Active page indicator', () => {
    it('should highlight active page (Daily Ritual)', async () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock current location
      window.history.pushState({}, 'Daily Ritual', '/daily-ritual');

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      fireEvent.click(hamburger);

      await waitFor(() => {
        const dailyRitualLink = screen.getByTestId('nav-daily-ritual');
        expect(dailyRitualLink).toHaveClass('bg-accent');
        expect(dailyRitualLink).toHaveClass('text-accent-foreground');
      });
    });
  });

  describe('Keyboard accessibility', () => {
    it('should have proper aria-label on hamburger button', () => {
      vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
        user: { id: '1', email: 'test@example.com', username: 'test' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderNavigationMenu();

      const hamburger = screen.getByTestId('hamburger-menu-button');
      expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu');
    });
  });
});
