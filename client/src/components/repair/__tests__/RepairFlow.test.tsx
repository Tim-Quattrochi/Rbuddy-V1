import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RepairFlow } from '../RepairFlow';

// Mock fetch
global.fetch = vi.fn();

function mockFetch(response: any, ok = true) {
  (global.fetch as any).mockResolvedValueOnce({
    ok,
    json: async () => response,
  });
}

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
}

describe('RepairFlow Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state with empathetic message (AC#6)', () => {
    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    expect(screen.getByText(/Slips happen/i)).toBeInTheDocument();
    expect(screen.getByText(/What triggered this moment/i)).toBeInTheDocument();
  });

  it('renders three trigger option buttons (AC#6)', () => {
    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    expect(screen.getByText('Stress')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Craving')).toBeInTheDocument();
  });

  it('submits trigger selection and displays repair suggestion (AC#7)', async () => {
    const mockResponse = {
      sessionId: 'test-session-123',
      message: 'Slips happen. What matters is what you do next.',
      repairSuggestion: 'Take 3 deep breaths right now.',
    };

    mockFetch(mockResponse);

    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    // Click the Stress button
    fireEvent.click(screen.getByText('Stress'));

    // Verify API was called with correct payload
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/repair/start',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'stress' }),
        })
      );
    });

    // Wait for repair suggestion to appear
    await waitFor(() => {
      expect(screen.getByText('Take 3 deep breaths right now.')).toBeInTheDocument();
    });

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows closing message when Done is clicked (AC#8)', async () => {
    const mockResponse = {
      sessionId: 'test-session-123',
      message: 'Slips happen. What matters is what you do next.',
      repairSuggestion: 'Text or call someone who supports your recovery.',
    };

    mockFetch(mockResponse);

    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    // Select trigger
    fireEvent.click(screen.getByText('People'));

    // Wait for suggestion screen
    await waitFor(() => {
      expect(screen.getByText('Text or call someone who supports your recovery.')).toBeInTheDocument();
    });

    // Click Done
    fireEvent.click(screen.getByText('Done'));

    // Verify closing message
    await waitFor(() => {
      expect(screen.getByText(/We're here with you/i)).toBeInTheDocument();
      expect(screen.getByText(/Come back tomorrow/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', async () => {
    const mockResponse = {
      sessionId: 'test-session-123',
      message: 'Slips happen. What matters is what you do next.',
      repairSuggestion: 'Drink a glass of water and step outside.',
    };

    mockFetch(mockResponse);

    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    // Go through the flow
    fireEvent.click(screen.getByText('Craving'));

    await waitFor(() => {
      expect(screen.getByText('Drink a glass of water and step outside.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles API error gracefully (Edge Case)', async () => {
    mockFetch({ error: 'Internal Server Error' }, false);

    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Stress'));

    // Wait for error toast (component should show error)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // User should still be on trigger selection screen (can retry)
    expect(screen.getByText('Stress')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Craving')).toBeInTheDocument();

    // onClose should NOT have been called (flow not complete)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows loading state during API call', async () => {
    const mockResponse = {
      sessionId: 'test-session-123',
      message: 'Slips happen. What matters is what you do next.',
      repairSuggestion: 'Take 3 deep breaths right now.',
    };

    // Delay the response
    (global.fetch as any).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockResponse,
              }),
            100
          )
        )
    );

    renderWithQueryClient(<RepairFlow onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Stress'));

    // Loading state should appear
    await waitFor(() => {
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    // Buttons should be disabled during loading
    expect(screen.getByText('Stress')).toBeDisabled();
  });
});
