import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { CustomSnackbar } from '..';

describe('CustomSnackbar', () => {
  const mockSetOpenSnackbar = vi.fn();

  const renderComponent = (props: any = { openSnackbar: true }) => {
    render(
      <CustomSnackbar
        openSnackbar={props.openSnackbar}
        setOpenSnackbar={mockSetOpenSnackbar}
        message="Test message"
      />,
    );
  };

  it('should render snackbar if openSnackbar is true', () => {
    renderComponent();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should not render snackbar if openSnackbar is false', () => {
    renderComponent(false);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});
