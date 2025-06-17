import { Context } from '@/context';
import { updateUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

const useUpdateUser = () => {
  const { handleOpenSnackbar } = useContext(Context);

  const { mutate, isPending } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: (data: any) => updateUser(data),
    onSuccess: () => {
      handleOpenSnackbar({
        message: 'User successfully updated!',
        severity: 'success',
      });
    },
    onError: (error) => handleOpenSnackbar({ ...error, severity: 'error' }),
  });

  return { mutate, isPending };
};

export default useUpdateUser;
