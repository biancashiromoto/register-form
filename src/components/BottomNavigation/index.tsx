import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';

export default function CustomBottomNavigation() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
}
