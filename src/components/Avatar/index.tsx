import { Context } from '@/context';
import { Avatar as MUIAvatar, Skeleton } from '@mui/material';
import { useContext, useMemo } from 'react';

interface AvatarProps {
  size?: number;
}

const Avatar = ({ size = 20 }: AvatarProps) => {
  const { avatarPath, isLoadingAvatar, isPendingAvatar } = useContext(Context);
  const shouldShowLoader = useMemo(
    () => isLoadingAvatar || isPendingAvatar,
    [isLoadingAvatar, isPendingAvatar],
  );

  if (shouldShowLoader) {
    return <Skeleton variant="circular" width={size} height={size} />;
  }

  if (!avatarPath) {
    return (
      <MUIAvatar
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
