import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { SnackbarStateType } from '@/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomSnackbar } from '..';

describe('CustomSnackbar', () => {
  const mockSetSnackbarState = vi.fn();
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
            setSnackbarState: mockSetSnackbarState,
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

  it('should call setSnackbarState and onCloseCallback when close button is clicked (with callback)', async () => {
    renderComponent(mockOnCloseCallback);

    await waitFor(() => {
      expect(screen.getByText(mockSnackbarState.message)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetSnackbarState).toHaveBeenCalledTimes(1);
    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it('should call setSnackbarState without onCloseCallback when onCloseCallback is not provided', async () => {
    renderComponent(undefined);

    await waitFor(() => {
      expect(screen.getByText(mockSnackbarState.message)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetSnackbarState).toHaveBeenCalledTimes(1);
  });

  it('should not render snackbar without onCloseCallback when open is not provided', async () => {
    renderComponent(mockOnCloseCallback, {} as SnackbarStateType);

    expect(
      screen.queryByText(mockSnackbarState.message),
    ).not.toBeInTheDocument();
  });
});
