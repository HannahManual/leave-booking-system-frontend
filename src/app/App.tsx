import React from 'react';
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App

