import {
  getLocalStorage,
  setLocalStorage,
} from '@/helpers/localStorageManagement';
import { useAuthState } from '@/hooks/useAuthState';
import {
  fetchSignedAvatarUrl,
  formatAvatarPath,
  uploadUserAvatar,
} from '@/services/user';
import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { session } = useAuthState();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkModeOn, setIsDarkModeOn] = useState<boolean>(() => {
    const storedTheme = getLocalStorage('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return prefersDarkMode;
  });
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [registeringUser, setRegisteringUser] = useState<UserType | null>(null);
  const [userLocation, setUserLocation] = useState({} as UserLocationType);
  const location = useLocation();
  const normalizedPath = useMemo(
    () => location.pathname.replace(/\/$/, ''),
    [location.pathname],
  );

  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  const { data: avatarUrl, isLoading: isLoadingAvatar } = useQuery({
    queryKey: ['avatar'],
    queryFn: async () => await fetchSignedAvatarUrl(avatarPath),
    enabled: !!avatarPath,
    initialData: session?.user?.user_metadata?.avatar_url,
  });

  const { mutate: uploadAvatar, isPending: isPendingAvatar } = useMutation({
    mutationKey: ['avatar'],
    mutationFn: async (file: File) => {
      if (!session) return null;

      if (file.size > MAX_FILE_SIZE) throw new Error('Image larger than 8MB.');

      const path = formatAvatarPath(file, session);
      await uploadUserAvatar(path, file);

      const signedUrl = await fetchSignedAvatarUrl(path);
      if (!signedUrl) throw new Error('Failed to fetch signed URL.');

      setAvatarPath(signedUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatar'] });
      setSnackbarState({
        open: true,
        message: 'Avatar updated successfully!',
        severity: 'success',
      });
    },
    onError: (error: any) => {
      setSnackbarState({
        open: true,
        message: error.message || 'Failed to upload avatar.',
        severity: 'error',
      });
    },
  });

  useEffect(() => {
    if (!avatarUrl) return;
    setAvatarPath(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    setAvatarPath(session?.user?.user_metadata?.avatar_url);
  }, [session]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkModeOn ? 'dark' : 'light',
          background: {
            default: isDarkModeOn ? '#1D2125' : '#DEE4EA',
            paper: isDarkModeOn ? '#2D3748' : '#FFFFFF',
          },
          text: {
            primary: isDarkModeOn ? '#DEE4EA' : '#1D2125',
            secondary: isDarkModeOn ? '#A0AEC0' : '#4A5568',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDarkModeOn ? '#1D2125' : '#DEE4EA',
                color: isDarkModeOn ? '#DEE4EA' : '#1D2125',
              },
            },
          },
        },
      }),
    [isDarkModeOn],
  );

  const toggleTheme = useCallback(() => {
    setIsDarkModeOn((prevMode) => {
      const newMode = !prevMode;
      setLocalStorage('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      setSnackbarState,
      registeringUser,
      setRegisteringUser,
      userLocation,
      setUserLocation,
      isDarkModeOn,
      setIsDarkModeOn,
      toggleTheme,
      theme,
      normalizedPath,
      avatarPath,
      isLoadingAvatar,
      isPendingAvatar,
      uploadAvatar,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      isDarkModeOn,
      theme,
      normalizedPath,
      toggleTheme,
      avatarPath,
      isLoadingAvatar,
      isPendingAvatar,
      uploadAvatar,
    ],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Context.Provider value={value}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default Provider;
