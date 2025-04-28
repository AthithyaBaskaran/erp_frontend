import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProviderCustom');
  return context;
};

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved theme from localStorage or default to 'light'
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode); // Save theme preference
      return newMode;
    });
  };
 
  // Function to reset theme to light mode (can be called from logout)
  const resetTheme = () => {
    setMode('light');
    localStorage.setItem('theme', 'light');
  };

  // Apply theme class to body for global CSS styling
  useEffect(() => {
    // Remove both classes first
    document.body.classList.remove('light', 'dark');
    // Add the current theme class
    document.body.classList.add(mode);
    // Set data attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#1976d2',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#333333',
                  secondary: '#555555',
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#90caf9',
                },
                background: {
                  default: '#1d2634',
                  paper: '#263043',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#9e9ea4',
                },
              }),
        },
        breakpoints: {
          values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, resetTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};