import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  //check authemtication
  return false ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
