import Provider from '@/context/Provider';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { createRootRoute } from '@tanstack/react-router';
import App from '../App';

const defaultTheme = createTheme();

export const Route = createRootRoute({
  component: () => {
    return (
      <Provider>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    );
  },
});
