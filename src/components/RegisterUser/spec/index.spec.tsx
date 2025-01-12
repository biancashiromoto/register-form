import { Context, ContextProps } from '@/context';
import { countries } from '@/helpers';
import { mockUser } from '@/tests/mocks';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterUser from '..';

const mockFormStepsDispatch = vi.fn();

const mockContext = {
  formStepsDispatch: mockFormStepsDispatch,
  formStepsState: {
    activeStep: 0,
  },
} as unknown as ContextProps;

describe('RegisterUser component', () => {
  beforeEach(() => {
    render(
      <Context.Provider value={mockContext}>
        <RegisterUser />
      </Context.Provider>,
    );
  });

  it('renders the initial form', () => {
    expect(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', {
        name: /last name/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /next/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /clear form/i }),
    ).toBeInTheDocument();
  });

  it('handles correct form filling', async () => {
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
      { target: { value: mockUser.firstName } },
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /last name/i,
      }),
      { target: { value: mockUser.lastName } },
    );

    fireEvent.change(screen.getByLabelText(/birth date/i), {
      target: { value: mockUser.birthDate },
    });

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /e-mail/i,
      }),
      { target: { value: mockUser.email } },
    );

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    await screen.findByText(
      `${countries[0].phonecode} (${countries[0].isoCode})`,
    );
    fireEvent.click(
      screen.getByText(`${countries[0].phonecode} (${countries[0].isoCode})`),
    );

    fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), {
      target: { value: mockUser.phone },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockFormStepsDispatch).toHaveBeenCalledWith({ type: 'NEXT_STEP' });
  });

  it('handles click on "Clear form" button', async () => {
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
      { target: { value: mockUser.firstName } },
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /last name/i,
      }),
      { target: { value: mockUser.lastName } },
    );

    fireEvent.click(screen.getByRole('button', { name: /clear form/i }));

    expect(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
    ).toHaveValue('');

    expect(
      screen.queryByRole('textbox', {
        name: /last name/i,
      }),
    ).not.toBeInTheDocument();
  });
});
