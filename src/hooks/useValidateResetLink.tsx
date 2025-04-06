import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';

const useValidateResetLink = () => {
  const [isValidResetLink, setIsValidResetLink] = useState(false);
  const [isLoadingValidateResetLink, setIsLoadingValidateResetLink] =
    useState(true);
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();
  const { currentSession } = useAuth();

  useEffect(() => {
    const validateResetLink = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');

        if (type !== 'recovery' && !accessToken) {
          console.log('type: ', type);
          console.log('accessToken: ', accessToken);
          console.log(
            'type !== "recovery" && !accessToken: ',
            type !== 'recovery' && !accessToken,
          );
          return;
        }

        if (!accessToken) return;
        console.log('ACCESS TOKEN:', accessToken);

        const { error } = await supabase.auth.getUser(accessToken);
        console.log('error: ', error);
        if (error) throw error;

        setIsValidResetLink(true);
      } catch (error: any) {
        console.log('error: ', error);
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
