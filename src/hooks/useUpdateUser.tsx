import { Context } from '@/context';
import { scrollToTop } from '@/helpers';
import { updateUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

const useUpdateUser = () => {
  const { setSnackbarState } = useContext(Context);

  const { mutate, isPending } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: (data: any) => updateUser(data),
    onSuccess: () => {
      scrollToTop();
      setSnackbarState({
        open: true,
        message: 'User successfully updated!',
        severity: 'success',
      });
    },
    onError: (error) => {
      setSnackbarState({
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
  });

  return { mutate, isPending };
};

export default useUpdateUser;
