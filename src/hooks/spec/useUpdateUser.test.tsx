import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import useUpdateUser from '../useUpdateUser';
import { updateUser } from '@/services/user';
import { FC, ReactNode } from 'react';
import { mockUser } from '@/tests/mocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/services/user', () => ({
  updateUser: vi.fn(),
}));

describe('useUpdateUser', () => {
  let handleOpenSnackbarMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    handleOpenSnackbarMock = vi.fn();
    queryClient = new QueryClient();
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <Context.Provider
      value={{ handleOpenSnackbar: handleOpenSnackbarMock } as ContextProps}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );

  it('should successfully update user', async () => {
    (updateUser as any).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    act(() => {
      result.current.mutate(mockUser);
    });

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockUser);

      expect(handleOpenSnackbarMock).toHaveBeenCalledWith({
        message: 'User successfully updated!',
        severity: 'success',
      });
    });
  });

  it('should handle error updating user', async () => {
    const errorMessage = 'Erro ao atualizar usuário';
    const error = new Error(errorMessage);
    (updateUser as any).mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateUser(), { wrapper });

    act(() => {
      result.current.mutate(mockUser);
    });

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockUser);

      expect(handleOpenSnackbarMock).toHaveBeenCalledWith({
        ...error,
        severity: 'error',
      });
    });
  });
});
