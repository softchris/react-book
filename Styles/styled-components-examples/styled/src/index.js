import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
  <ThemeProvider theme={{ color: 'white', bgcolor: 'red' }}>
    <App />
  </ThemeProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
