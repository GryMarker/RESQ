import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { IncidentProvider } from './contexts/IncidentContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <AuthProvider>
      <IncidentProvider>
        <AppRoutes />
      </IncidentProvider>
    </AuthProvider>
  );
};

export default App;