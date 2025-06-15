import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';
import ToggleThemeSwitch from '../ToggleThemeSwitch';

const Header = () => {
  return (
    <Container>
      <Box
        component="header"
        style={{ display: 'flex', alignItems: 'center', height: '3em' }}
      >
        <ToggleThemeSwitch />
        <Navbar style={{ position: 'absolute', right: '12px' }} />
      </Box>
    </Container>
  );
};

export default Header;
