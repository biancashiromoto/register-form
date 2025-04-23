import { Context } from '@/context';
import { Box, Container } from '@mui/material';
import { useContext } from 'react';
import Navbar from '../Navbar';
import ToggleThemeSwitch from '../ToggleThemeSwitch';

const Header = () => {
  const { toggleTheme, isDarkModeOn } = useContext(Context);

  return (
    <Container>
      <Box
        component="header"
        style={{ display: 'flex', alignItems: 'center', height: '3em' }}
      >
        <ToggleThemeSwitch
          aria-label={`${isDarkModeOn ? 'Deactivate' : 'Activate'} dark mode`}
          onChange={toggleTheme}
          checked={isDarkModeOn}
        />
        <Navbar style={{ position: 'absolute', right: '12px' }} />
      </Box>
    </Container>
  );
};

export default Header;
