import { useContext } from 'react';
import Navbar from '../Navbar';
import { ToggleThemeSwitch } from '../ToggleThemeSwitch';
import { Context } from '@/context';
import { Container } from '@mui/material';

const Header = () => {
  const { toggleTheme, isDarkModeOn } = useContext(Context);

  return (
    <Container>
      <header style={{ display: 'flex', alignItems: 'center', height: '3em' }}>
        <ToggleThemeSwitch onChange={toggleTheme} checked={isDarkModeOn} />
        <Navbar style={{ position: 'absolute', right: '12px' }} />
      </header>
    </Container>
  );
};

export default Header;
