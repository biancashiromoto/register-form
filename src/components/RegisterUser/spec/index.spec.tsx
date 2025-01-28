import { mockUser } from '@/tests/mocks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RegisterUser from '..';

describe('RegisterUser component', () => {
  beforeEach(() => {
    render(<RegisterUser />);
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

    fireEvent.change(screen.getByTestId('password').firstChild as Element, {
      target: { value: mockUser.password },
    });
    fireEvent.change(
      screen.getByTestId('confirm-password').firstChild as Element,
      { target: { value: mockUser.confirmPassword } },
    );

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/User successfully registered!/i),
      ).toBeInTheDocument();
    });
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
