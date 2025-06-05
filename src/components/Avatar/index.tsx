import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import { Avatar as MUIAvatar, Skeleton } from '@mui/material';
import { useContext, useMemo } from 'react';

interface AvatarProps {
  size?: number;
}

const Avatar = ({ size = 20 }: AvatarProps) => {
  const { session } = useAuthState();
  const { avatarPath, isLoadingAvatar } = useContext(Context);

  const username = useMemo(
    () =>
      `${session?.user?.user_metadata?.first_name} ${session?.user?.user_metadata?.last_name}`,
    [session],
  );

  if (isLoadingAvatar) {
    return (
      <Skeleton
        data-testid="skeleton"
        variant="circular"
        width={size}
        height={size}
      />
    );
  }

  if (!avatarPath) {
    return (
      <MUIAvatar
        alt={username}
        sx={{
          width: size,
          height: size,
          border: '2px solid',
          borderColor: 'primary.main',
        }}
      />
    );
  }

  return (
    <MUIAvatar
      src={avatarPath}
      sx={{
        width: size,
        height: size,
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    />
  );
};

export default Avatar;
