import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AffirmationCard } from '../AffirmationCard';

describe('AffirmationCard', () => {
  it('renders the affirmation text', () => {
    const affirmation = "You are on the right path.";
    render(<AffirmationCard affirmation={affirmation} />);
    expect(screen.getByText('A Thought for Today')).toBeInTheDocument();
    expect(screen.getByText(affirmation)).toBeInTheDocument();
  });
});
