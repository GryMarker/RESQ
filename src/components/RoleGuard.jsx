import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-bootstrap';

const RoleGuard = ({ allowedRoles, children, fallback }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="warning" className="m-3">
        <Alert.Heading>Access Denied</Alert.Heading>
        <p>
          You don't have permission to access this resource. 
          Your current role ({user?.role || 'unknown'}) is not authorized for this action.
        </p>
        <hr />
        <p className="mb-0">
          Contact your administrator if you believe this is an error.
        </p>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;