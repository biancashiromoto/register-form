import { Context } from '@/context';
import { Avatar as MUIAvatar } from '@mui/material';
import { useContext } from 'react';
import useAvatar from './hooks/useAvatar';

export interface AvatarProps {
  size?: number;
}

const Avatar = (props: AvatarProps) => {
  const { isLoadingAvatar } = useContext(Context);
  const { memoizedAvatarSrc, memoizedSkeleton, username } = useAvatar(props);

  if (isLoadingAvatar) return memoizedSkeleton;

  return (
    <MUIAvatar
      src={memoizedAvatarSrc}
      alt={username}
      sx={{
        width: props.size ?? 25,
        height: props.size ?? 25,
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    />
  );
};

export default Avatar;
