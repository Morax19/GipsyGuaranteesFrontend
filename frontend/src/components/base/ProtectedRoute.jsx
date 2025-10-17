import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('session_token');

  if (!token) {
    // Redirect to the login page if there's no token
    alert('Por favor, inicie sesión para acceder a esta página.');
    return <Navigate to="/" replace />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  if (requiredRole && userRole !== requiredRole && userRole !== 'Administrador') {
    alert(`No está autorizado para ver esta página`)
    sessionStorage.removeItem('session_token');
    return <Navigate to="/" replace />;
  }

  // Render the child components (the protected page) if a token exists
  return children;
};

export default ProtectedRoute;