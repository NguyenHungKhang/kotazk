// App.js
import React, { useState, useEffect } from 'react';
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
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';


const App = () => {
  const [primaryColor, setPrimaryColor] = useState('#2863E5'); // Màu chủ đạo mặc định
  const [darkMode, setDarkMode] = useState(false); // Chế độ mặc định là Light Mode
  const lightBackgroundColor = useState(alpha(primaryColor, 0.2));

  // Bắt cài đặt mặc định của hệ thống hoặc từ localStorage
  useEffect(() => {
    // Kiểm tra nếu người dùng đã chọn chế độ trước đó trong localStorage
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode !== null) {
      // Nếu có giá trị trong localStorage, dùng giá trị đó
      setDarkMode(JSON.parse(savedMode));
    } else {
      // Nếu không, dùng cài đặt mặc định của hệ thống
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }

    // Lắng nghe thay đổi cài đặt hệ thống
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        // Nếu người dùng chưa chỉnh sửa, tiếp tục lắng nghe cài đặt hệ thống
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

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
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
      },
      background: {
        default: darkMode ? '#121212' : '#f4f6f8',
        paper: darkMode ? '#1E1E1E' : '#fff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
    },
  });

  // const handleColorChange = (color) => {
  //   setPrimaryColor(color);
  // };

  // Toggle chế độ dark mode
  const handleDarkModeChange = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      // Lưu lựa chọn của người dùng vào localStorage
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000, // Đảm bảo nút luôn hiển thị trên cùng
          }}
        >
          <IconButton onClick={handleDarkModeChange}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
