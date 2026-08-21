import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('nexus_access_token');
  const isVerified = localStorage.getItem('nexus_whop_verified');

  const isAuthenticated = token && isVerified === 'true';

  if (!isAuthenticated) {
    // Redirect them to the /app/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  return children;
}
