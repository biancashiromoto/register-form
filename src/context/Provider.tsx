import { useAuthState } from '@/hooks/useAuthState';
import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { useLocation } from '@tanstack/react-router';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import ThemeProvider from './ThemeProvider';

// const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

/**
 * Fetches the public URL of a user's avatar image from Supabase Storage.
 *
 * This function checks if the file `avatar.webp` exists in the user's folder within the
 * 'avatars' storage bucket. If the file exists, it returns the public URL with a timestamp
 * query parameter to prevent caching. If the file does not exist or an error occurs during
 * the listing operation, it throws an error.
 *
 * @param session - The current user's session object containing user information.
 * @returns A promise that resolves to the public URL of the user's avatar image.
 * @throws Will throw an error if the avatar file is not found or if there is a listing error.
 *
 */
const fetchAvatar = async (session: Session) => {
  const path = `${session.user.id}/avatar.webp`;

  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list(session.user.id, { search: 'avatar.webp' });

  const fileExists = files?.some((file) => file.name === 'avatar.webp');

  if (listError || !fileExists) {
    throw new Error('Avatar file not found');
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);

  return `${data.publicUrl}?t=${Date.now()}`;
};

const convertToWebp = (file: File) => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Failed to get canvas context'));
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error('Conversion to webp failed'));
          const webpFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, '.webp'),
            {
              type: 'image/webp',
            },
          );
          resolve(webpFile);
        },
        'image/webp',
        0.92,
      );
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

const uploadAvatar = async (file: File, session: Session) => {
  const convertedFile = await convertToWebp(file);

  const { error } = await supabase.storage
    .from('avatars')
    .upload(`${session.user.id}/avatar.webp`, convertedFile, {
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const publicUrl = fetchAvatar(session);
  return publicUrl;
};

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const { session } = useAuthState();
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
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    if (session) {
      setIsLoadingAvatar(true);
      const getAvatar = async () => {
        const publicUrl = await fetchAvatar(session);
        setAvatarPath(publicUrl ?? null);
      };
      getAvatar();
      setIsLoadingAvatar(false);
    }
  }, [session]);

  useEffect(() => {
    setAvatarPath(session?.user?.user_metadata?.avatar_url);
  }, [session]);

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      setSnackbarState,
      registeringUser,
      setRegisteringUser,
      userLocation,
      setUserLocation,
      normalizedPath,
      avatarPath,
      isLoadingAvatar,
      uploadAvatar,
      setAvatarPath,
      setIsLoadingAvatar,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      normalizedPath,
      avatarPath,
      isLoadingAvatar,
      uploadAvatar,
      setAvatarPath,
      setIsLoadingAvatar,
    ],
  );

  return (
    <ThemeProvider>
      <Context.Provider value={value}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default Provider;
