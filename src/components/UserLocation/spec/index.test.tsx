import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { mockCities, mockCountries, mockStates } from '@/tests/mocks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { City, State } from 'country-state-city';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserLocation from '..';

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
  const mockSetUserLocation = vi.fn();
  const mockGetValues = vi.fn();
  const mockSetValue = vi.fn();

  const mockProps = {
    errors: {},
    getValues: mockGetValues,
    setValue: mockSetValue,
  };

  const mockContext = {
    setUserLocation: mockSetUserLocation,
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

  it('renders country field initially', () => {
    renderComponent();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders state field only when country has states', async () => {
    (State.getStatesOfCountry as any).mockReturnValue(mockStates);
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Bra' } });

    const option = await screen.findByText('Brazil');
    fireEvent.click(option);

    expect(screen.getByLabelText('State')).toBeInTheDocument();
  });

  it('does not render state field when country has no states', async () => {
    (State.getStatesOfCountry as any).mockReturnValue([]);
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Aus' } });

    const option = await screen.findByText('Australia');
    fireEvent.click(option);

    expect(screen.queryByLabelText('State')).not.toBeInTheDocument();
  });

  it('renders city field only when state has cities', async () => {
    (State.getStatesOfCountry as any).mockReturnValue(mockStates);
    (City.getCitiesOfState as any).mockReturnValue(mockCities);
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Bra' } });
    const countryOption = await screen.findByText('Brazil');
    fireEvent.click(countryOption);

    const stateInput = screen.getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'São' } });
    const stateOption = await screen.findByText('São Paulo');
    fireEvent.click(stateOption);

    expect(screen.getByLabelText('City')).toBeInTheDocument();
  });

  it('does not render city field when state has no cities', async () => {
    (State.getStatesOfCountry as any).mockReturnValue(mockStates);
    (City.getCitiesOfState as any).mockReturnValue([]);
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Bra' } });
    const countryOption = await screen.findByText('Brazil');
    fireEvent.click(countryOption);

    const stateInput = screen.getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'São' } });
    const stateOption = await screen.findByText('São Paulo');
    fireEvent.click(stateOption);

    expect(screen.queryByLabelText('City')).not.toBeInTheDocument();
  });

  it('resets dependent fields when a field is cleared', async () => {
    renderComponent();

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Bra' } });
    const countryOption = await screen.findByText('Brazil');
    fireEvent.click(countryOption);

    const stateInput = screen.getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'São' } });
    const stateOption = await screen.findByText('São Paulo');
    fireEvent.click(stateOption);

    fireEvent.change(countryInput, { target: { value: '' } });
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('address.state', '');
      expect(mockSetValue).toHaveBeenCalledWith('address.city', '');
    });
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
  });
});
