import { Container } from '@mui/material';
import Footer from './components/Footer';
import Header from './components/Header';
import VerificationLayout from './components/VerificationLayout';
import { Outlet } from '@tanstack/react-router';

function App() {
  return (
    <VerificationLayout>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </VerificationLayout>
  );
}

export default App;
