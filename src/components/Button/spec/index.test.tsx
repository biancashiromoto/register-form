import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton, { CustomButtonProps } from '..';
import { vi } from 'vitest';

describe('CustomButton', () => {
  const handleClick = vi.fn();

  const renderComponent = (
    props: CustomButtonProps = { onClick: handleClick },
  ) => {
    render(<CustomButton {...props}>Test button</CustomButton>);
  };
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Test button')).toBeInTheDocument();
  });

  it('should render as a (<button>) when no href is provided', () => {
    renderComponent();
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('render as a link link (<a>) when href is provided', () => {
    renderComponent({ href: 'https://example.com' });
    const linkButton = screen.getByRole('link');
    expect(linkButton.tagName).toBe('A');
    expect(linkButton).toHaveAttribute('href', 'https://example.com');
  });

  it('should apply CSS class provided by className', () => {
    renderComponent({ className: 'test' });
    const button = screen.getByRole('button');
    expect(button).toHaveClass('test');
  });

  it('should call onClick after it is clicked', () => {
    renderComponent();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
