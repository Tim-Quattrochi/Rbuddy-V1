import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreakCounter } from '../StreakCounter';

describe('StreakCounter', () => {
  it('renders the streak number', () => {
    render(<StreakCounter streak={5} />);
    expect(screen.getByText('Daily Streak')).toBeInTheDocument();
    expect(screen.getByText('5 Days')).toBeInTheDocument();
  });

  it('renders 0 days correctly', () => {
    render(<StreakCounter streak={0} />);
    expect(screen.getByText('0 Days')).toBeInTheDocument();
  });
});
