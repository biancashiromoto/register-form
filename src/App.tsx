import { useEffect } from 'react';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    console.log('VITE_PROJECT_URL:', process.env.VITE_PROJECT_URL);
  }, []);

  return (
    <>
      <header>
        <h1>Project Register Form</h1>
      </header>
      <Footer />
    </>
  );
}

export default App;
