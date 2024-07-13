// App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material';
import Playground from './playgrounds';

const App = () => {
  const [primaryColor, setPrimaryColor] = useState('#7F77F1'); // Màu chủ đạo mặc định
  const [darkMode, setDarkMode] = useState(false); // Chế độ mặc định là Light Mode
  const lightBackgroundColor = useState(alpha(primaryColor, 0.2));

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
        fontSize: '4.2rem', // Tăng 2px so với mặc định
        lineHeight: 1.167,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 300,
        fontSize: '3.2rem', // Tăng 2px so với mặc định
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '2.7rem', // Tăng 2px so với mặc định
        lineHeight: 1.167,
        letterSpacing: '0em',
      },
      h4: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '2.2rem', // Tăng 2px so với mặc định
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.45rem', // Tăng 2px so với mặc định
        lineHeight: 1.334,
        letterSpacing: '0em',
      },
      h6: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '1.2rem', // Tăng 2px so với mặc định
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.075rem', // Tăng 2px so với mặc định
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.95rem', // Tăng 2px so với mặc định
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '1.075rem', // Tăng 2px so với mặc định
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.95rem', // Tăng 2px so với mặc định
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.95rem', // Tăng 2px so với mặc định
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
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
        textTransform: 'uppercase',
      },
    },
    palette: {
      // mode: darkMode ? 'dark' : 'light', // Chế độ dark mode
      mode: 'light',
      primary: {
        main: primaryColor,
      },
      // Các palette khác nếu cần
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
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
            style: {
              backgroundColor: lightBackgroundColor,
            },
          },
        ],
      },
    },
    customProperties: {
      '--primary-color': primaryColor,
    },
  });

  // const handleColorChange = (color) => {
  //   setPrimaryColor(color);
  // };

  // const handleDarkModeChange = (mode) => {
  //   setDarkMode(mode);
  // };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <CustomDarkModeSwitch darkMode={darkMode} onDarkModeChange={handleDarkModeChange} /> */}
      {/* <CustomPrimaryColorThemePicker onColorChange={handleColorChange} /> */}
      <Playground />
    </ThemeProvider>
  );
};

export default App;
