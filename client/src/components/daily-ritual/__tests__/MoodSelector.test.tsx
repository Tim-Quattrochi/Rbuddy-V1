import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MoodSelector } from '../MoodSelector';

describe('MoodSelector', () => {
  it('renders four mood buttons', () => {
    render(<MoodSelector onSelectMood={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    expect(screen.getByText('Calm')).toBeInTheDocument();
    expect(screen.getByText('Stressed')).toBeInTheDocument();
    expect(screen.getByText('Tempted')).toBeInTheDocument();
    expect(screen.getByText('Hopeful')).toBeInTheDocument();
  });

  it('calls onSelectMood with the correct mood when a button is clicked', () => {
    const handleSelectMood = vi.fn();
    render(<MoodSelector onSelectMood={handleSelectMood} />);
    
    fireEvent.click(screen.getByText('Calm'));
    expect(handleSelectMood).toHaveBeenCalledWith('calm');

    fireEvent.click(screen.getByText('Stressed'));
    expect(handleSelectMood).toHaveBeenCalledWith('stressed');

    fireEvent.click(screen.getByText('Tempted'));
    expect(handleSelectMood).toHaveBeenCalledWith('tempted');

    fireEvent.click(screen.getByText('Hopeful'));
    expect(handleSelectMood).toHaveBeenCalledWith('hopeful');
  });
});
