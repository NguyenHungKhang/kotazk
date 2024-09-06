// App.js
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../node_modules/@syncfusion/ej2-grids/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-layouts/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-react-gantt/styles/material.css';
import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-treegrid/styles/material.css';
import Router from './routes/router';
import "./syncfusion-license";
import { ThemeProviderWrapper } from './themes/ThemeContext';


const App = () => {
  return (
    <BrowserRouter>
      <ThemeProviderWrapper>
        <CssBaseline />
        <Router />
      </ThemeProviderWrapper>
    </BrowserRouter>
  );
};

export default App;
