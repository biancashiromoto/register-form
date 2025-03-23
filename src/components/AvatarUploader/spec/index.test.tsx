import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AvatarUploader } from '..';

global.URL.createObjectURL = vi.fn(() => 'blob:test');

const fakeUser = {
  id: '123',
  user_metadata: { avatar_url: 'test-avatar.png' },
};

vi.mock('@/context/authContext', () => ({
  useAuth: () => ({ user: fakeUser }),
}));

vi.mock('@/services/supabase', () => {
  const downloadMock = vi.fn(async (path: string) => {
    if (path === 'test-avatar.png') {
      return {
        data: new Blob(['fake image'], { type: 'image/png' }),
        error: null,
      };
    }
    return { data: null, error: new Error('Not Found') };
  });

  const uploadMock = vi.fn(async (path: string, file: File, options: any) => {
    return { error: null };
  });

  const updateUserMock = vi.fn(async (data: any) => ({
    data: null,
    error: null,
  }));

  return {
    supabase: {
      storage: {
        from: vi.fn(() => ({
          download: downloadMock,
          upload: uploadMock,
        })),
      },
      auth: {
        updateUser: updateUserMock,
      },
    },
  };
});

describe('AvatarUploader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders Avatar with the correct src after image download', async () => {
    render(<AvatarUploader />);
    const avatar = await screen.findByRole('img');
    expect(avatar).toHaveAttribute('src', 'blob:test');
  });

  test('uploads file when new file is added', async () => {
    render(<AvatarUploader />);
    await screen.findByRole('img');

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:test');
  });
});
