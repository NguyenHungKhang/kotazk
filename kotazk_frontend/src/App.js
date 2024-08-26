// App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material';
import Playground from './playgrounds';
import TestDND from './playgrounds/components/TestDND';
import TestGantt from './playgrounds/components/TestGantt';
import TestSideBar from './playgrounds/components/TestSideBar';
import "./syncfusion-license"
import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import '../node_modules/@syncfusion/ej2-layouts/styles/material.css';
import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-grids/styles/material.css';
import '../node_modules/@syncfusion/ej2-treegrid/styles/material.css';
import '../node_modules/@syncfusion/ej2-react-gantt/styles/material.css';
import Router from './routes/router';
import { BrowserRouter } from 'react-router-dom';


const App = () => {
  const [primaryColor, setPrimaryColor] = useState('#2863E5'); // Màu chủ đạo mặc định
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
      // mode: darkMode ? 'dark' : 'light', // Chế độ dark mode
      mode: 'dark',
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
            // style: {
            //   backgroundColor: lightBackgroundColor,
            // },
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
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <CustomDarkModeSwitch darkMode={darkMode} onDarkModeChange={handleDarkModeChange} /> */}
        {/* <CustomPrimaryColorThemePicker onColorChange={handleColorChange} /> */}
        {/* <TestDND /> */}
        {/* <Playground /> */}
        {/* <TestGantt/> */}
        <Router />
        {/* <TestSideBar /> */}
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
