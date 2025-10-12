import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import JournalPage from "../Journal";

const mockUseAuth = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return {
    queryClient,
    ...render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>),
  };
}

describe("JournalPage", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseAuth.mockReset();
    fetchMock = vi.fn();
    global.fetch = fetchMock as any;

    mockUseAuth.mockReturnValue({
      user: { id: "user-1", email: "test@example.com" },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders journal entries returned from the API", async () => {
    const now = new Date().toISOString();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        entries: [
          { id: "entry-1", body: "First reflection", createdAt: now },
          { id: "entry-2", body: "Second reflection", createdAt: now },
        ],
        pagination: { limit: 20, offset: 0, hasMore: false, nextOffset: null },
      }),
    });

    renderWithProviders(<JournalPage />);

    await waitFor(() => {
      expect(screen.getByText("First reflection")).toBeInTheDocument();
      expect(screen.getByText("Second reflection")).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /load more entries/i })).not.toBeInTheDocument();
  });

  it("shows empty state when no entries exist", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        entries: [],
        pagination: { limit: 20, offset: 0, hasMore: false, nextOffset: null },
      }),
    });

    renderWithProviders(<JournalPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /No journal entries yet/i })).toBeInTheDocument();
    });
  });

  it("displays error alert and allows retry", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: async () => ({ error: "Database unavailable" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          entries: [{ id: "entry-1", body: "Recovered entry", createdAt: new Date().toISOString() }],
          pagination: { limit: 20, offset: 0, hasMore: false, nextOffset: null },
        }),
      });

    renderWithProviders(<JournalPage />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load journal entries/i)).toBeInTheDocument();
      expect(screen.getByText(/Database unavailable/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Recovered entry")).toBeInTheDocument();
    });
  });

  it("loads additional pages when Load more button is clicked", async () => {
    const user = userEvent.setup();

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          entries: [{ id: "entry-1", body: "First page", createdAt: new Date().toISOString() }],
          pagination: { limit: 20, offset: 0, hasMore: true, nextOffset: 20 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          entries: [{ id: "entry-2", body: "Second page", createdAt: new Date().toISOString() }],
          pagination: { limit: 20, offset: 20, hasMore: false, nextOffset: null },
        }),
      });

    renderWithProviders(<JournalPage />);

    await waitFor(() => {
      expect(screen.getByText("First page")).toBeInTheDocument();
    });

    const loadMoreButton = await screen.findByRole("button", { name: /load more entries/i });
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[1][0]).toContain("offset=20");
      expect(screen.getByText("Second page")).toBeInTheDocument();
    });
  });
});