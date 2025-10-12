import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import DailyRitualPage from '../DailyRitual';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Create a test query client
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Helper to render with providers
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    ),
    queryClient,
  };
}

describe('DailyRitual Integration Tests', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
  // Cast to any to satisfy TS when stubbing fetch in tests
  global.fetch = fetchMock as any;
    mockToast.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication States', () => {
    it('shows loading state while authentication is being checked', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderWithProviders(<DailyRitualPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows authentication required message if user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      renderWithProviders(<DailyRitualPage />);

      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(screen.getByText('Please log in to access your Daily Ritual.')).toBeInTheDocument();
    });
  });

  describe('Test Scenario 1: Authenticated user loads page and sees streak counter', () => {
    it('displays user welcome message and streak counter', async () => {
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      // Check user welcome message
      await waitFor(() => {
        expect(screen.getByText(/Welcome back, testuser/i)).toBeInTheDocument();
      });

      // Check streak counter
      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/user/stats',
        expect.objectContaining({ credentials: 'include' })
      );
    });
  });

  describe('Test Scenario 2: User selects mood and sees affirmation', () => {
    it('displays affirmation after mood selection', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock stats fetch
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      // Mock mood selection response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'test-session-123',
          affirmation: 'You are doing great!',
        }),
      });

      // Click a mood button (find by role button)
      const moodButtons = screen.getAllByRole('button');
      const calmButton = moodButtons.find(button =>
        button.textContent?.toLowerCase().includes('calm')
      );

      if (calmButton) {
        await user.click(calmButton);

        // Check that affirmation appears
        await waitFor(() => {
          expect(screen.getByText('You are doing great!')).toBeInTheDocument();
        });

        // Check toast notification
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({
              title: 'Mood recorded',
              description: 'Your daily check-in has been saved.',
            })
          );
        });

        expect(fetchMock).toHaveBeenCalledWith(
          '/api/daily-ritual/mood',
          expect.objectContaining({
            method: 'POST',
            credentials: 'include',
          })
        );
      }
    });
  });

  describe('Test Scenario 3: User submits intention and sees success toast', () => {
    it('saves intention and shows success message', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock stats fetch
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      // Mock mood selection
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'test-session-123',
          affirmation: 'Test affirmation',
        }),
      });

      // Select a mood
      const calmButton = screen.getByRole('button', { name: /calm/i });
      await user.click(calmButton);

      // Wait for affirmation to appear
      await waitFor(() => {
        expect(screen.getByText('Test affirmation')).toBeInTheDocument();
      });

      // Mock intention submission
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      // Find and fill intention input
      const intentionInput = screen.getByPlaceholderText(/I will be patient with myself/i);
      await user.type(intentionInput, 'My daily intention');

      // Submit intention by blurring the input (component saves on blur)
      await user.tab(); // Tab out to trigger blur event

      // Check success toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Intention saved',
            description: 'Your daily intention has been recorded.',
          })
        );
      });

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/daily-ritual/intention',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });
  });

  describe('Test Scenario 4: API error displays error message', () => {
    it('displays error alert when mood selection fails', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock stats fetch
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      // Mock mood selection failure
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      // Click a specific mood button to avoid interference from other buttons
      const calmButtonErr = screen.getByRole('button', { name: /calm/i });
      await user.click(calmButtonErr);

      // Check error alert appears (use descriptive text for robustness)
      await waitFor(() => {
        expect(
          screen.getByText("We couldn't save your mood selection. Please try again.")
        ).toBeInTheDocument();
      });

      // Check error toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
            title: 'Error recording mood',
          })
        );
      });
    });

    it('displays session expired message for 401 errors', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock stats fetch
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      // Mock 401 error
      fetchMock.mockRejectedValueOnce(new Error('401 Unauthorized'));

      const calmButton2 = screen.getByRole('button', { name: /calm/i });
      await user.click(calmButton2);

      // Check session expired toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
            title: 'Session expired',
            description: 'Your session has expired. Please log in again.',
          })
        );
      });
    });
  });

  describe('Test Scenario 5: Loading states render correctly', () => {
    it('shows loading indicator while fetching stats', async () => {
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock delayed stats fetch
      fetchMock.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ streakCount: 5 }),
                }),
              100
            )
          )
      );

      renderWithProviders(<DailyRitualPage />);

      // Check loading state appears
      expect(screen.getByText('Loading your stats...')).toBeInTheDocument();

      // Wait for stats to load
      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });
    });

    it('shows loading indicator while posting mood', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        logout: vi.fn(),
        isLoggingOut: false,
        refetch: vi.fn(),
      });

      // Mock stats fetch
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ streakCount: 5 }),
      });

      renderWithProviders(<DailyRitualPage />);

      await waitFor(() => {
        expect(screen.getByText('5 Days')).toBeInTheDocument();
      });

      // Mock delayed mood selection
      fetchMock.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    sessionId: 'test-session-123',
                    affirmation: 'Test affirmation',
                  }),
                }),
              100
            )
          )
      );

      const calmButton3 = screen.getByRole('button', { name: /calm/i });
      await user.click(calmButton3);

      // Check loading state appears
      expect(screen.getByText('Loading affirmation...')).toBeInTheDocument();

      // Wait for affirmation to appear
      await waitFor(() => {
        expect(screen.getByText('Test affirmation')).toBeInTheDocument();
      });
    });
  });

  describe('Support Widget and RepairFlow integration', () => {
    it.skip('RepairFlow integration moved to AppLayout - see AppLayout tests', async () => {
      // This test is now obsolete. The RepairFlow modal state management 
      // has been moved to AppLayout component as part of Story 4.3.
      // RepairFlow is now accessed via the navigation menu (mobile hamburger or desktop user menu).
      // Integration tests for RepairFlow should be added to AppLayout or E2E tests.
    });
  });
});
