import CustomBottomNavigation from '@/components/BottomNavigation';
import { Container, Typography } from '@mui/material';
import { useContext } from 'react';
import VerificationLayout from './components/VerificationLayout';
import { Context } from './context';
import { useAuth } from './context/authContext';
import Provider from './context/Provider';
import usePageTitle from './hooks/usePageTitle';

const App = () => {
  const { isPrivateRoute } = useContext(Context);
  const { page } = usePageTitle();
  const { sessionRef } = useAuth();

  return (
    <Provider>
      <VerificationLayout>
        <Container maxWidth="sm" sx={{ marginTop: '16px' }}>
          {((isPrivateRoute && sessionRef) ||
            (!isPrivateRoute && !sessionRef)) && (
            <Typography variant="h5" align="left" gutterBottom>
              {page?.title}
            </Typography>
          )}
        </Container>
        {isPrivateRoute && sessionRef && <CustomBottomNavigation />}
      </VerificationLayout>
    </Provider>
  );
};

export default App;
