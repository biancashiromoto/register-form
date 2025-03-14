import { useContext } from 'react';
import Navbar from '../Navbar';
import { CustomSwitch } from '../Switch';
import { Context } from '@/context';

const Header = () => {
  const { toggleTheme, isDarkModeOn } = useContext(Context);

  return (
    <header style={{ display: 'flex', alignItems: 'center', height: '3em' }}>
      <CustomSwitch onChange={toggleTheme} checked={isDarkModeOn} />
      <Navbar style={{ position: 'absolute', right: '12px' }} />
    </header>
  );
};

export default Header;
