import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { AddressType, UserType } from '@/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ICity, ICountry, IState } from 'country-state-city';
import { SetStateAction } from 'react';
import { CustomSnackbar } from '..';

describe('CustomSnackbar', () => {
  const mockSetSnackbarState = vi.fn();
  const mockSelectedLocation = {
    country: {} as ICountry,
    state: {} as IState,
    city: {} as ICity,
  };

  const mockContext = {
    setSnackbarState: mockSetSnackbarState,
    snackbarState: {
      open: true,
      severity: 'success',
      message: 'Test messsage',
    },
  } as unknown as ContextProps;

  const mockOnCloseCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (context = mockContext) => {
    render(
      <Context.Provider value={context}>
        <CustomSnackbar onCloseCallback={mockOnCloseCallback} />
      </Context.Provider>,
    );
  };

  it('should render snackbar if openSnackbar is true and close after click on close button', async () => {
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
    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it('should not render snackbar if openSnackbar is false', () => {
    renderComponent({
      setSnackbarState: mockSetSnackbarState,
      snackbarState: {
        open: false,
        message: 'Test message',
        severity: 'success',
      },
      registeringUser: null,
      setRegisteringUser: function (
        value: SetStateAction<UserType | null>,
      ): void {
        throw new Error('Function not implemented.');
      },
      selectedLocation: mockSelectedLocation,
      setSelectedLocation: function (value: SetStateAction<AddressType>): void {
        throw new Error('Function not implemented.');
      },
    });

    expect(
      screen.queryByText(mockContext.snackbarState.message),
    ).not.toBeInTheDocument();
  });
});
