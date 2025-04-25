import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputText, { InputTextProps } from '../index';
import { labels } from '@/helpers/labels';
import { useTheme } from '@mui/material';

vi.mock('@mui/material', () => ({
  ...vi.importActual('@mui/material'),
  useTheme: vi.fn(),
  TextField: ({
    label,
    error,
    helperText,
    value,
    onChange,
    required,
    autoComplete,
    sx,
    ...props
  }: any) => (
    <div style={sx}>
      <label htmlFor={props.id}>{label}</label>
      <input
        id={props.id}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-label={label}
        {...props}
      />
      {error && <span role="alert">{helperText}</span>}
    </div>
  ),
}));

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('InputText', () => {
  const mockRegister = vi.fn().mockReturnValue({
    name: 'firstName',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  });

  const mockProps: InputTextProps = {
    hidden: false,
    errors: {},
    name: 'firstName',
    register: mockRegister,
    value: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({
      palette: {
        background: {
          default: '#ffffff',
        },
      },
    });
  });

  const renderComponent = (props = mockProps) => {
    return render(<InputText {...props} />);
  };

  it('does not render when hidden is true', () => {
    renderComponent({ ...mockProps, hidden: true });
    expect(
      screen.queryByLabelText(labels[mockProps.name]),
    ).not.toBeInTheDocument();
  });

  it('renders with correct label', () => {
    renderComponent();
    expect(screen.getByLabelText(labels[mockProps.name])).toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('firstName');
  });

  it('displays error message when there is an error', () => {
    const errorMessage = 'This field is required';
    renderComponent({
      ...mockProps,
      errors: {
        firstName: {
          type: 'required',
          message: errorMessage,
        },
      },
    });
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('uses user metadata as default value when available', () => {
    renderComponent({ ...mockProps, value: 'John' });
    const input = screen.getByRole('textbox', {
      name: /first name/i,
    });
    expect(input).toHaveValue('John');
  });

  it('applies required attribute when specified', () => {
    renderComponent({ ...mockProps, required: true });
    const input = screen.getByLabelText(labels[mockProps.name]);
    expect(input).toHaveAttribute('required');
  });

  it('applies autoComplete attribute when specified', () => {
    const autoComplete = 'username';
    renderComponent({ ...mockProps, autoComplete });
    const input = screen.getByLabelText(labels[mockProps.name]);
    expect(input).toHaveAttribute('autoComplete', autoComplete);
  });

  it('applies background color from theme', () => {
    const mockTheme = {
      palette: {
        background: {
          default: '#f5f5f5',
        },
      },
    };
    (useTheme as any).mockReturnValue(mockTheme);

    renderComponent();
    const input = screen.getByLabelText(labels[mockProps.name]);
    const container = input.parentElement;
    expect(container).toHaveStyle({ backgroundColor: '#f5f5f5' });
  });
});
