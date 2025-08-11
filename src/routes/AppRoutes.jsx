import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../components/AppLayout/AppLayout';

// Pages
import Login from '../pages/Login/Login';
import Incidents from '../pages/Incidents/Incidents';
import NotFound from '../pages/NotFound';
import Dispatch from '../pages/Dispatch/Dispatch';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/incidents" replace /> : <Login />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/incidents" replace />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/incidents/:id" element={<div>Incident Detail - Coming Soon</div>} />
                <Route path="/dispatch" element={<Dispatch />} />
                <Route path="/map" element={<div>Map View - Coming Soon</div>} />
                <Route path="/responders" element={<div>Responders - Coming Soon</div>} />
                <Route path="/reports" element={<div>Reports - Coming Soon</div>} />
                <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;