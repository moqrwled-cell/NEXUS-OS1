import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyToolAccess } from '../utils/auth';

export default function ProtectedRoute({ children, tool = 'contractcompare' }) {
  const location = useLocation();
  const hasAccess = verifyToolAccess(tool) || verifyToolAccess('all');

  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
