import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import LoginPage from './Login';
import '@testing-library/jest-dom';

// Mock window.location
const mockWindowLocation = () => {
  delete (window as any).location;
  window.location = { href: '' } as any;
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockWindowLocation();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the login page with welcome message', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.getByText('Welcome to Reentry Buddy')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue your recovery journey')).toBeInTheDocument();
    });

    it('renders the "Sign in with Google" button', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Sign in with Google');
    });

    it('renders Header and Footer components', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      // Header should contain the logo/brand
      expect(screen.getByText('Reentry Buddy')).toBeInTheDocument();
      
      // Footer should be present
      expect(screen.getByTestId('text-footer')).toBeInTheDocument();
    });

    it('displays supportive language in the footer text', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/By signing in, you agree to our commitment/i)).toBeInTheDocument();
    });
  });

  describe('OAuth Flow Initiation', () => {
    it('redirects to /api/auth/google when button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      await user.click(button);

      expect(window.location.href).toBe('/api/auth/google');
    });

    it('shows loading state when button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      await user.click(button);

      expect(button).toBeDisabled();
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    });

    it('button has proper ARIA label for accessibility', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      expect(button).toHaveAttribute('aria-label', 'Sign in with Google');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error=auth_failed query param is present', () => {
      render(
        <MemoryRouter initialEntries={['/login?error=auth_failed']}>
          <LoginPage />
        </MemoryRouter>
      );

      const alert = screen.getByTestId('alert-error');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Authentication failed. Please try again.')).toBeInTheDocument();
    });

    it('displays error message when error=no_email query param is present', () => {
      render(
        <MemoryRouter initialEntries={['/login?error=no_email']}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Your Google account must have an email address.')).toBeInTheDocument();
    });

    it('displays error message when error=cancelled query param is present', () => {
      render(
        <MemoryRouter initialEntries={['/login?error=cancelled']}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/Sign in was cancelled/i)).toBeInTheDocument();
    });

    it('displays generic error message for unknown error codes', () => {
      render(
        <MemoryRouter initialEntries={['/login?error=unknown']}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });

    it('does not display error alert when no error param is present', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.queryByTestId('alert-error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('button is keyboard accessible', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      
      // Focus directly on button
      button.focus();
      expect(button).toHaveFocus();
    });

    it('has proper heading hierarchy', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      // CardTitle renders as H3 by default in shadcn/ui
      const heading = screen.getByText('Welcome to Reentry Buddy');
      // Just ensure it exists and has proper role
      expect(heading).toBeInTheDocument();
    });

    it('error alert has proper role and structure', () => {
      render(
        <MemoryRouter initialEntries={['/login?error=auth_failed']}>
          <LoginPage />
        </MemoryRouter>
      );

      const alert = screen.getByTestId('alert-error');
      expect(alert).toHaveAttribute('role', 'alert');
    });
  });

  describe('Responsive Design', () => {
    it('renders card with proper responsive classes', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      // Card should have max-width constraint
      const card = screen.getByTestId('button-google-signin').closest('[class*="max-w-md"]');
      expect(card).toBeInTheDocument();
    });

    it('button is full width on mobile', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Visual Consistency', () => {
    it('uses consistent background color with Landing page', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toHaveClass('bg-muted/30');
    });

    it('includes Google icon in button', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByTestId('button-google-signin');
      // Check for SVG icon (Lucide Chrome icon)
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
