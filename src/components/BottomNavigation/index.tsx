import { Context } from '@/context';
import { routes as mappedRoutes } from '@/hooks/usePageTitle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { useNavigate } from '@tanstack/react-router';
import { memo, useContext, useRef } from 'react';

export default memo(function CustomBottomNavigation() {
  const { normalizedPath } = useContext(Context);
  const routes = Object.values(mappedRoutes).map((route) => route.route);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: 'fixed', bottom: 36, left: 0, right: 0, marginTop: 6 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={normalizedPath}>
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => navigate({ to: '/home', viewTransition: true })}
            value="/home"
          />
          <BottomNavigationAction
            label="Profile"
            icon={<AccountCircleIcon />}
            onClick={() => navigate({ to: '/profile', viewTransition: true })}
            value="/profile"
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
});
