import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUploadAvatar from '../useUploadAvatar';
import { ChangeEvent } from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from '@tanstack/react-router';
import { useAuth } from '@/context/authContext';

// Mocks
vi.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
    auth: {
      updateUser: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('useUploadAvatar', () => {
  const queryClient = new QueryClient();
  let file: File;
  const mockSetCurrentSession = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      setCurrentSession: mockSetCurrentSession,
    });
    file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
  });

  it('deve realizar o upload de um avatar com sucesso', async () => {
    const { result } = renderHook(() => useUploadAvatar(), {
      wrapper,
    });

    const input = {
      target: {
        files: [file],
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    await expect(result.current.uploadAvatar(input)).resolves.toBeUndefined();
  });

  it('deve lançar erro se nenhum arquivo for selecionado', async () => {
    const { result } = renderHook(() => useUploadAvatar(), { wrapper });

    const input = {
      target: {
        files: [],
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    await expect(result.current.uploadAvatar(input)).rejects.toThrow(
      'Selecione uma imagem.',
    );
  });

  it('deve lançar erro se o arquivo for maior que 8MB', async () => {
    const largeFile = new File(['large'], 'big.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 9 * 1024 * 1024 }); // 9MB

    const { result } = renderHook(() => useUploadAvatar(), { wrapper });

    const input = {
      target: {
        files: [largeFile],
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    await expect(result.current.uploadAvatar(input)).rejects.toThrow(
      'Imagem maior que 8MB.',
    );
  });
});
