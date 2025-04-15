
// main.tsx or index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProviderCustom } from './components/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProviderCustom>
        <App />
      </ThemeProviderCustom>
    </BrowserRouter>
  </React.StrictMode>
);

