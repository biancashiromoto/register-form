import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CustomSnackbar } from '..';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { SnackbarStateType } from '@/types';

describe('CustomSnackbar', () => {
  const mockSetSnackbarState = vi.fn();

  const mockContext = {
    setSnackbarState: mockSetSnackbarState,
    snackbarState: {
      open: true,
      severity: 'success',
      message: 'Test messsage',
    },
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (context = mockContext) => {
    render(
      <Context.Provider value={context}>
        <CustomSnackbar />
      </Context.Provider>,
    );
  };

  it('should render snackbar if openSnackbar is true', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(mockContext.snackbarState.message),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    );
    expect(mockSetSnackbarState).toHaveBeenCalledTimes(1);
  });

  it('should not render snackbar if openSnackbar is false', () => {
    renderComponent({
      setSnackbarState: mockSetSnackbarState,
      snackbarState: {
        open: false,
        message: 'Test message',
        severity: 'success',
      },
    });

    expect(
      screen.queryByText(mockContext.snackbarState.message),
    ).not.toBeInTheDocument();
  });
});
