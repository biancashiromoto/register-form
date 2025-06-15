import {
  getLocalStorage,
  setLocalStorage,
} from '@/helpers/localStorageManagement';
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
  useMediaQuery,
} from '@mui/material';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { PaletteMode } from '@mui/material';

const getThemePalette = (isDarkModeOn: boolean) => {
  const mode: PaletteMode = isDarkModeOn ? 'dark' : 'light';
  return {
    palette: {
      mode,
      background: {
        default: isDarkModeOn ? '#1D2125' : '#DEE4EA',
        paper: isDarkModeOn ? '#2D3748' : '#FFFFFF',
      },
      text: {
        primary: isDarkModeOn ? '#DEE4EA' : '#1D2125',
        secondary: isDarkModeOn ? '#A0AEC0' : '#4A5568',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDarkModeOn ? '#1D2125' : '#DEE4EA',
            color: isDarkModeOn ? '#DEE4EA' : '#1D2125',
          },
        },
      },
    },
  };
};

export const ThemeContext = createContext<{
  isDarkModeOn: boolean;
  toggleTheme: () => void;
}>({
  isDarkModeOn: false,
  toggleTheme: () => {},
});

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkModeOn, setIsDarkModeOn] = useState<boolean>(() => {
    const storedTheme = getLocalStorage('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return prefersDarkMode;
  });

  const theme = useMemo(
    () => createTheme(getThemePalette(isDarkModeOn)),
    [isDarkModeOn],
  );

  const toggleTheme = useCallback(() => {
    setIsDarkModeOn((prevMode) => {
      const newMode = !prevMode;
      setLocalStorage('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, [setIsDarkModeOn]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkModeOn,
        toggleTheme,
      }}
    >
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
