import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import { Skeleton } from '@mui/material';
import { useContext, useMemo } from 'react';

const useAvatar = ({ size = 25 }) => {
  const { session } = useAuthState();
  const { avatar } = useContext(Context);

  const username = useMemo(
    () =>
      `${session?.user?.user_metadata?.first_name} ${session?.user?.user_metadata?.last_name}`,
    [session],
  );

  const memoizedAvatarSrc = useMemo(() => avatar ?? undefined, [avatar]);

  const memoizedSkeleton = useMemo(
    () => (
      <Skeleton
        data-testid="skeleton"
        variant="circular"
        width={size}
        height={size}
      />
    ),
    [],
  );

  return {
    username,
    memoizedAvatarSrc,
    memoizedSkeleton,
  };
};

export default useAvatar;
