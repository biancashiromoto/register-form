import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AvatarUploader } from '..';
import useUploadAvatar from '@/hooks/useUploadAvatar';

vi.mock('@/hooks/useUploadAvatar', () => ({
  default: vi.fn(),
}));

describe('AvatarUploader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza o Skeleton quando isLoading é true', () => {
    (useUploadAvatar as any).mockReturnValue({
      avatarUrl: null,
      uploadAvatar: vi.fn(),
      isLoading: true,
    });

    render(<AvatarUploader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renderiza o Avatar quando isLoading é false', () => {
    (useUploadAvatar as any).mockReturnValue({
      avatarUrl: 'blob:fake-url',
      uploadAvatar: vi.fn(),
      isLoading: false,
    });

    render(<AvatarUploader />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'blob:fake-url');
  });

  test('chama uploadAvatar quando um arquivo é selecionado', async () => {
    const mockUploadAvatar = vi.fn();
    (useUploadAvatar as any).mockReturnValue({
      avatarUrl: 'blob:fake-url',
      uploadAvatar: mockUploadAvatar,
      isLoading: false,
    });

    render(<AvatarUploader />);
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
