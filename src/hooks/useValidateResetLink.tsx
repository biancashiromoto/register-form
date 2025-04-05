import { Context } from '@/context';
import { supabase } from '@/services/supabase';
import { useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';

const useValidateResetLink = () => {
  const [isValidResetLink, setIsValidResetLink] = useState(false);
  const [isLoadingValidateResetLink, setIsLoadingValidateResetLink] =
    useState(true);
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const validateResetLink = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');

        if (type !== 'recovery' || !accessToken) {
          // setSnackbarState({
          //   open: true,
          //   message: 'Invalid password reset link',
          //   severity: 'error',
          // });
          // navigate({ to: '/login' });
          console.log('passou aqui');
          console.log('type: ', type);
          console.log('accessToken: ', accessToken);
          return;
        }

        const { error } = await supabase.auth.getUser(accessToken);
        console.log('error: ', error);
        if (error) throw error;

        setIsValidResetLink(true);
      } catch (error: any) {
        setSnackbarState({
          open: true,
          message: error.message || 'Invalid password reset link',
          severity: 'error',
        });
        navigate({ to: '/login' });
      } finally {
        setIsLoadingValidateResetLink(false);
      }
    };

    validateResetLink();
  }, []);

  return { isLoadingValidateResetLink, isValidResetLink };
};

export default useValidateResetLink;
