// LoadingLayer.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingLayer, { LoadingLayerProps } from '..';

const mockHandleClose = vi.fn();

const mockProps: LoadingLayerProps = {
  open: true,
  handleClose: mockHandleClose,
};

const renderComponent = (props: LoadingLayerProps = mockProps) => {
  return render(<LoadingLayer {...props} />);
};

describe('LoadingLayer', () => {
  it('should render CircularProgress if open is true', () => {
    renderComponent();
    const progress = screen.getByTestId('loading-img');
    expect(progress).toBeInTheDocument();
  });

  it('should render CircularProgress but not be visible if open is false', () => {
    renderComponent({ ...mockProps, open: false });
    const progress = screen.getByTestId('loading-img');
    expect(progress).not.toBeVisible();
  });

  it('should call handleClose when Backdrop is clicked', () => {
    renderComponent();
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
