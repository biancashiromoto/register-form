import { supabase } from '@/services/supabase';
import { UserType } from '@/types';
import { Session } from '@supabase/supabase-js';

export const AVATAR_BUCKET = 'avatars';

export const signUpUser = async (user: UserType) => {
  const { email, password, firstName, lastName, birthDate, address } = user;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        address: {
          country: address.country,
          state: address.state,
          city: address.city,
        },
      },
    },
  });

  if (error) throw new Error(error.message);

  return { data };
};

export const loginUser = async (
  userInfo: Pick<UserType, 'email' | 'password'>,
) => {
  const { email, password } = userInfo;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return { data };
};

const getSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);

  return session;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();

  return !!session;
};

export const updateUser = async (user: UserType) => {
  const { email, firstName, lastName, birthDate } = user;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !user) return;

  const { error } = await supabase.auth.admin.updateUserById(session.user.id, {
    email,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
    },
  });

  if (error) throw new Error(error.message);

  return { ok: true };
};

export const resetPassword = async (password: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !password) return;

  const { error, data } = await supabase.auth.admin.updateUserById(
    session.user.id,
    {
      password,
    },
  );

  if (error) throw new Error(error.message);

  return { data };
};

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
export const fetchAvatar = async () => {
  const session = await getSession();

  if (!session) return;
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

export const uploadAvatar = async (file: File) => {
  const convertedFile = await convertToWebp(file);
  const session = await getSession();

  if (!session) return;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(`${session.user.id}/avatar.webp`, convertedFile, {
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const publicUrl = fetchAvatar();
  return publicUrl;
};
