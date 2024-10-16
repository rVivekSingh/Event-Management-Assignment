import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
