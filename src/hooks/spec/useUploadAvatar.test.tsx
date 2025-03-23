// src/hooks/spec/useUploadAvatar.test.tsx
import useUploadAvatar from '../useUploadAvatar';
import { vi } from 'vitest';
import { ReactNode, ChangeEvent } from 'react';
import { AuthProvider } from '@/context/authContext';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';

global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');

const fakeUser = {
  id: '123',
  user_metadata: { avatar_url: 'test-avatar.png' },
};

vi.mock('@/context/authContext', () => {
  return {
    useAuth: () => ({
      user: fakeUser,
      setUser: vi.fn(),
      currentSession: null,
      setCurrentSession: vi.fn(),
      initializing: false,
      userRef: { current: fakeUser },
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider
    value={{
      user: fakeUser,
      setUser: () => {},
      currentSession: null,
      setCurrentSession: () => {},
      initializing: false,
      userRef: { current: fakeUser },
    }}
  >
    <Context.Provider
      value={{ setSnackbarState: vi.fn() } as unknown as ContextProps}
    >
      {children}
    </Context.Provider>
  </AuthProvider>
);

vi.mock('@/services/supabase', () => {
  return {
    supabase: {
      storage: {
        from: vi.fn(() => ({
          download: vi.fn(async (path: string) => {
            if (path === 'test-avatar.png') {
              return {
                data: new Blob(['fake image'], { type: 'image/png' }),
                error: null,
              };
            }
            return { data: null, error: new Error('Not found') };
          }),
          upload: vi.fn(async (_path: string, _file: File, _options: any) => {
            return { error: null };
          }),
        })),
      },
      auth: {
        updateUser: vi.fn(async (_data: any) => ({ data: null, error: null })),
        onAuthStateChange: vi.fn(() => ({
          subscription: { unsubscribe: vi.fn() },
        })),
        getSession: vi.fn(async () => ({ data: { session: null } })),
      },
    },
  };
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;

describe('useUploadAvatar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('deve definir avatarUrl e isLoading como false quando o usuário possui avatar_url', async () => {
    const { result } = renderHook(() => useUploadAvatar(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.avatarUrl).toBe('blob:fake-url');
    });
  });

  test('deve realizar upload e atualizar o avatar quando um arquivo válido é enviado', async () => {
    const { result } = renderHook(() => useUploadAvatar(), { wrapper });
    await act(async () => {
      const file = new File(['dummy content'], 'avatar.png', {
        type: 'image/png',
      });
      const event = {
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      await result.current.uploadAvatar(event);
    });

    expect(result.current.isLoading).toBe(false);
    const { supabase } = await import('@/services/supabase');
    expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
    expect(supabase.auth.updateUser).toHaveBeenCalled();
  });

  test('deve tratar a ausência de arquivo selecionado', async () => {
    const { result } = renderHook(() => useUploadAvatar(), { wrapper });
    await act(async () => {
      const event = {
        target: { files: [] },
      } as unknown as ChangeEvent<HTMLInputElement>;
      await result.current.uploadAvatar(event);
    });
    expect(result.current.isLoading).toBe(false);
  });

  test('deve tratar erro quando o arquivo excede o tamanho máximo', async () => {
    const { result } = renderHook(() => useUploadAvatar(), { wrapper });
    await act(async () => {
      const largeFile = new File(['a'.repeat(MAX_FILE_SIZE + 1)], 'large.png', {
        type: 'image/png',
      });
      const event = {
        target: { files: [largeFile] },
      } as unknown as ChangeEvent<HTMLInputElement>;
      await result.current.uploadAvatar(event);
    });
    expect(result.current.isLoading).toBe(false);
  });
});
