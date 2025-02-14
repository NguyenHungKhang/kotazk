// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  // Load initial state from localStorage
  const storedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  useEffect(() => {
    // Save the current darkMode state to localStorage whenever it changes
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const theme = createTheme({
    spacing: factor => `${4 * factor}px`,
    typography: {
      htmlFontSize: 14,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 12,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 300,
        fontSize: '2.5rem', // Tăng 2px so với mặc định
        lineHeight: 1.167,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 300,
        fontSize: '2.0rem', // Tăng 2px so với mặc định
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.75rem', // Tăng 2px so với mặc định
        lineHeight: 1.167,
        letterSpacing: '0em',
      },
      h4: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.5rem', // Tăng 2px so với mặc định
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.25rem', // Tăng 2px so với mặc định
        lineHeight: 1.334,
        letterSpacing: '0em',
      },
      h6: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '1.125rem', // Tăng 2px so với mặc định
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem', // Tăng 2px so với mặc định
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.75rem', // Tăng 2px so với mặc định
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem', // Tăng 2px so với mặc định
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.75', // Tăng 2px so với mặc định
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem', // Tăng 2px so với mặc định
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        // textTransform: 'uppercase',
      },
      caption: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.825rem', // Tăng 2px so với mặc định
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.825rem', // Tăng 2px so với mặc định
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        // textTransform: 'uppercase',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light', // Chế độ dark mode
      // mode: 'dark',
      primary: {
        main: '#3D42E9',  // Vivid Blue
        light: '#7578FF', // Light Vivid Blue
        dark: '#0023B5',  // Dark Vivid Blue
        contrastText: '#FFFFFF', // White text
      },
      // primary: {
      //   main: '#22A595',  // Teal Green
      //   light: '#55C2B0', // Light Teal Green
      //   dark: '#007566',  // Dark Teal Green
      //   contrastText: '#FFFFFF', // White text
      // },
      secondary: {
        main: '#FF6347',  // Tomato Red
        light: '#FF8C70', // Light Tomato Red
        dark: '#C23B22',  // Dark Tomato Red
        contrastText: '#FFFFFF', // White text
      },
      error: {
        main: '#FF5B36',  // Vivid Red-Orange
        light: '#FF8A64', // Light Vivid Red-Orange
        dark: '#C22B0E',  // Dark Vivid Red-Orange
        contrastText: '#FFFFFF', // White text
      },
      warning: {
        main: '#FFA000',  // Amber
        light: '#FFC046', // Light Amber
        dark: '#C67100',  // Dark Amber
        contrastText: '#000000', // Black text
      },
      info: {
        main: '#0288D1',  // Light Blue
        light: '#5EB8FF', // Lighter Blue
        dark: '#005B9F',  // Darker Blue
        contrastText: '#FFFFFF', // White text
      },
      // success: {
      //   main: '#388E3C',  // Green
      //   light: '#66BB6A', // Light Green
      //   dark: '#00600F',  // Dark Green
      //   contrastText: '#FFFFFF', // White text
      // },
      success: {
        main: '#87DD2C',  // Bright Green
        light: '#A4E85A', // Light Bright Green
        dark: '#62A71F',  // Dark Bright Green
        contrastText: '#FFFFFF', // White text
      },
      customBlack: {
        main: '#121212',  // Almost Black
        light: '#424242', // Dark Gray
        dark: '#000000',  // Pure Black
        contrastText: '#FFFFFF', // White text
      },
      customWhite: {
        main: '#F5F5F5',  // Off White
        light: '#FFFFFF', // Pure White
        dark: '#CCCCCC',  // Light Gray
        contrastText: '#000000', // Black text
      },
      customGreen: {
        main: '#33F008',  // Bright Green
        light: '#66F33B', // Light Bright Green
        dark: '#009A00',  // Darker Bright Green
        contrastText: '#000000', // Black text
      },
      customPink: {
        main: '#FF6F61',  // Pinkish Orange
        light: '#FF8A73', // Light Pinkish Orange
        dark: '#C73C4C',  // Darker Pinkish Orange
        contrastText: '#FFFFFF', // White text
      },
      customSecondBackground: {
        main: '#f5f5fc',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
            },
            '&:focus': {
              boxShadow: 'none',
            },
          },
        },
        variants: [
          {
            props: { variant: 'outlined' },
            // style: {
            //   backgroundColor: lightBackgroundColor,
            // },
          },
        ],
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
