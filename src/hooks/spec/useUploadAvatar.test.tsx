import { useAuth } from '@/context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ChangeEvent, FC, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useUploadAvatar, { fetchAvatarUrl } from '../useUploadAvatar';

const mockUpload = vi.fn();
const mockDownload = vi.fn();

vi.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        download: mockDownload,
      })),
    },
    auth: {
      updateUser: vi.fn().mockResolvedValue({}),
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('useUploadAvatar', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  let file: File;

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      sessionRef: { user: { id: 'userId' } },
    });
    file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    mockUpload.mockResolvedValue({ error: null });
  });

  describe('uploadAvatar', () => {
    it('should successfully upload avatar', async () => {
      const { result } = renderHook(() => useUploadAvatar(), { wrapper });

      const input = {
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      await expect(result.current.uploadAvatar(input)).resolves.toBeUndefined();

      const ext = file.name.split('.').pop();
      const expectedPath = `userId/userId.${ext}`;
      expect(mockUpload).toHaveBeenCalledWith(expectedPath, file, {
        upsert: true,
      });
    });

    it('should throw an error if no file is selected', async () => {
      const { result } = renderHook(() => useUploadAvatar(), { wrapper });

      const input = {
        target: { files: [] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      await expect(result.current.uploadAvatar(input)).rejects.toThrow(
        'Select an image.',
      );
    });

    it('should throw an error if file is larger than 8MB', async () => {
      const largeFile = new File(['large'], 'big.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: 9 * 1024 * 1024 });

      const { result } = renderHook(() => useUploadAvatar(), { wrapper });

      const input = {
        target: { files: [largeFile] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      await expect(result.current.uploadAvatar(input)).rejects.toThrow(
        'Image larger than 8MB.',
      );
    });

    it('should throw an error if upload returns an error', async () => {
      const uploadError = new Error('Upload failed');
      mockUpload.mockResolvedValue({ error: uploadError });

      const { result } = renderHook(() => useUploadAvatar(), { wrapper });
      const input = {
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      await expect(result.current.uploadAvatar(input)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('fetchAvatarUrl', () => {
    const dummyBlob = new Blob(['dummy'], { type: 'image/png' });
    const originalCreateObjectURL = URL.createObjectURL;

    beforeEach(() => {
      URL.createObjectURL = vi.fn(() => 'blob://dummy-url');
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('should return a URL when download is successful', async () => {
      mockDownload.mockResolvedValue({ data: dummyBlob, error: null });
      const path = 'userId/avatar.png';
      const resultUrl = await fetchAvatarUrl(path);
      expect(resultUrl).toBe('blob://dummy-url');
      expect(URL.createObjectURL).toHaveBeenCalledWith(dummyBlob);
    });

    it('should throw an error if download returns an error', async () => {
      const errorMsg = 'Download error';
      mockDownload.mockResolvedValue({
        data: null,
        error: { message: errorMsg },
      });
      const path = 'userId/avatar.png';
      await expect(fetchAvatarUrl(path)).rejects.toThrow(errorMsg);
    });

    it('should throw an error if download returns no data', async () => {
      mockDownload.mockResolvedValue({ data: null, error: null });
      const path = 'userId/avatar.png';
      await expect(fetchAvatarUrl(path)).rejects.toThrow(
        'Error downloading avatar',
      );
    });
  });
});
