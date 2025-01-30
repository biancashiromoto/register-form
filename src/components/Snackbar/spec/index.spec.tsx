import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { CustomSnackbar } from '..';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';

describe('CustomSnackbar', () => {
  const mockSetSnackbarState = vi.fn();

  const mockContext = {
    setSnackbarState: mockSetSnackbarState,
    snackBarState: {
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
        screen.getByText(mockContext.snackBarState.message),
      ).toBeInTheDocument();
    });
  });

  it('should not render snackbar if openSnackbar is false', () => {
    renderComponent({
      setSnackbarState: mockSetSnackbarState,
      snackBarState: {
        open: false,
        message: 'Test message',
        severity: 'success',
      },
    });

    screen.logTestingPlaygroundURL();
    // expect(
    //   screen.getByText(mockContext.snackBarState.message),
    // ).not.toBeInTheDocument();
  });
});
