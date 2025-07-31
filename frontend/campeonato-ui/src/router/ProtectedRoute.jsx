// src/router/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');

  // Se o token existe, renderiza o conteúdo da rota (usando <Outlet />).
  // Se não, redireciona para a página de login.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;