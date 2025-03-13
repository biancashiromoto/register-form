import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useContext, useMemo } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VerificationLayout from './components/VerificationLayout';
import { Context } from './context';
import Header from './components/Header';

function App() {
  const { theme } = useContext(Context);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VerificationLayout>
        <Header />
        <Footer />
      </VerificationLayout>
    </ThemeProvider>
  );
}

export default App;
