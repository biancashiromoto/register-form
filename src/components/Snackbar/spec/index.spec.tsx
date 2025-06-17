import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { SnackbarStateType } from '@/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomSnackbar } from '..';

describe('CustomSnackbar', () => {
  const mockHandleCloseSnackbar = vi.fn();
  const mockOnCloseCallback = vi.fn();

  const mockSnackbarState: SnackbarStateType = {
    open: true,
    message: 'Test message',
    severity: 'success',
  };

  const renderComponent = (
    onCloseCallback = mockOnCloseCallback,
    snackbarState = mockSnackbarState,
  ) => {
    render(
      <Context.Provider
        value={
          {
            handleCloseSnackbar: mockHandleCloseSnackbar,
            snackbarState,
          } as unknown as ContextProps
        }
      >
        <CustomSnackbar onCloseCallback={onCloseCallback} />
      </Context.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call handleCloseSnackbar and onCloseCallback when close button is clicked (with callback)', async () => {
    renderComponent(mockOnCloseCallback);

    await waitFor(() => {
      expect(screen.getByText(mockSnackbarState.message)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(mockHandleCloseSnackbar).toHaveBeenCalledTimes(1);
    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it('should call handleCloseSnackbar without onCloseCallback when onCloseCallback is not provided', async () => {
    renderComponent(undefined);

    await waitFor(() => {
      expect(screen.getByText(mockSnackbarState.message)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(mockHandleCloseSnackbar).toHaveBeenCalledTimes(1);
  });

  it('should not render snackbar if open is not true', () => {
    renderComponent(mockOnCloseCallback, {
      open: false,
      message: '',
      severity: 'success',
    });

    expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument();
  });
});
