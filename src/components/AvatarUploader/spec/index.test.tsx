import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { mockSession } from '@/tests/mocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AvatarUploader } from '..';
import { uploadAvatar } from '@/services/user';

vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => ({ session: mockSession }),
}));

vi.mock('@/services/user', () => ({
  uploadAvatar: vi.fn(),
}));

const queryClient = new QueryClient();

describe('AvatarUploader', () => {
  const renderWithContext = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider
          value={
            {
              isLoadingAvatar: false,
              setAvatarPath: vi.fn(),
              setIsLoadingAvatar: vi.fn(),
            } as unknown as ContextProps
          }
        >
          <AvatarUploader />
        </Context.Provider>
      </QueryClientProvider>,
    );

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the file input', () => {
    renderWithContext();
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
  });

  test('calls uploadAvatar when a file is selected', async () => {
    renderWithContext();

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(uploadAvatar).toHaveBeenCalledWith(file);
    });
  });
});
