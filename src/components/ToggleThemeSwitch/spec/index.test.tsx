import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ToggleThemeSwitch from '../index';

describe('ToggleThemeSwitch', () => {
  it('renders without crashing', () => {
    render(<ToggleThemeSwitch />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should reflect the checked prop correctly', () => {
    const { rerender } = render(<ToggleThemeSwitch checked={false} />);
    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<ToggleThemeSwitch checked={true} />);
    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onChange when toggled', () => {
    const handleChange = vi.fn();
    render(<ToggleThemeSwitch onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should forward additional props', () => {
    render(<ToggleThemeSwitch aria-label="Custom toggle" />);
    const input = screen.getByLabelText('Custom toggle');
    expect(input).toBeInTheDocument();
  });
});
