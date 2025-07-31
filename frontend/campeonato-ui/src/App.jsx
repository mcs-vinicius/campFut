// /campeonato-ui/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';

// 1. Importe o ToastContainer e o CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importações de Rotas e Páginas
import ProtectedRoute from './router/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import RankingPage from './pages/Public/RankingPage';
import RoundsPage from './pages/Public/RoundsPage';
import LoginPage from './pages/LoginPage';
import ParticipantPage from './pages/Admin/ParticipantPage';
import AdminRoundsPage from './pages/Admin/AdminRoundsPage';
import SettingsPage from './pages/Admin/SettingsPage';


function App() {
  return (
    <BrowserRouter>
      {/* 2. Adicione o ToastContainer aqui. Ele ficará invisível até ser chamado. */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Essencial para nossa estética!
      />
      <GlobalStyles />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<RankingPage />} />
        <Route path="/rodadas" element={<RoundsPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas de Admin (Protegidas) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<ParticipantPage />} />
            <Route path="rodadas" element={<AdminRoundsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;