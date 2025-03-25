import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AvatarUploader } from '..';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUploadAvatar from '@/hooks/useUploadAvatar';

vi.mock('@/hooks/useUploadAvatar', () => ({
  default: vi.fn(),
}));

vi.mock(import('@/hooks/useAvatarUrl'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAvatarUrl: vi.fn(),
  };
});

describe('AvatarUploader', () => {
  const queryClient = new QueryClient();
  const mockUploadAvatar = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders Skeleton if isLoading is true', () => {
    (useAvatarUrl as any).mockReturnValue({
      data: null,
      isLoading: true,
    });
    (useUploadAvatar as any).mockReturnValue({
      uploadAvatar: mockUploadAvatar,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AvatarUploader />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders Avatar if isLoading is false', () => {
    (useAvatarUrl as any).mockReturnValue({
      data: 'blob:fake-url',
      isLoading: false,
    });
    (useUploadAvatar as any).mockReturnValue({
      uploadAvatar: mockUploadAvatar,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AvatarUploader />
      </QueryClientProvider>,
    );
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'blob:fake-url');
  });

  test('calls uploadAvatar if a file is selected', async () => {
    const mockUploadAvatar = vi.fn();
    (useAvatarUrl as any).mockReturnValue({
      data: 'blob:fake-url',
      isLoading: false,
    });
    (useUploadAvatar as any).mockReturnValue({
      uploadAvatar: mockUploadAvatar,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AvatarUploader />
      </QueryClientProvider>,
    );
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, file);

    expect(mockUploadAvatar).toHaveBeenCalled();
  });
});
