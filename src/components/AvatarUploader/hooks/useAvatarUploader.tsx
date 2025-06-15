import { Context } from '@/context';
import { uploadAvatar } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import React, { ChangeEvent, useContext } from 'react';

const useAvatarUploader = () => {
  const { refetchAvatar, setSnackbarState } = useContext(Context);

  const { mutate: handleUpload } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: async () => {
      refetchAvatar();
      setSnackbarState({
        open: true,
        message: 'Avatar successfully uploaded!',
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbarState({
        open: true,
        message: 'Error uploading avatar',
        severity: 'error',
      });
    },
  });

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    handleUpload(e.target.files?.[0]);
  };

  return {
    handleAvatarUpload,
  };
};

export default useAvatarUploader;
