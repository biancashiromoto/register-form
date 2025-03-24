import { Context } from '@/context';
import { privateRoutes } from '@/utils/commons/privateRoutes';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { useNavigate } from '@tanstack/react-router';
import { memo, useContext, useEffect, useRef, useState } from 'react';

export default memo(function CustomBottomNavigation() {
  const { normalizedPath } = useContext(Context);
  const [value, setValue] = useState(privateRoutes.indexOf(normalizedPath));
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const index = privateRoutes.indexOf(normalizedPath);
    if (index !== value) {
      setValue(index);
    }
  }, [normalizedPath]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: 'fixed', bottom: 36, left: 0, right: 0, marginTop: 6 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {/* <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} /> */}
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => navigate({ to: '/home', viewTransition: true })}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<AccountCircleIcon />}
            onClick={() => navigate({ to: '/profile', viewTransition: true })}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
});
