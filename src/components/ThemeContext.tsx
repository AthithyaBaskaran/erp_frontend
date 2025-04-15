// src/components/ThemeContext.tsx
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
  }
  
  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  
  export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeContext must be used within ThemeProviderCustom');
    return context;
  };
  
  export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
  
    const toggleTheme = () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };
  
    // Optional: Add class to body for custom CSS overrides
    useEffect(() => {
      document.body.className = mode;
    }, [mode]);
  
    const theme = useMemo(
      () =>
        createTheme({
          palette: { mode },
          breakpoints: {
            values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
          },
        }),
      [mode]
    );
  
    return (
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  };
  