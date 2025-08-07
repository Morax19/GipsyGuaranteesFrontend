import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './SessionContext';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}