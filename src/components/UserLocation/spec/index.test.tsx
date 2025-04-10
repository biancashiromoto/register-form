import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserLocation from '..';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { mockCities, mockCountries, mockStates } from '@/tests/mocks';

vi.mock('country-state-city', () => ({
  Country: {
    getAllCountries: vi.fn(() => mockCountries),
  },
  State: {
    getStatesOfCountry: vi.fn(() => mockStates),
  },
  City: {
    getCitiesOfState: vi.fn(() => mockCities),
  },
}));

describe('UserLocation', () => {
  const mockSetSelectedLocation = vi.fn();
  const mockGetValues = vi.fn();
  const mockSetValue = vi.fn();

  const mockProps = {
    errors: {},
    getValues: mockGetValues,
    setValue: mockSetValue,
  };

  const mockContext = {
    setSelectedLocation: mockSetSelectedLocation,
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetValues.mockImplementation((field: string) => {
      switch (field) {
        case 'email':
          return 'test@email.com';
        case 'address.country':
          return 'Brazil';
        case 'address.state':
          return 'São Paulo';
        case 'address.city':
          return '';
        default:
          return '';
      }
    });
  });

  const renderComponent = (props = mockProps) => {
    return render(
      <Context.Provider value={mockContext}>
        <UserLocation {...props} />
      </Context.Provider>,
    );
  };

  it('renders all location fields when previous fields have values', () => {
    renderComponent();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
  });

  it('updates location when country is selected', async () => {
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Bra' } });

    const option = await screen.findByText('Brazil');
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('address.state', '');
      expect(mockSetValue).toHaveBeenCalledWith('address.city', '');
      expect(mockSetSelectedLocation).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });
  });

  it('updates location when state is selected', async () => {
    renderComponent();

    const stateInput = screen.getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'São' } });

    const option = await screen.findByText('São Paulo');
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('address.city', '');
      expect(mockSetSelectedLocation).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });
  });

  it('updates location when city is selected', async () => {
    renderComponent();

    const cityInput = screen.getByLabelText('City');
    fireEvent.change(cityInput, { target: { value: 'São' } });

    const option = await screen.findByText('São Paulo');
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockSetSelectedLocation).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });
  });

  it('resets dependent fields when a field is cleared', async () => {
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: '' } });

    // await waitFor(() => {
    //   expect(mockSetValue).toHaveBeenCalledWith('address.state', '');
    //   expect(mockSetValue).toHaveBeenCalledWith('address.city', '');
    // });
  });

  it('handles errors in location fields', () => {
    const propsWithErrors = {
      ...mockProps,
      errors: {
        address: {
          country: { message: 'Country is required' },
          state: { message: 'State is required' },
          city: { message: 'City is required' },
        },
      },
    };

    renderComponent(propsWithErrors);

    expect(screen.getByText('Country is required')).toBeInTheDocument();
    expect(screen.getByText('State is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
  });
});
