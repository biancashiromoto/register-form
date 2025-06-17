import { Context } from '@/context';
import { uploadAvatar } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useCallback, useContext } from 'react';

const useAvatarUploader = () => {
  const { refetchAvatar, setSnackbarState } = useContext(Context);

  const handleSuccessfulAvatarUpload = useCallback(async () => {
    await Promise.resolve(refetchAvatar());
    setSnackbarState({
      open: true,
      message: 'Avatar successfully uploaded!',
      severity: 'success',
    });
  }, [setSnackbarState, refetchAvatar]);

  const { mutate: handleUpload, isPending } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: handleSuccessfulAvatarUpload,
    onError: (error) => {
      setSnackbarState({
        open: true,
        message: error.message,
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
    isPending,
  };
};

export default useAvatarUploader;
