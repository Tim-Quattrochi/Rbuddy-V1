import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupportWidget } from '../SupportWidget';

describe('SupportWidget', () => {
  it('renders with correct text and styling', () => {
    const mockOpen = vi.fn();
    render(<SupportWidget onOpenRepair={mockOpen} />);

    expect(screen.getByTestId('support-widget')).toBeInTheDocument();
    expect(screen.getByText('Need Support?')).toBeInTheDocument();
    expect(screen.getByText("Tough moments happen. We're here to help, anytime.")).toBeInTheDocument();

    // Styling hooks present
    const widget = screen.getByTestId('support-widget');
    expect(widget.className).toContain('bg-purple-50');
    expect(widget.className).toContain('border-purple-200');
  });

  it('calls onOpenRepair when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOpen = vi.fn();
    render(<SupportWidget onOpenRepair={mockOpen} />);

    const btn = screen.getByRole('button', { name: /access support/i });
    await user.click(btn);
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    const mockOpen = vi.fn();
    render(<SupportWidget onOpenRepair={mockOpen} />);

    const region = screen.getByRole('region', { name: /need support\?/i });
    expect(region).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /access support/i });
    expect(button).toBeInTheDocument();
  });
});
