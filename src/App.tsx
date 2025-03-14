import { Container } from '@mui/material';
import Footer from './components/Footer';
import Header from './components/Header';
import VerificationLayout from './components/VerificationLayout';

function App() {
  return (
    <Container maxWidth="sm">
      <VerificationLayout>
        <Header />
        <Footer />
      </VerificationLayout>
    </Container>
  );
}

export default App;
