import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

let hasShownNoTokenAlert = false;
let hasShownUnauthorizedAlert = false;

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('session_token');

  // Reset guards when a token exists (user successfully logged in)
  if (token) {
    hasShownNoTokenAlert = false;
    hasShownUnauthorizedAlert = false;
  }

  if (!token) {
    // Redirect to the login page if there's no token
    if (!hasShownNoTokenAlert) {
      hasShownNoTokenAlert = true;
      alert('Por favor, inicie sesión para acceder a esta página.');
    }
    return <Navigate to="/" replace />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  if (requiredRole && userRole !== requiredRole && userRole !== 'Administrador') {
    if (!hasShownUnauthorizedAlert) {
      hasShownUnauthorizedAlert = true;
      alert('No está autorizado para ver esta página');
    }
    sessionStorage.removeItem('session_token');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;