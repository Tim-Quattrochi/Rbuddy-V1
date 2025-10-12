import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntentionInput } from '../IntentionInput';

describe('IntentionInput', () => {
  it('renders the input field', () => {
    render(<IntentionInput onSaveIntention={() => {}} />);
    expect(screen.getByLabelText('Set Your Intention for Today (Optional)')).toBeInTheDocument();
  });

  it('calls onSaveIntention with the input value on blur', () => {
    const handleSaveIntention = vi.fn();
    render(<IntentionInput onSaveIntention={handleSaveIntention} />);
    const input = screen.getByLabelText('Set Your Intention for Today (Optional)');

    fireEvent.change(input, { target: { value: '  My intention  ' } });
    fireEvent.blur(input);

    expect(handleSaveIntention).toHaveBeenCalledWith('My intention');
  });

  it('does not call onSaveIntention if the input is empty or only whitespace', () => {
    const handleSaveIntention = vi.fn();
    render(<IntentionInput onSaveIntention={handleSaveIntention} />);
    const input = screen.getByLabelText('Set Your Intention for Today (Optional)');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(handleSaveIntention).not.toHaveBeenCalled();
  });
});
